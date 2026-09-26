import { getLocale } from 'next-intl/server';
import { cache } from 'react';

import { getPathname,redirect } from '@/i18n/navigation';
import { getSession } from '@/shared/auth/auth';
import { GameServiceFactory } from '@/shared/factories/game-service-factory';
import { ParticipantServiceFactory } from '@/shared/factories/participant-service-factory';
import { RoomServiceFactory } from '@/shared/factories/room-service-factory';
import { VoteServiceFactory } from '@/shared/factories/vote-service-factory';
import { RealtimeEvents, RealtimeTopics } from '@/shared/realtime/config/realtime-events';
import { broadcastToRealtime } from '@/shared/realtime/lib/supabase-realtime-server';
import { routes } from '@/shared/routes/routes';
import { getPageMetaData } from '@/shared/utils/get-page-meta-data';
import { RoomProvider } from '@/widgets/room/model/room-context';
import Room from '@/widgets/room/room';

const getRoomName = cache(async (roomId: string) => {
  const roomService = RoomServiceFactory.getService();
  return roomService.getRoomName(roomId);
});

export async function generateMetadata(properties: {
  params: Promise<{ room: string[] }>;
}) {
  const parameters = await properties.params;

  const { room } = parameters;

  const title = await getRoomName(room.toString());

  return getPageMetaData({
    title,
  });
}

export default async function Page(properties: {
  params: Promise<{
    room: string[];
  }>;
}) {
  const parameters = await properties.params;
  const locale = await getLocale();
  const voteService = VoteServiceFactory.getService();
  const participantService = ParticipantServiceFactory.getService();
  const gameService = GameServiceFactory.getService();
  const roomId = parameters.room.toString();
  const room = await RoomServiceFactory.getService().get({ id: roomId });

  if (!room) {
    return redirect({ locale, href: routes.game.create.getPath() });
  }
  const session = await getSession();
  if (!session?.user.id) return redirect({ locale, href: { pathname: routes.login.getPath(), query: { callbackUrl: getPathname({ locale, href: routes.game.singleGame.getPath(roomId) }) } } });
  let currentParticipant;
  try {
    currentParticipant = await participantService.joinAuthenticated(roomId, session.user.id);
  } catch (error) {
    if (error instanceof Error && error.message === 'Participant was removed from this room') {
      return redirect({ locale, href: routes.dashboard.getPath() });
    }
    throw error;
  }

  const [roomMembers, latestGame] = await Promise.all([
    participantService.getRoomMembers(roomId),
    gameService.getLatestRoomGame(roomId),
  ]);

  const votes = latestGame
    ? await voteService.getVotedParticipants(latestGame.id, roomId)
    : [];

  await broadcastToRealtime(
    RealtimeTopics.roomEvents(roomId),
    RealtimeEvents.MEMBER_ADDED,
    {
      id: currentParticipant.id,
      avatarUrl: currentParticipant.image || '',
      name: currentParticipant.name,
    },
  );

  return (
    <RoomProvider game={latestGame || undefined} roomId={roomId} participantId={currentParticipant.id} isOwner={room.authorId === session.user.id}>
      <Room
        id={roomId}
        members={roomMembers}
        currentParticipantId={currentParticipant.id}
        name={room.name}
        initialVotes={votes.map(({ participantId }) => participantId)}
        finishedGameVotes={latestGame?.status === 'FINISHED' ? votes : []}
      />
    </RoomProvider>
  );
}
