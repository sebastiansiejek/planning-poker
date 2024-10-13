import { redirect } from 'next/navigation';

import { UserModel } from '@/entities/user/model/UserModel';
import { getSession } from '@/shared/auth/auth';
import { PUSHER_EVENTS } from '@/shared/pusher/config/PUSHER_EVENTS';
import { pusherServer } from '@/shared/pusher/lib/pusherServer';
import { routes } from '@/shared/routes/routes';
import { RoomApiService } from '@/widgets/Room/api/RoomApiService';
import { RoomProvider } from '@/widgets/Room/model/RoomContext';
import Room from '@/widgets/Room/Room';

export default async function Page({
  params,
}: {
  params: {
    room: string[];
  };
}) {
  const roomUserApi = new RoomApiService();
  const userName = UserModel.getUserName();
  const avatarUrl = UserModel.getAvatarUrl();
  const roomId = params.room.toString();
  const room = await roomUserApi.getRoomName(roomId);

  if (!room) {
    return redirect(routes.game.getPath());
  }

  if (!userName) {
    return redirect(routes.login.getPath(roomId));
  }

  const session = await getSession();
  const userId = session?.user.id as string;

  if (session && userId) {
    await roomUserApi.addUserToRoom(userId, roomId);
  }

  const { name } = room;
  const [roomMembers, activeGame] = await Promise.all([
    roomUserApi.getRoomMembers(roomId),
    roomUserApi.getActiveRoomGame(roomId),
  ]);

  const areVotes = activeGame?.id
    ? await roomUserApi.areVotes(activeGame.id)
    : false;

  await pusherServer.trigger(roomId, PUSHER_EVENTS.MEMBER_ADDED, {
    id: userId,
    avatarUrl: session?.user.image || avatarUrl || '',
    name: session?.user.name || '',
  });

  return (
    <RoomProvider currentUserId={userId}>
      <Room
        id={roomId}
        members={roomMembers.map(({ user }) => user)}
        userName={userName}
        name={name}
        activeGame={activeGame}
        areVotes={areVotes}
      />
    </RoomProvider>
  );
}
