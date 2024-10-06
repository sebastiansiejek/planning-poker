import { redirect } from 'next/navigation';

import { UserModel } from '@/entities/user/model/UserModel';
import { getSession } from '@/shared/auth/auth';
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

  if (session) {
    const {
      user: { id: userId },
    } = session;

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
      room: true,
    },
    where: {
      roomId,
      status: 'STARTED',
    },
  });

  return (
    <RoomProvider>
      <Room
        id={roomId}
        members={roomMembers.map(({ user }) => user)}
        userName={userName}
        avatarUrl={avatarUrl}
        name={name}
        activeGameId={activeGame?.id}
      />
    </RoomProvider>
  );
}
