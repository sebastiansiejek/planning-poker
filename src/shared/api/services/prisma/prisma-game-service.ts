import { PrismaBaseService } from '@/shared/api/services/prisma/prisma-base-service';
import type { GameService } from '@/shared/factories/game-service-factory';

export class PrismaGameService
  extends PrismaBaseService
  implements GameService
{
  finishGame: GameService['finishGame'] = async ({ gameId, roomId, actorUserId }) => {
    return this.prisma.$transaction(async (transaction) => {
      const rooms = await transaction.$queryRaw<{ id: string }[]>`
        SELECT "id" FROM "rooms" WHERE "id" = ${roomId} FOR UPDATE
      `;
      if (rooms.length === 0) throw new Error('Room not found');

      const actor = await transaction.participant.findFirst({
        where: { roomId, userId: actorUserId, leftAt: null },
        select: { id: true },
      });
      if (!actor) throw new Error('Participant is not active');

      return transaction.game.update({
        data: { status: 'FINISHED' },
        where: { id: gameId, roomId, status: 'STARTED' },
      });
    });
  };

  async getLatestRoomGame(roomId: string) {
    return this.prisma.game.findFirst({
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
      },
      where: {
        roomId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getActiveGame({ roomId }: { roomId: string }) {
    return this.prisma.game.count({
      where: {
        roomId,
        status: 'STARTED',
      },
    });
  }

  create: GameService['create'] = async (data) => {
    return this.prisma.$transaction(async (transaction) => {
      const rooms = await transaction.$queryRaw<{ id: string }[]>`
        SELECT "id" FROM "rooms" WHERE "id" = ${data.roomId} FOR UPDATE
      `;
      if (rooms.length === 0) throw new Error('Room not found');

      const actor = await transaction.participant.findFirst({
        where: { roomId: data.roomId, userId: data.actorUserId, leftAt: null },
        select: { id: true },
      });
      if (!actor) throw new Error('Participant is not active');

      const activeGame = await transaction.game.findFirst({
        where: { roomId: data.roomId, status: 'STARTED' },
        select: { id: true },
      });
      if (activeGame) throw new Error('There is an active game in this room');

      return transaction.game.create({
        data: { roomId: data.roomId, name: data.name, description: data.description },
      });
    });
  };
}
