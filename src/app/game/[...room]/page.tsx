import { redirect } from 'next/navigation';

import Room from '@/app/game/[...room]/Room';
import { routes } from '@/shared/routes/routes';
import { UserModel } from '@/shared/user/model/UserModel';

export default async function Page({
  params,
}: {
  params: {
    room: string[];
  };
}) {
  const userName = UserModel.getUserName();
  const room = params.room.toString();

  if (!userName) {
    redirect(routes.login.getPath(room));
  }

  const channelName = `presence-${room}`;

  return <Room channelName={channelName} userName={userName} />;
}
