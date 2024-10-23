'use client';

import { useTranslations } from 'next-intl';
import { useAction } from 'next-safe-action/hooks';
import { useEffect, useMemo, useState } from 'react';

import type { RoomProps } from '@/app/game/[...room]/types';
import useNotification from '@/shared/hooks/useNotification/useNotification';
import { PUSHER_EVENTS } from '@/shared/pusher/config/PUSHER_EVENTS';
import { pusherClient } from '@/shared/pusher/lib/pusherClient';
import type {
  PusherMember,
  PusherNewMember,
  PusherNotification,
} from '@/shared/types/pusher/pusher';
import type { Vote } from '@/shared/types/types';
import { Container } from '@/shared/UIKit/Container/Container';
import { PageHeading } from '@/shared/UIKit/PageHeading/PageHeading';
import { Paper } from '@/widgets/Alerts/ui/Paper/Paper';
import type { TriggerPaperThrowingParams } from '@/widgets/Room/actions/alerts/triggerPaperThrowing';
import { getGameVotes } from '@/widgets/Room/actions/getGameVotes';
import { chunkMembers } from '@/widgets/Room/libs/chunkMembers/chunkMembers';
import type { RoomContextType } from '@/widgets/Room/model/RoomContext';
import { useRoomContext } from '@/widgets/Room/model/RoomContext';
import { GameContainer } from '@/widgets/Room/ui/Game/GameContainer/GameContainer';
import { Members } from '@/widgets/Room/ui/Members/Members';
import { RoomTable } from '@/widgets/Room/ui/RoomTable/RoomTable';
import { VotingAvg } from '@/widgets/Room/ui/VotingAvg/VotingAvg';
import { VotingForm } from '@/widgets/Room/ui/VotingForm/VotingForm';

export default function Room({
  id: roomId,
  name: roomName,
  members: initialMembers,
  initialVotes = [],
  finishedGameVotes = [],
}: RoomProps) {
  const { dispatch, room } = useRoomContext();
  const [members, setMembers] = useState<RoomProps['members']>(initialMembers);
  const [votes, setVotes] = useState<Vote[]>(finishedGameVotes);
  const [votedUserIds, setVotedUserIds] = useState<string[]>(initialVotes);
  const [me] = useState<PusherMember>();
  const pusher = useMemo(() => pusherClient(), []);
  const activeGame = room?.game;
  const isFinishedGame = activeGame?.status === 'FINISHED';
  const [isRevealedCards, setIsRevealedCards] = useState(isFinishedGame);
  const areVotes = votedUserIds.length > 0;
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
  const setVoteValue = (value: string) => {
    dispatch({
      type: 'SET_VOTE',
      payload: {
        value,
      },
    });
  };
  const setActiveGame = (game: RoomContextType['game']) => {
    dispatch({
      type: 'SET_GAME',
      payload: game,
    });
  };
  const gameId = activeGame?.id;
  const voteValue = room?.vote || '';
  const currentUserId = room?.currentUserId || '';
  const { execute: executeGetGameVote } = useAction(getGameVotes, {
    onSuccess: ({ data }) => {
      const gameVotes = data?.data.gameVotes.reduce(
        (acc: Vote[], { vote, user }) => {
          if (vote) {
            acc.push({
              userId: user.id,
              vote,
            });
          }
          return acc;
        },
        [],
      );
      if (gameVotes) setVotes(gameVotes);
    },
  });

  useEffect(() => {
    const pusherChannel = pusher.subscribe(roomId);
    if (pusherChannel) {
      pusherChannel.bind(
        PUSHER_EVENTS.USER_ID(currentUserId),
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
        PUSHER_EVENTS.MEMBER_ADDED,
        ({ name, id, avatarUrl: userAvatarUrl }: PusherNewMember) => {
          setMembers((oldMembers) => [
            ...oldMembers.filter((member) => member.id !== id),
            {
              name,
              id,
              image: userAvatarUrl || null,
            },
          ]);
        },
      );

      pusherChannel.bind(
        PUSHER_EVENTS.MEMBER_REMOVED,
        ({ id }: PusherNewMember) => {
          setMembers((oldMembers) => oldMembers.filter((m) => m.id !== id));
        },
      );

      pusherChannel.bind(PUSHER_EVENTS.VOTED, (data: { userId: string }) => {
        const { userId } = data;
        setVotedUserIds((oldVotedUsers) => [...oldVotedUsers, userId]);
      });

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
        dispatch({
          type: 'SET_GAME',
          payload: undefined,
        });
      });

      pusherChannel.bind(PUSHER_EVENTS.REVEAL_VOTES, async () => {
        if (!gameId) return;
        executeGetGameVote({ gameId });
        setIsRevealedCards(true);
      });

      pusherChannel.bind(
        PUSHER_EVENTS.GAME_CREATED,
        async ({ data }: { data: RoomContextType['game'] }) => {
          setActiveGame(data);
        },
      );
    }

    return () => {
      pusher.unsubscribe(roomId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  return (
    <>
      <Container>
        <div className="grid gap-6">
          <PageHeading
            title={roomName}
            description={activeGame?.name as string}
          />
          <div className="flex items-center justify-center flex-col">
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
                areVotes={areVotes}
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
            </GameContainer>
          </div>
        </div>
      </Container>
      {isRevealedCards && <VotingAvg votes={votes} />}
      <Container>
        {papers.map(({ targetUser, triggerUser }, index) => (
          <Paper
            // eslint-disable-next-line react/no-array-index-key
            key={targetUser.id + index}
            targetUser={targetUser}
            triggerUser={triggerUser}
          />
        ))}
      </Container>
      {activeGame && !isRevealedCards && (
        <VotingForm
          roomId={roomId}
          voteValue={voteValue}
          isRevealedCards={isRevealedCards}
          meId={meId}
          gameId={activeGame.id}
        />
      )}
    </>
  );
}
