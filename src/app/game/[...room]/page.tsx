import { redirect } from 'next/navigation';

import Room from '@/app/game/[...room]/Room';
import { routes } from '@/shared/routes/routes';
import { UserModel } from '@/shared/user/model/UserModel';
import { RoomProvider } from '@/widgets/room/model/RoomContext';

export default async function Page({
  params,
}: {
  params: {
    room: string[];
  };
}) {
  const userName = UserModel.getUserName();
  const avatarUrl = UserModel.getAvatarUrl();
  const room = params.room.toString();

  if (!userName) {
    redirect(routes.login.getPath(room));
  }

  const channelName = `presence-${room}`;

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
