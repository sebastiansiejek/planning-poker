'use client';

import { useEffect, useMemo, useState } from 'react';

import { resetVotes } from '@/app/actions/resetVotes';
import { revealCards } from '@/app/actions/revealCards';
import { voting } from '@/app/actions/voting';
import type { RoomProps } from '@/app/game/[...room]/types';
import { PUSHER_EVENTS } from '@/shared/pusher/config/PUSHER_EVENTS';
import { pusherClient } from '@/shared/pusher/lib/pusherClient';
import type {
  PusherMember,
  PusherMembers,
  PusherNewMember,
} from '@/types/pusher/pusher';

const votingValues = ['0.5', '1', '3', '5', '8', '13', '?', '☕️'];
type Vote = { value: string; userId: string };

export default function Room({ channelName, userName }: RoomProps) {
  const [members, setMembers] = useState<PusherMember[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [me, setMe] = useState<PusherMember>();
  const pusher = useMemo(() => pusherClient({ name: userName }), [userName]);
  const [voteValue, setVoteValue] = useState('');
  const [votedUserIds, setVotedUserIds] = useState<string[]>([]);
  const [isRevealedCards, setIsRevealedCards] = useState(false);
  const correctVotes = votes
    .map((vote) => parseInt(vote.value, 10))
    .filter((v) => !Number.isNaN(v));
  const avgVotes =
    correctVotes.reduce((acc, v) => acc + v, 0) / correctVotes.length;
  const meId = me?.id || '';

  useEffect(() => {
    if (channelName) {
      const channel = pusher.subscribe(channelName);

      channel.bind(
        PUSHER_EVENTS.SUBSCRIPTION_SUCCEEDED,
        (initialMembers: PusherMembers) => {
          setMembers(Object.values(initialMembers.members));
          setMe(initialMembers.me);
        },
      );

      channel.bind(PUSHER_EVENTS.MEMBER_ADDED, (newMember: PusherNewMember) => {
        const {
          info: { name, id },
        } = newMember;
        setMembers((oldMembers) => [
          ...oldMembers.filter((member) => member.id !== id),
          {
            name,
            id,
          },
        ]);
      });

      channel.bind(PUSHER_EVENTS.MEMBER_REMOVED, (member: PusherNewMember) => {
        setMembers((oldMembers) =>
          oldMembers.filter((m) => m.id !== member.id),
        );
      });

      channel.bind(
        PUSHER_EVENTS.VOTED,
        (data: { userId: string; value: string }) => {
          const { userId } = data;
          setVotedUserIds((oldVotedUsers) => [...oldVotedUsers, userId]);
          setVotes((oldVotes) => {
            const newVotes = oldVotes.filter((v) => v.userId !== userId);
            return [...newVotes, data];
          });
        },
      );

      channel.bind(PUSHER_EVENTS.SHOW_VOTES, (vote: Vote) => {
        setVotes((oldVotes) => {
          const newVotes = oldVotes.filter((v) => v.userId !== vote.userId);
          return [...newVotes, vote];
        });
      });

      channel.bind(PUSHER_EVENTS.RESET_VOTES, () => {
        setVoteValue('');
        setVotes([]);
        setVotedUserIds([]);
        setIsRevealedCards(false);
      });

      channel.bind(PUSHER_EVENTS.REVEAL_VOTES, async () => {
        setIsRevealedCards(true);
      });
    }

    return () => {
      pusher.unsubscribe(channelName);
    };
  }, [channelName, userName]);

  return (
    <div>
      <h1>Game</h1>
      {members.map((member) => {
        const vote = votes.find(
          (oldVotes) => oldVotes.userId === member.id,
        )?.value;

        return (
          <div key={member.id}>
            <div>name: {member.name}</div>
            <div>id: {member.id}</div>
            {isRevealedCards && <div>vote: {vote}</div>}
            <div>{votedUserIds.includes(member.id) ? '✅' : '❌'}</div>
          </div>
        );
      })}
      {isRevealedCards && !!avgVotes && (
        <div>
          <h2>AVG</h2>
          <div>{avgVotes}</div>
        </div>
      )}
      {/* TODO: send/show value only if revealed button is clicked  */}
      <form action={voting}>
        {votingValues.map((option) => {
          return (
            <label key={option}>
              <input
                name="value"
                type="radio"
                disabled={isRevealedCards}
                value={option}
                checked={voteValue === option}
                onChange={(e) => {
                  e.currentTarget.form?.requestSubmit();
                  setVoteValue(e.currentTarget.value);
                }}
              />
              {option}
            </label>
          );
        })}
        <input type="hidden" name="userId" defaultValue={meId} />
        <input type="hidden" name="channelName" defaultValue={channelName} />
      </form>
      <form action={revealCards}>
        <input type="hidden" name="userId" defaultValue={meId} />
        <input type="hidden" name="voteValue" defaultValue={voteValue} />
        <input type="hidden" name="channelName" defaultValue={channelName} />
        <button type="submit">Reveal cards</button>
      </form>
      <form action={resetVotes}>
        <input type="hidden" name="channelName" defaultValue={channelName} />
        <button type="submit">Reset</button>
      </form>
    </div>
  );
}
