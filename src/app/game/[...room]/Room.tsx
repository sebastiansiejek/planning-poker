'use client';

import './room.styles.css';

import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import type { RoomProps } from '@/app/game/[...room]/types';
import useNotification from '@/shared/hooks/useNotification/useNotification';
import { PUSHER_EVENTS } from '@/shared/pusher/config/PUSHER_EVENTS';
import { getPusherUserId } from '@/shared/pusher/lib/getPusherUserId';
import { pusherClient } from '@/shared/pusher/lib/pusherClient';
import type {
  PusherMember,
  PusherMembers,
  PusherNewMember,
  PusherNotification,
} from '@/shared/types/pusher/pusher';
import type { Vote } from '@/shared/types/types';
import { Paper } from '@/widgets/Alerts/ui/Paper/Paper';
import type { TriggerPaperThrowingParams } from '@/widgets/Room/actions/alerts/triggerPaperThrowing';
import { voting } from '@/widgets/Room/actions/voting';
import { votingValues } from '@/widgets/Room/config/votingConstants';
import { chunkMembers } from '@/widgets/Room/libs/chunkMembers/chunkMembers';
import { useRoomContext } from '@/widgets/Room/model/RoomContext';
import { GameContainer } from '@/widgets/Room/ui/Game/GameContainer/GameContainer';
import { Members } from '@/widgets/Room/ui/Members/Members';
import { RoomTable } from '@/widgets/Room/ui/RoomTable/RoomTable';
import { VotingAvg } from '@/widgets/Room/ui/VotingAvg/VotingAvg';
import { VotingCard } from '@/widgets/Room/ui/VotingCard/VotingCard';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [members.length],
  );
  const [topMembers, leftMembers, bottomMembers, rightMembers] = memberChunks;
  const { notify } = useNotification();
  const t = useTranslations();
  const [papers, setPapers] = useState<
    Pick<TriggerPaperThrowingParams, 'triggerUser' | 'targetUser'>[]
  >([]);
  const { dispatch } = useRoomContext();
  const areVotes = votes.length > 0;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelName, pusher, userName]);

  return (
    <div>
      <div className="flex items-center justify-center flex-col lg:p-4">
        <GameContainer>
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
            areVotes={areVotes}
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
        </GameContainer>
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
