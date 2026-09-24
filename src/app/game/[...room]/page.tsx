import { redirect } from 'next/navigation';
import { cache } from 'react';

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
  const voteService = VoteServiceFactory.getService();
  const participantService = ParticipantServiceFactory.getService();
  const gameService = GameServiceFactory.getService();
  const roomId = parameters.room.toString();
  const roomName = await getRoomName(roomId);

  if (!roomName) {
    return redirect(routes.game.create.getPath());
  }
  const session = await getSession();
  if (!session?.user.id) redirect(routes.login.getPath());
  const currentParticipant = await participantService.joinAuthenticated(roomId, session.user.id);

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
    <RoomProvider game={latestGame || undefined} roomId={roomId} participantId={currentParticipant.id}>
      <Room
        id={roomId}
        members={roomMembers}
        currentParticipantId={currentParticipant.id}
        name={roomName}
        initialVotes={votes.map(({ participantId }) => participantId)}
        finishedGameVotes={latestGame?.status === 'FINISHED' ? votes : []}
      />
    </RoomProvider>
  );
}
