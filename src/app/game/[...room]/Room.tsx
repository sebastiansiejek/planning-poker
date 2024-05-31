'use client';

import { useEffect, useMemo, useState } from 'react';

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

const votingValues = [0, 1, 3, 5, 8, 13, '?', '☕️'];
type Vote = { value: string; userId: string };

export default function Room({ channelName, userName }: RoomProps) {
  const [members, setMembers] = useState<PusherMember[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [me, setMe] = useState<PusherMember>();
  const pusher = useMemo(() => pusherClient({ name: userName }), [userName]);
  const [voteValue, setVoteValue] = useState('');
  const [votedUserIds, setVotedUserIds] = useState<string[]>([]);

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

      channel.bind(PUSHER_EVENTS.VOTED, ({ userId }: { userId: string }) => {
        setVotedUserIds((oldVotedUsers) => [...oldVotedUsers, userId]);
      });

      channel.bind(PUSHER_EVENTS.VOTES, (vote: Vote) => {
        setVotes((oldVotes) => {
          const newVotes = oldVotes.filter((v) => v.userId !== vote.userId);
          return [...newVotes, vote];
        });
      });
    }

    return () => {
      pusher.unsubscribe(channelName);
    };
  }, [channelName, userName, pusher]);

  return (
    <div>
      <h1>Game</h1>
      {members.map((member) => {
        const vote = votes.find(
          (oldVotes) => oldVotes.userId === member.id,
        )?.value;

        return (
          <div key={member.id}>
            {member.name} {member.id} {vote}
            {votedUserIds.includes(member.id) ? '✅' : '❌'}
          </div>
        );
      })}
      <form action={voting}>
        {votingValues.map((option) => (
          <label key={option}>
            <input
              name="value"
              type="radio"
              value={option}
              onClick={(e) => {
                setVoteValue(e.currentTarget.value);
                e.currentTarget.form?.requestSubmit();
              }}
            />
            {option}
          </label>
        ))}
        <input type="hidden" name="userId" value={me?.id} />
        <input type="hidden" name="channelName" value={channelName} />
      </form>
      <form action={revealCards}>
        <input type="hidden" name="userId" value={me?.id} />
        <input type="hidden" name="voteValue" value={voteValue} />
        <input type="hidden" name="channelName" value={channelName} />
        <button type="submit">Reveal cards</button>
      </form>
    </div>
  );
}
