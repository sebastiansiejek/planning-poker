import { redirect } from 'next/navigation';
import { cache } from 'react';

import { PrismaGameService } from '@/shared/api/services/prisma/PrismaGameService';
import { PrismaRoomService } from '@/shared/api/services/prisma/PrismaRoomService';
import { PrismaRoomUserService } from '@/shared/api/services/prisma/PrismaRoomUserService';
import { PrismaUserVoteService } from '@/shared/api/services/prisma/PrismaUserVoteService';
import { getSession } from '@/shared/auth/auth';
import { PUSHER_EVENTS } from '@/shared/pusher/config/PUSHER_EVENTS';
import { pusherServer } from '@/shared/pusher/lib/pusherServer';
import { routes } from '@/shared/routes/routes';
import { getPageMetaData } from '@/shared/utils/getPageMetaData';
import { RoomProvider } from '@/widgets/Room/model/RoomContext';
import Room from '@/widgets/Room/Room';

const getRoomName = cache(async (roomId: string) => {
  const roomService = new PrismaRoomService();
  return (await roomService.getRoomName(roomId))?.name;
});

export async function generateMetadata({
  params: { room },
}: {
  params: { room: string[] };
}) {
  const title = await getRoomName(room.toString());

  return getPageMetaData({
    title,
  });
}

export default async function Page({
  params,
}: {
  params: {
    room: string[];
  };
}) {
  const userVoteService = new PrismaUserVoteService();
  const roomUserService = new PrismaRoomUserService();
  const gameService = new PrismaGameService();
  const roomId = params.room.toString();
  const roomName = await getRoomName(roomId);

  if (!roomName) {
    return redirect(routes.game.create.getPath());
  }

  const session = await getSession();
  const userId = session?.user.id as string;

  if (session && userId) {
    await roomUserService.addUserToRoom(userId, roomId);
  }

  const [roomMembers, latestGame] = await Promise.all([
    roomUserService.getRoomMembers(roomId),
    gameService.getLatestRoomGame(roomId),
  ]);

  const votes = latestGame
    ? await userVoteService.getVotedUsers(latestGame.id)
    : [];

  await pusherServer.trigger(roomId, PUSHER_EVENTS.MEMBER_ADDED, {
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
