'use client';

import {Menu} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useAction } from 'next-safe-action/hooks';
import { useEffect, useMemo, useState } from 'react';
import Markdown from 'react-markdown'

import type { RoomProperties } from '@/app/game/[...room]/types';
import { RoomListenerFactory } from '@/features/room/lib/RoomListener/room-listener-factory';
import { RoomPusherNotificationsListener } from '@/features/room/lib/RoomListener/room-pusher-notifications-listener';
import useNotification from '@/shared/hooks/useNotification/use-notification';
import { routes } from '@/shared/routes/routes';
import type { Vote } from '@/shared/types/types';
import {Button} from '@/shared/ui-kit/button/button';
import { Container } from '@/shared/ui-kit/container/container';
import {Heading} from '@/shared/ui-kit/heading/heading';
import { PageHeading } from '@/shared/ui-kit/page-heading/page-heading';
import {Paragraph} from '@/shared/ui-kit/paragraph/paragraph';
import {Separator} from '@/shared/ui-kit/separator/separator';
import {Sheet, SheetContent, SheetTitle, SheetTrigger} from '@/shared/ui-kit/sheet/sheet';
import { toast } from '@/shared/ui-kit/toast/model/use-toast';
import { Paper } from '@/widgets/alerts/ui/paper/paper';
import type { TriggerPaperThrowingParameters } from '@/widgets/room/actions/alerts/trigger-paper-throwing';
import { getGameVotes } from '@/widgets/room/actions/get-game-votes';
import { chunkMembers } from '@/widgets/room/libs/chunk-members/chunk-members';
import { useRoomContext } from '@/widgets/room/model/room-context';
import { useIsFinishedGame } from '@/widgets/room/model/selectors/use-is-finished-game';
import { GameContainer } from '@/widgets/room/ui/game/game-container/game-container';
import { Members } from '@/widgets/room/ui/members/members';
import { RoomTable } from '@/widgets/room/ui/room-table/room-table';
import { VotingAvg } from '@/widgets/room/ui/voting-avg/voting-avg';
import { VotingForm } from '@/widgets/room/ui/voting-form/voting-form';


const IssueAnalyzeItem = ({label, items}: {label: string, items?: string[]}) => {
  if(!items?.length) return null;

  return (
    <div>
      <Heading variant={'h4'}>{label}:</Heading>
      <ul className={'list-disc pl-4'}>
        {items.map(v => <li key={v}>{v}</li>)}
      </ul>
    </div>
  )
}

export default function Room({
  id: roomId,
  name: roomName,
  members: initialMembers,
  initialVotes = [],
  finishedGameVotes = [],
  issueKey,
  summaryDescription,
  issueAnalyze,
  issueEstimate
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
  const { data: session } = useSession();
  const { dispatch, room } = useRoomContext();
  const router = useRouter();
  const activeGame = room?.game;
  const areVotes = votedUserIds.length > 0;
  const memberChunks = useMemo(
    () => chunkMembers(members.sort((a, b) => a.name.localeCompare(b.name))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        (accumulator: Vote[], { vote, user }) => {
          if (vote) {
            accumulator.push({
              userId: user.id,
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
  const currentUserId = session?.user.id as string;

  useEffect(() => {
    const roomListener = RoomListenerFactory.getService(roomId);
    const roomNotificationsListener = new RoomPusherNotificationsListener(
      roomId,
    );

    if (globalThis.pusherInstance) {
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
        .on('gameCreated', (game) => {
          dispatch({
            type: 'SET_GAME',
            payload: game,
          });
        })
        .on('voted', ({ userId }) => {
          setVotedUserIds((oldVotedUsers) => [...oldVotedUsers, userId]);
        })
        .on('memberAdded', ({ name, id, avatarUrl: userAvatarUrl }) => {
          setMembers((oldMembers) => [
            ...oldMembers.filter((member) => member.id !== id),
            {
              name,
              id,
              image: userAvatarUrl || null,
            },
          ]);
        })
        .on('revealVotes', () => {
          if (!gameId) return;
          executeGetGameVote({ gameId, roomId });
          setIsRevealedCards(true);
          setIsWaitingForStartGame(true);
        })
        .on('resetVotes', () => {
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
        .on('memberRemoved', ({ id }) => {
          setMembers((oldMembers) => oldMembers.filter((m) => m.id !== id));
          if (id === currentUserId) {
            router.push(routes.game.join.getPath());
            toast({
              title: t('Room.kick.message'),
              variant: 'destructive',
            });
          }
        });
    }

    return () => {
      for (const unsubscribe of roomListener.unsubscribeListener) {
        unsubscribe();
      }
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
          >
            {issueKey && (
              <Sheet>
              <SheetTrigger>
                <Button className={'mt-6'} variant={'outline'}>{t('Game.single.issue_details.trigger')}</Button>
              </SheetTrigger>
              <SheetContent className={'sm:max-w-2xl'}>
                 <div className="space-y-2">
                   {summaryDescription && (
                     <div className={'overflow-auto'}>
                       <Heading variant={'h3'} htmlAttributes={{className: 'mb-2'}}>{t('Game.single.summary')}:</Heading>
                       <Markdown components={{
                         a: ({children, href}) => {
                           return <a href={href} className={'text-primary underline'} target={'_blank'}>{children}</a>
                         }
                       }}
                       >
                         {summaryDescription}
                       </Markdown>
                     </div>
                   )}
                   {issueAnalyze && (
                     <div className={'overflow-auto'}>
                       <Separator className={'my-4'}/>
                       <Heading variant={'h3'} htmlAttributes={{className: 'mb-2'}}>{t('Game.single.analyze.section_label')}:</Heading>
                       <IssueAnalyzeItem label={t('Game.single.analyze.missing')} items={issueAnalyze.missing} />
                       <IssueAnalyzeItem label={t('Game.single.analyze.questions_to_PO')} items={issueAnalyze.questions_to_PO} />
                       <IssueAnalyzeItem label={t('Game.single.analyze.questions_to_FE')} items={issueAnalyze.questions_to_FE} />
                       <IssueAnalyzeItem label={t('Game.single.analyze.questions_to_BE')} items={issueAnalyze.questions_to_BE} />
                       <IssueAnalyzeItem label={t('Game.single.analyze.test_scenarios')} items={issueAnalyze.test_scenarios} />
                     </div>
                   )}
                 </div>
                 <Link href={`https://${process.env.NEXT_PUBLIC_JIRA_API_DOMAIN}/browse/${issueKey}`} target="_blank" className={'text-center mt-6 block'}>
                   <Button variant={'outline'}>{t('Game.single.go_to_jira_issue')}</Button>
                 </Link>
              </SheetContent>
              </Sheet>
            )}
          </PageHeading>
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
      {isRevealedCards && (
        <div>
          <VotingAvg votes={votes} issueEstimate={issueEstimate} />
        </div>
      )}
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
