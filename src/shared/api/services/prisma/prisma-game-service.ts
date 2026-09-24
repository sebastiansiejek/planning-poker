import { PrismaBaseService } from '@/shared/api/services/prisma/prisma-base-service';
import type { GameService } from '@/shared/factories/game-service-factory';

export class PrismaGameService
  extends PrismaBaseService
  implements GameService
{
  finishGame: GameService['finishGame'] = async ({ gameId, roomId }) => {
    return this.prisma.game.update({
      data: {
        status: 'FINISHED',
      },
      where: {
        id: gameId,
        roomId,
      },
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

  async create(data: { name?: string; roomId: string; description?: string }) {
    return this.prisma.$transaction(async (transaction) => {
      const rooms = await transaction.$queryRaw<{ id: string }[]>`
        SELECT "id" FROM "rooms" WHERE "id" = ${data.roomId} FOR UPDATE
      `;
      if (rooms.length === 0) throw new Error('Room not found');

      const activeGame = await transaction.game.findFirst({
        where: { roomId: data.roomId, status: 'STARTED' },
        select: { id: true },
      });
      if (activeGame) throw new Error('There is an active game in this room');

      return transaction.game.create({ data });
    });
  }
}
