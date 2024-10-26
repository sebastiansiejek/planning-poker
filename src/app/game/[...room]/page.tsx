import { redirect } from 'next/navigation';
import { cache } from 'react';

import { getSession } from '@/shared/auth/auth';
import { PUSHER_EVENTS } from '@/shared/pusher/config/PUSHER_EVENTS';
import { pusherServer } from '@/shared/pusher/lib/pusherServer';
import { routes } from '@/shared/routes/routes';
import { getPageMetaData } from '@/shared/utils/getPageMetaData';
import { RoomApiService } from '@/widgets/Room/api/RoomApiService';
import { RoomProvider } from '@/widgets/Room/model/RoomContext';
import Room from '@/widgets/Room/Room';

const getRoomName = cache(async (roomId: string) => {
  const roomApi = new RoomApiService();
  return (await roomApi.getRoomName(roomId))?.name;
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
  const roomApi = new RoomApiService();
  const roomId = params.room.toString();
  const roomName = await getRoomName(roomId);

  if (!roomName) {
    return redirect(routes.game.create.getPath());
  }

  const session = await getSession();
  const userId = session?.user.id as string;

  if (session && userId) {
    await roomApi.addUserToRoom(userId, roomId);
  }

  const [roomMembers, latestGame] = await Promise.all([
    roomApi.getRoomMembers(roomId),
    roomApi.getLatestRoomGame(roomId),
  ]);

  const votes = latestGame ? await roomApi.getVotedUsers(latestGame.id) : [];

  await pusherServer.trigger(roomId, PUSHER_EVENTS.MEMBER_ADDED, {
    id: userId,
    avatarUrl: session?.user.image || '',
    name: session?.user.name || '',
  });

  return (
    <RoomProvider
      currentUserId={userId}
      game={latestGame || undefined}
      roomId={roomId}
    >
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
