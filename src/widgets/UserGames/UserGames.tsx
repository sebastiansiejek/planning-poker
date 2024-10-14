'use client';

import type { Room } from '@prisma/client';

import { UserGameRow } from '@/widgets/UserGames/ui/UserGameRow/UserGameRow';

export const UserGames = ({ rooms }: { rooms: Room[] }) => {
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
