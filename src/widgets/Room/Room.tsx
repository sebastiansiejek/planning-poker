'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import type { RoomProps } from '@/app/game/[...room]/types';
import useNotification from '@/shared/hooks/useNotification/useNotification';
import { PUSHER_EVENTS } from '@/shared/pusher/config/PUSHER_EVENTS';
import { getPusherUserId } from '@/shared/pusher/lib/getPusherUserId';
import { pusherClient } from '@/shared/pusher/lib/pusherClient';
import type {
  PusherMember,
  PusherNewMember,
  PusherNotification,
} from '@/shared/types/pusher/pusher';
import type { Vote } from '@/shared/types/types';
import { Container } from '@/shared/UIKit/Container/Container';
import { Heading } from '@/shared/UIKit/Heading/Heading';
import { Paragraph } from '@/shared/UIKit/Paragraph/Paragraph';
import { Paper } from '@/widgets/Alerts/ui/Paper/Paper';
import type { TriggerPaperThrowingParams } from '@/widgets/Room/actions/alerts/triggerPaperThrowing';
import { chunkMembers } from '@/widgets/Room/libs/chunkMembers/chunkMembers';
import { useRoomContext } from '@/widgets/Room/model/RoomContext';
import { CreateGameForm } from '@/widgets/Room/ui/CreateGameForm/CreateGameForm';
import { GameContainer } from '@/widgets/Room/ui/Game/GameContainer/GameContainer';
import { Members } from '@/widgets/Room/ui/Members/Members';
import { RoomTable } from '@/widgets/Room/ui/RoomTable/RoomTable';
import { VotingAvg } from '@/widgets/Room/ui/VotingAvg/VotingAvg';
import { VotingForm } from '@/widgets/Room/ui/VotingForm/VotingForm';

export default function Room({
  id: roomId,
  userName,
  avatarUrl,
  name: roomName,
  members: initialMembers,
  activeGame,
}: RoomProps) {
  const [members, setMembers] = useState<RoomProps['members']>(initialMembers);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [me] = useState<PusherMember>();
  const pusher = useMemo(
    () =>
      pusherClient({
        name: userName,
        avatarUrl,
      }),
    [userName, avatarUrl],
  );
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
  const { dispatch, room } = useRoomContext();
  const setVoteValue = (value: string) => {
    dispatch({
      type: 'SET_VOTE',
      payload: {
        value,
      },
    });
  };
  const voteValue = room?.vote || '';
  const areVotes = votes.length > 0;

  useEffect(() => {
    const pusherChannel = pusher.subscribe(roomId);

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

      // pusherChannel.bind(
      //   PUSHER_EVENTS.SUBSCRIPTION_SUCCEEDED,
      //   (initialMembers: PusherMembers) => {
      //     const membersArray = Object.values(initialMembers.members);
      //     setMembers(membersArray);
      //     setMe(initialMembers.me);
      //     dispatch({
      //       type: 'SET_CURRENT_USER_ID',
      //       payload: {
      //         currentUserId: initialMembers.me.id,
      //       },
      //     });
      //   },
      // );

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
      pusher.unsubscribe(roomId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, pusher, userName]);

  return (
    <Container>
      <Heading
        variant="h1"
        htmlAttributes={{
          className: 'text-center',
        }}
      >
        {roomName}
      </Heading>
      {!activeGame && <CreateGameForm roomId={roomId} />}
      {/* TODO: separate */}
      {activeGame && (activeGame.name || activeGame.description) && (
        <div>
          {activeGame.name && <Heading variant="h2">{activeGame.name}</Heading>}
          {activeGame.description && (
            <Paragraph>{activeGame.description}</Paragraph>
          )}
        </div>
      )}
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
            channelName={roomId}
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
        {activeGame?.id && (
          <VotingForm
            roomId={roomId}
            voteValue={voteValue}
            isRevealedCards={isRevealedCards}
            meId={meId}
            gameId={activeGame.id}
          />
        )}
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
    </Container>
  );
}
