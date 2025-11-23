import { redirect } from 'next/navigation';
import { cache } from 'react';

import { getSession } from '@/shared/auth/auth';
import { GameServiceFactory } from '@/shared/factories/game-service-factory';
import { RoomServiceFactory } from '@/shared/factories/room-service-factory';
import { RoomUserServiceFactory } from '@/shared/factories/room-user-service-factory';
import { UserVoteServiceFactory } from '@/shared/factories/user-vote-service-factory';
import { PusherEvents } from '@/shared/pusher/config/pusher-events';
import { pusherServer } from '@/shared/pusher/lib/pusher-server';
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
  const userVoteService = UserVoteServiceFactory.getService();
  const roomUserService = RoomUserServiceFactory.getService();
  const gameService = GameServiceFactory.getService();
  const roomId = parameters.room.toString();
  const roomName = await getRoomName(roomId);

  if (!roomName) {
    return redirect(routes.game.create.getPath());
  }
  const session = await getSession();
  const userId = session?.user.id;

  if (userId) {
    await roomUserService.addUserToRoom(userId, roomId);
  }

  const [roomMembers, latestGame] = await Promise.all([
    roomUserService.getRoomMembers(roomId),
    gameService.getLatestRoomGame(roomId),
  ]);

  const votes = latestGame
    ? await userVoteService.getVotedUsers(latestGame.id, roomId)
    : [];

  await pusherServer.trigger(roomId, PusherEvents.MEMBER_ADDED, {
    id: userId,
    avatarUrl: session?.user.image || '',
    name: session?.user.name || '',
  });

  return (
    <RoomProvider game={latestGame || undefined} roomId={roomId}>
      <Room
        id={roomId}
        members={roomMembers.map(({ user }) => user)}
        name={roomName}
        initialVotes={votes.map(({ userId: votedUser }) => votedUser)}
        finishedGameVotes={latestGame?.status === 'FINISHED' ? votes : []}
      />
    </RoomProvider>
  );
}
