'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useAction } from 'next-safe-action/hooks';
import { useEffect, useMemo, useState } from 'react';

import type { RoomProps } from '@/app/game/[...room]/types';
import { RoomListenerFactory } from '@/features/room/lib/RoomListener/RoomListenerFactory';
import { RoomPusherNotificationsListener } from '@/features/room/lib/RoomListener/RoomPusherNotificationsListener';
import useNotification from '@/shared/hooks/useNotification/useNotification';
import { routes } from '@/shared/routes/routes';
import type { Vote } from '@/shared/types/types';
import { Container } from '@/shared/UIKit/Container/Container';
import { PageHeading } from '@/shared/UIKit/PageHeading/PageHeading';
import { toast } from '@/shared/UIKit/Toast/model/useToast';
import { Paper } from '@/widgets/Alerts/ui/Paper/Paper';
import type { TriggerPaperThrowingParams } from '@/widgets/Room/actions/alerts/triggerPaperThrowing';
import { getGameVotes } from '@/widgets/Room/actions/getGameVotes';
import { chunkMembers } from '@/widgets/Room/libs/chunkMembers/chunkMembers';
import { useRoomContext } from '@/widgets/Room/model/RoomContext';
import { useIsFinishedGame } from '@/widgets/Room/model/selectors/useIsFinishedGame';
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
  const isFinishedGame = useIsFinishedGame();
  const [votes, setVotes] = useState<Vote[]>(finishedGameVotes);
  const [members, setMembers] = useState<RoomProps['members']>(initialMembers);
  const [votedUserIds, setVotedUserIds] = useState<string[]>(initialVotes);
  const [isWaitingForStartGame, setIsWaitingForStartGame] = useState(false);
  const [isRevealedCards, setIsRevealedCards] = useState(isFinishedGame);
  const [papers, setPapers] = useState<
    Pick<TriggerPaperThrowingParams, 'triggerUser' | 'targetUser'>[]
  >([]);
  const { data: session } = useSession();
  const { dispatch, room } = useRoomContext();
  const router = useRouter();
  const activeGame = room?.game;
  const areVotes = votedUserIds.length > 0;
  const memberChunks = useMemo(
    () => chunkMembers(members.sort((a, b) => a.name.localeCompare(b.name))),
    [members.length],
  );
  const [topMembers, leftMembers, bottomMembers, rightMembers] = memberChunks;
  const { notify } = useNotification();
  const t = useTranslations();
  const gameId = activeGame?.id;
  const voteValue = room?.vote || '';
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
  const currentUserId = session?.user.id as string;

  // TODO: After refactor pusher
  // useEffect(() => {
  //   if (roomId) {
  //     const gamesCollectionRef = collection(
  //       firebaseStore,
  //       `rooms/${roomId}/games`,
  //     );
  //     const q = query(
  //       gamesCollectionRef,
  //       where('createdAt', '>=', Timestamp.now()),
  //     );
  //
  //     const gameCollectionSnapshot = onSnapshot(q, (snapshot) => {
  //       snapshot.docChanges().forEach((change) => {
  //         console.log(change);
  //       });
  //     });
  //
  //     return () => {
  //       gameCollectionSnapshot();
  //     };
  //   }
  //
  //   return () => {};
  // }, [roomId]);

  useEffect(() => {
    const roomListener = RoomListenerFactory.getService(roomId);
    const roomNotificationsListener = new RoomPusherNotificationsListener(
      roomId,
    );

    if (window.pusherInstance) {
      roomNotificationsListener
        .onAlarm(currentUserId, () => notify(t('Member.notification.notice')))
        .onThrownPaper(({ targetUser, triggerUser }) => {
          setPapers((oldPapers) => [
            ...oldPapers,
            {
              targetUser,
              triggerUser,
            },
          ]);
        });
    }

    if (roomListener) {
      roomListener
        .onMemberAdded(({ name, id, avatarUrl: userAvatarUrl }) => {
          setMembers((oldMembers) => [
            ...oldMembers.filter((member) => member.id !== id),
            {
              name,
              id,
              image: userAvatarUrl || null,
            },
          ]);
        })
        .onMemberRemoved(({ id }) => {
          setMembers((oldMembers) => oldMembers.filter((m) => m.id !== id));
          if (id === currentUserId) {
            router.push(routes.game.join.getPath());
            toast({
              title: t('Room.kick.message'),
              variant: 'destructive',
            });
          }
        })
        .onVoted(({ userId }) => {
          setVotedUserIds((oldVotedUsers) => [...oldVotedUsers, userId]);
        })
        .onShowVotes((vote) => {
          setVotes((oldVotes) => {
            const newVotes = oldVotes.filter((v) => v.userId !== vote.userId);
            return [...newVotes, vote];
          });
        })
        .onResetVotes(() => {
          dispatch({
            type: 'SET_VOTE',
            payload: {
              value: '',
            },
          });
          setVotes([]);
          setVotedUserIds([]);
          setIsRevealedCards(false);
          setIsWaitingForStartGame(false);
          dispatch({
            type: 'SET_GAME',
            payload: undefined,
          });
        })
        .onRevealVotes(() => {
          if (!gameId) return;
          executeGetGameVote({ gameId, roomId });
          setIsRevealedCards(true);
          setIsWaitingForStartGame(true);
        })
        .onGameCreated((data) => {
          dispatch({
            type: 'SET_GAME',
            payload: data,
          });
        });
    }

    return () => {
      // pusher.unsubscribe(roomId);
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
                isWaitingForStartGame={isWaitingForStartGame}
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
          gameId={activeGame.id}
        />
      )}
    </>
  );
}
