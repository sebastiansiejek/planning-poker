'use client';

import './room.styles.css';

import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import type { TriggerPaperThrowingParams } from '@/app/actions/notifications/triggerPaperThrowing';
import { voting } from '@/app/actions/voting';
import { Paper } from '@/app/alerts/Paper/Paper';
import type { RoomProps } from '@/app/game/[...room]/types';
import useNotification from '@/shared/hooks/useNotification/useNotification';
import { PUSHER_EVENTS } from '@/shared/pusher/config/PUSHER_EVENTS';
import { getPusherUserId } from '@/shared/pusher/lib/getPusherUserId';
import { pusherClient } from '@/shared/pusher/lib/pusherClient';
import { votingValues } from '@/shared/voting/config/votingConstants';
import type {
  PusherMember,
  PusherMembers,
  PusherNewMember,
  PusherNotification,
} from '@/types/pusher/pusher';
import type { Vote } from '@/types/types';
import { chunkMembers } from '@/widgets/room/libs/chunkMembers/chunkMembers';
import { useRoomContext } from '@/widgets/room/model/RoomContext';
import { Members } from '@/widgets/room/ui/Members/Members';
import { RoomTable } from '@/widgets/room/ui/RoomTable/RoomTable';
import { VotingAvg } from '@/widgets/room/ui/VotingAvg/VotingAvg';
import { VotingCard } from '@/widgets/room/ui/VotingCard/VotingCard';

export default function Room({ channelName, userName, avatarUrl }: RoomProps) {
  const [members, setMembers] = useState<PusherMember[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [me, setMe] = useState<PusherMember>();
  const pusher = useMemo(
    () =>
      pusherClient({
        name: userName,
        avatarUrl,
      }),
    [userName, avatarUrl],
  );
  const [voteValue, setVoteValue] = useState('');
  const [votedUserIds, setVotedUserIds] = useState<string[]>([]);
  const [isRevealedCards, setIsRevealedCards] = useState(false);
  const meId = me?.id || '';
  const memberChunks = useMemo(
    () => chunkMembers(members.sort((a, b) => a.name.localeCompare(b.name))),
    [members.length],
  );
  const [topMembers, leftMembers, bottomMembers, rightMembers] = memberChunks;
  const { notify } = useNotification();
  const t = useTranslations();
  const [papers, setPapers] = useState<
    Pick<TriggerPaperThrowingParams, 'triggerUser' | 'targetUser'>[]
  >([]);
  const { dispatch } = useRoomContext();

  useEffect(() => {
    const pusherChannel = pusher.subscribe(channelName);

    if (pusherChannel) {
      pusherChannel.bind(
        PUSHER_EVENTS.USER_ID(getPusherUserId()),
        async (data: PusherNotification) => {
          if (data.type === 'alarm') {
            notify(t('Member.notification.notice'));
            const audio = new Audio('/alarm.mp3');

            if (audio.paused) {
              await audio.play();
            }
          }
        },
      );

      pusherChannel.bind(
        PUSHER_EVENTS.PAPER_THROWN,
        ({ targetUser, triggerUser }: TriggerPaperThrowingParams) => {
          setPapers((oldPapers) => [
            ...oldPapers,
            {
              targetUser,
              triggerUser,
            },
          ]);
        },
      );

      pusherChannel.bind(
        PUSHER_EVENTS.SUBSCRIPTION_SUCCEEDED,
        (initialMembers: PusherMembers) => {
          const membersArray = Object.values(initialMembers.members);
          setMembers(membersArray);
          setMe(initialMembers.me);
          dispatch({
            type: 'SET_CURRENT_USER_ID',
            payload: {
              currentUserId: initialMembers.me.id,
            },
          });
        },
      );

      pusherChannel.bind(
        PUSHER_EVENTS.MEMBER_ADDED,
        (newMember: PusherNewMember) => {
          const {
            info: { name, id, avatarUrl: userAvatarUrl },
          } = newMember;
          setMembers((oldMembers) => [
            ...oldMembers.filter((member) => member.id !== id),
            {
              name,
              id,
              avatarUrl: userAvatarUrl,
            },
          ]);
        },
      );

      pusherChannel.bind(
        PUSHER_EVENTS.MEMBER_REMOVED,
        (member: PusherNewMember) => {
          setMembers((oldMembers) =>
            oldMembers.filter((m) => m.id !== member.id),
          );
        },
      );

      pusherChannel.bind(
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

      pusherChannel.bind(PUSHER_EVENTS.SHOW_VOTES, (vote: Vote) => {
        setVotes((oldVotes) => {
          const newVotes = oldVotes.filter((v) => v.userId !== vote.userId);
          return [...newVotes, vote];
        });
      });

      pusherChannel.bind(PUSHER_EVENTS.RESET_VOTES, () => {
        setVoteValue('');
        setVotes([]);
        setVotedUserIds([]);
        setIsRevealedCards(false);
      });

      pusherChannel.bind(PUSHER_EVENTS.REVEAL_VOTES, async () => {
        setIsRevealedCards(true);
      });
    }

    return () => {
      pusher.unsubscribe(channelName);
    };
  }, [channelName, pusher, userName]);

  return (
    <div>
      <div className="flex items-center justify-center flex-col lg:p-4">
        <div className="game-grid flex flex-col lg:grid lg:grid-cols-[12rem_1fr_12rem] lg:grid-rows-[repeat(3,0.6fr)] gap-8 justify-center min-h-20 items-center">
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
          <div className="flex gap-4 mt-8 flex-wrap p-6 justify-center">
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
      {papers.map(({ targetUser, triggerUser }, index) => (
        <Paper
          // eslint-disable-next-line react/no-array-index-key
          key={targetUser.id + index}
          targetUser={targetUser}
          triggerUser={triggerUser}
        />
      ))}
    </div>
  );
}
