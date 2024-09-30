import { redirect } from 'next/navigation';

import { UserModel } from '@/entities/user/model/UserModel';
import prisma from '@/shared/database/prisma';
import { routes } from '@/shared/routes/routes';
import { RoomProvider } from '@/widgets/Room/model/RoomContext';
import Room from '@/widgets/Room/Room';

export default async function Page({
  params,
}: {
  params: {
    room: string[];
  };
}) {
  const userName = UserModel.getUserName();
  const avatarUrl = UserModel.getAvatarUrl();
  const roomId = params.room.toString();
  const isRoomExists = !!(await prisma.room.count({
    where: {
      id: roomId,
    },
  }));

  if (!isRoomExists) {
    return redirect(routes.game.getPath());
  }

  if (!userName) {
    return redirect(routes.login.getPath(roomId));
  }

  const channelName = `presence-${roomId}`;

  return (
    <RoomProvider>
      <Room
        channelName={channelName}
        userName={userName}
        avatarUrl={avatarUrl}
      />
    </RoomProvider>
  );
}
