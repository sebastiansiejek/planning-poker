'use client';

import { Prisma } from '@prisma/client/extension';

import type prisma from '@/shared/database/prisma';
import { UserGameRow } from '@/widgets/UserGames/ui/UserGameRow/UserGameRow';
import Args = Prisma.Args;

export const UserGames = ({
  rooms,
}: {
  rooms: Args<typeof prisma.room, 'create'>['data'][];
}) => {
  if (rooms.length === 0) {
    return null;
  }

  return (
    <table>
      <tbody>
        {rooms.map((room) => {
          return <UserGameRow key={room.id} {...room} />;
        })}
      </tbody>
    </table>
  );
};
