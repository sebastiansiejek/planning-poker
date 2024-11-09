import { BasePrismaService } from '@/shared/api/services/BasePrismaService';

export class GamePrismaService extends BasePrismaService {
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

  async finishGame(gameId: string) {
    return this.prisma.game.update({
      data: {
        status: 'FINISHED',
      },
      where: {
        id: gameId,
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
