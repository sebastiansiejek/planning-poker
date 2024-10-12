import { redirect } from 'next/navigation';

import { UserModel } from '@/entities/user/model/UserModel';
import { getSession } from '@/shared/auth/auth';
import prisma from '@/shared/database/prisma';
import { PUSHER_EVENTS } from '@/shared/pusher/config/PUSHER_EVENTS';
import { pusherServer } from '@/shared/pusher/lib/pusherServer';
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
  const room = await prisma.room.findUnique({
    select: {
      name: true,
    },
    where: {
      id: roomId,
    },
  });

  if (!room) {
    return redirect(routes.game.getPath());
  }

  if (!userName) {
    return redirect(routes.login.getPath(roomId));
  }

  const session = await getSession();
  const userId = session?.user.id as string;

  if (session && userId) {
    await prisma.roomUser.upsert({
      create: {
        room: {
          connect: {
            id: roomId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
      update: {},
      where: {
        roomId_userId: {
          roomId,
          userId,
        },
      },
    });
  }

  const { name } = room;
  const roomMembers = await prisma.roomUser.findMany({
    select: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    where: {
      roomId,
    },
  });

  const activeGame = await prisma.game.findFirst({
    select: {
      id: true,
      name: true,
      description: true,
    },
    where: {
      roomId,
      status: 'STARTED',
    },
  });

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
      />
    </RoomProvider>
  );
}
