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
  const roomApi = new RoomApiService();
  const userName = UserModel.getUserName();
  const avatarUrl = UserModel.getAvatarUrl();
  const roomId = params.room.toString();
  const room = await roomApi.getRoomName(roomId);

  if (!room) {
    return redirect(routes.game.getPath());
  }

  if (!userName) {
    return redirect(routes.login.getPath(roomId));
  }

  const session = await getSession();
  const userId = session?.user.id as string;

  if (session && userId) {
    await roomApi.addUserToRoom(userId, roomId);
  }

  const { name } = room;
  const [roomMembers, activeGame] = await Promise.all([
    roomApi.getRoomMembers(roomId),
    roomApi.getActiveRoomGame(roomId),
  ]);

  const votes = activeGame ? await roomApi.getVotedUsers(activeGame.id) : [];

  await pusherServer.trigger(roomId, PUSHER_EVENTS.MEMBER_ADDED, {
    id: userId,
    avatarUrl: session?.user.image || avatarUrl || '',
    name: session?.user.name || '',
  });

  return (
    <RoomProvider
      currentUserId={userId}
      game={activeGame || undefined}
      roomId={roomId}
    >
      <Room
        id={roomId}
        members={roomMembers.map(({ user }) => user)}
        userName={userName}
        name={name}
        initialVotes={votes.map(({ userId: votedUser }) => votedUser)}
      />
    </RoomProvider>
  );
}
