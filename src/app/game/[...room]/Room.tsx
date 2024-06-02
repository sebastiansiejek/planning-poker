'use client';

import './room.styles.css';

import { useEffect, useMemo, useState } from 'react';

import { voting } from '@/app/actions/voting';
import type { RoomProps } from '@/app/game/[...room]/types';
import { PUSHER_EVENTS } from '@/shared/pusher/config/PUSHER_EVENTS';
import { pusherClient } from '@/shared/pusher/lib/pusherClient';
import { votingValues } from '@/shared/voting/config/votingConstants';
import type {
  PusherMember,
  PusherMembers,
  PusherNewMember,
} from '@/types/pusher/pusher';
import type { Vote } from '@/types/types';
import { chunkMembers } from '@/widgets/room/libs/chunkMembers/chunkMembers';
import { Members } from '@/widgets/room/ui/Members/Members';
import { RoomTable } from '@/widgets/room/ui/RoomTable/RoomTable';
import { VotingAvg } from '@/widgets/room/ui/VotingAvg/VotingAvg';
import { VotingCard } from '@/widgets/room/ui/VotingCard/VotingCard';

export default function Room({ channelName, userName }: RoomProps) {
  const [members, setMembers] = useState<PusherMember[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [me, setMe] = useState<PusherMember>();
  const pusher = useMemo(() => pusherClient({ name: userName }), [userName]);
  const [voteValue, setVoteValue] = useState('');
  const [votedUserIds, setVotedUserIds] = useState<string[]>([]);
  const [isRevealedCards, setIsRevealedCards] = useState(false);
  const meId = me?.id || '';
  const chunks = chunkMembers(members);
  const [topMembers, leftMembers, bottomMembers, rightMembers] = chunks;

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
  }, [channelName, pusher, userName]);

  return (
    <div>
      <div className="flex items-center justify-center flex-col">
        <div className="game-grid grid grid-cols-[12rem_1fr_12rem] grid-rows-[repeat(3,1fr)] gap-8 justify-center min-h-20 items-center">
          <Members
            isRevealedCards={isRevealedCards}
            votedUserIds={votedUserIds}
            members={topMembers}
            place="top"
            votes={votes}
          />
          <Members
            isRevealedCards={isRevealedCards}
            votedUserIds={votedUserIds}
            members={leftMembers}
            place="left"
            isVertical
            votes={votes}
          />
          <RoomTable
            channelName={channelName}
            meId={meId}
            voteValue={voteValue}
            isRevealedCards={isRevealedCards}
          />
          <Members
            isRevealedCards={isRevealedCards}
            votedUserIds={votedUserIds}
            members={rightMembers}
            place="right"
            isVertical
            votes={votes}
          />
          <Members
            isRevealedCards={isRevealedCards}
            votedUserIds={votedUserIds}
            members={bottomMembers}
            place="bottom"
            votes={votes}
          />
        </div>
        {/* TODO: send/show value only if revealed button is clicked  */}
        <form action={voting}>
          <div className="flex gap-4 mt-8">
            {votingValues.map((option) => {
              return (
                <VotingCard
                  key={option}
                  isDisabled={isRevealedCards}
                  voteValue={voteValue}
                  option={option}
                  setVoteValue={setVoteValue}
                />
              );
            })}
          </div>
          <input type="hidden" name="userId" defaultValue={meId} />
          <input type="hidden" name="channelName" defaultValue={channelName} />
        </form>
      </div>
      {isRevealedCards && <VotingAvg votes={votes} />}
    </div>
  );
}
