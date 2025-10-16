import { PrismaBaseService } from '@/shared/api/services/prisma/prisma-base-service';
import type { GameService } from '@/shared/factories/game-service-factory';

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
        issueKey: true,
        summaryDescription: true,
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

  async create(data: { name?: string; roomId: string; description?: string, issueKey?: string, summaryDescription?: string }) {
    return this.prisma.game.create({
      data
    });
  }
}
