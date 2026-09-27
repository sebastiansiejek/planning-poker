'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useAction } from 'next-safe-action/hooks';
import { useEffect, useMemo, useRef, useState } from 'react';

import type { RoomProperties } from '@/app/[locale]/game/[...room]/types';
import { RoomListenerFactory } from '@/features/room/lib/RoomListener/room-listener-factory';
import { RoomSupabaseNotificationsListener } from '@/features/room/lib/RoomListener/room-supabase-notifications-listener';
import { useRouter } from '@/i18n/navigation';
import useNotification from '@/shared/hooks/useNotification/use-notification';
import { routes } from '@/shared/routes/routes';
import type { Vote } from '@/shared/types/types';
import { Container } from '@/shared/ui-kit/container/container';
import { Spinner } from '@/shared/ui-kit/Loaders/spinner/spinner';
import { PageHeading } from '@/shared/ui-kit/page-heading/page-heading';
import { toast } from '@/shared/ui-kit/toast/model/use-toast';
import { Paper } from '@/widgets/alerts/ui/paper/paper';
import type { TriggerPaperThrowingParameters } from '@/widgets/room/actions/alerts/trigger-paper-throwing';
import { getGameVotes } from '@/widgets/room/actions/get-game-votes';
import { getRoomState } from '@/widgets/room/actions/get-room-state';
import { chunkMembers } from '@/widgets/room/libs/chunk-members/chunk-members';
import { useRoomContext } from '@/widgets/room/model/room-context';
import { useIsFinishedGame } from '@/widgets/room/model/selectors/use-is-finished-game';
import { useRoomRealtimeClient } from '@/widgets/room/room-realtime-gate';
import { GameContainer } from '@/widgets/room/ui/game/game-container/game-container';
import { Members } from '@/widgets/room/ui/members/members';
import { RoomTable } from '@/widgets/room/ui/room-table/room-table';
import { VotingAvg } from '@/widgets/room/ui/voting-avg/voting-avg';
import { VotingForm } from '@/widgets/room/ui/voting-form/voting-form';

export default function Room({
  id: roomId,
  name: roomName,
  members: initialMembers,
  currentParticipantId,
  initialVotes = [],
  finishedGameVotes = [],
}: RoomProperties) {
  const isFinishedGame = useIsFinishedGame();
  const [votes, setVotes] = useState<Vote[]>(finishedGameVotes);
  const [members, setMembers] = useState<RoomProperties['members']>(initialMembers);
  const [votedUserIds, setVotedUserIds] = useState<string[]>(initialVotes);
  const [isWaitingForStartGame, setIsWaitingForStartGame] = useState(false);
  const [isRevealedCards, setIsRevealedCards] = useState(isFinishedGame);
  const [papers, setPapers] = useState<
    Pick<TriggerPaperThrowingParameters, 'triggerUser' | 'targetUser'>[]
  >([]);
  const eventVersion = useRef(0);
  const realtimeClient = useRoomRealtimeClient();
  const [connected, setConnected] = useState(false);
  const { dispatch, room } = useRoomContext();
  const router = useRouter();
  const activeGame = room?.game;
  const areVotes = votedUserIds.length > 0;
  const memberChunks = useMemo(
    () => chunkMembers([...members].sort((a, b) => a.name.localeCompare(b.name))),
    [members],
  );
  const [topMembers, leftMembers, bottomMembers, rightMembers] = memberChunks;
  const { notify } = useNotification();
  const t = useTranslations();
  const locale = useLocale();
  const gameId = activeGame?.id;
  const gameIdRef = useRef(gameId);
  useEffect(() => { gameIdRef.current = gameId; }, [gameId]);
  const voteValue = room?.vote || '';
  const { execute: executeGetGameVote } = useAction(getGameVotes, {
    onSuccess: ({ data }) => {
      const gameVotes = data?.data.gameVotes.reduce(
        (accumulator: Vote[], { vote, participantId }) => {
          if (vote) {
            accumulator.push({
              participantId,
              vote,
            });
          }
          return accumulator;
        },
        [],
      );
      if (gameVotes) setVotes(gameVotes);
    },
  });
  const currentUserId = currentParticipantId;

  useEffect(() => {
    let isActive = true;
    let eventsSubscribed = false;
    let eventsReady = false;
    let notificationsReady = false;
    let retryTimer: ReturnType<typeof setTimeout>;
    setConnected(false);
    const updateConnection = () => {
      if (isActive) setConnected(eventsReady && notificationsReady);
    };
    const refreshRoom = async () => {
      const version = eventVersion.current;
      try {
        const result = await getRoomState({ roomId });
        if (!isActive || !eventsSubscribed) return;
        if (result?.data?.success === false) {
          router.replace(routes.game.join.getPath());
          return;
        }
        if (!result?.data?.success) throw new Error('Failed to refresh room');
        if (version !== eventVersion.current) {
          retryTimer = setTimeout(() => void refreshRoom(), 0);
          return;
        }
        const snapshot = result.data;
        setMembers(snapshot.members);
        gameIdRef.current = snapshot.game?.id;
        dispatch({ type: 'SET_GAME', payload: snapshot.game || undefined });
        dispatch({ type: 'SET_VOTE', payload: { value: snapshot.ownVote } });
        setVotes(snapshot.revealedVotes);
        setVotedUserIds(snapshot.votedParticipantIds);
        setIsRevealedCards(snapshot.game?.status === 'FINISHED');
        setIsWaitingForStartGame(snapshot.game?.status === 'FINISHED');
        eventsReady = true;
        updateConnection();
      } catch {
        if (isActive && eventsSubscribed) retryTimer = setTimeout(() => void refreshRoom(), 3_000);
      }
    };
    const roomListener = RoomListenerFactory.getService(roomId, realtimeClient);
    const roomNotificationsListener = new RoomSupabaseNotificationsListener(
      roomId,
      realtimeClient,
    );

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

    if (roomListener) {
      roomListener
        .on('ready', () => {
          eventsSubscribed = true;
          void refreshRoom();
        })
        .on('disconnected', () => {
          eventsSubscribed = false;
          eventsReady = false;
          updateConnection();
        })
        .on('gameCreated', (game) => {
          eventVersion.current += 1;
          gameIdRef.current = game?.id;
          dispatch({ type: 'SET_VOTE', payload: { value: '' } });
          setVotes([]);
          setVotedUserIds([]);
          setIsRevealedCards(false);
          setIsWaitingForStartGame(false);
          dispatch({
            type: 'SET_GAME',
            payload: game,
          });
        })
        .on('voted', ({ participantId }) => {
          eventVersion.current += 1;
          setVotedUserIds((oldVotedUsers) => [...new Set([...oldVotedUsers, participantId])]);
        })
        .on('memberAdded', ({ name, id, avatarUrl: userAvatarUrl }) => {
          eventVersion.current += 1;
          setMembers((oldMembers) => [
            ...oldMembers.filter((member) => member.id !== id),
            {
              name,
              id,
              image: userAvatarUrl || null,
            },
          ]);
        })
        .on('memberUpdated', ({ id, name }) => {
          eventVersion.current += 1;
          setMembers((oldMembers) =>
            oldMembers.map((member) => (member.id === id ? { ...member, name } : member)),
          );
        })
        .on('revealVotes', () => {
          eventVersion.current += 1;
          if (!gameIdRef.current) return;
          executeGetGameVote({ gameId: gameIdRef.current, roomId });
          setIsRevealedCards(true);
          setIsWaitingForStartGame(true);
        })
        .on('memberRemoved', ({ id }) => {
          eventVersion.current += 1;
          setMembers((oldMembers) => oldMembers.filter((m) => m.id !== id));
          if (id === currentUserId) {
            router.push(routes.game.join.getPath());
            toast({
              title: t('Room.kick.message'),
              variant: 'destructive',
            });
          }
        });
      roomNotificationsListener.connect(
        () => { notificationsReady = true; updateConnection(); },
        () => { notificationsReady = false; updateConnection(); },
      );
      roomListener.connect();
    }

    return () => {
      isActive = false;
      clearTimeout(retryTimer);
      for (const unsubscribe of roomListener.unsubscribeListener) {
        unsubscribe();
      }
      roomNotificationsListener.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, realtimeClient, locale]);

  if (!connected) {
    return <Container><div className="flex items-center gap-2 py-12" role="status"><Spinner />{t('Room.connecting')}</div></Container>;
  }

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
