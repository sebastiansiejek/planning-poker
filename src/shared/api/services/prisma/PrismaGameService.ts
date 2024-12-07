import { PrismaBaseService } from '@/shared/api/services/prisma/PrismaBaseService';
import type { GameService } from '@/shared/factories/GameServiceFactory';

export class PrismaGameService
  extends PrismaBaseService
  implements GameService
{
  finishGame: GameService['finishGame'] = async ({ gameId }) => {
    return this.prisma.game.update({
      data: {
        status: 'FINISHED',
      },
      where: {
        id: gameId,
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
    return this.prisma.game.create({
      data,
    });
  }
}
