import type { Prisma } from '@prisma/client';

import { BasePrismaService } from '@/shared/api/services/BasePrismaService';

export class UserVotePrismaService extends BasePrismaService {
  async delete(data: Prisma.UserVoteDeleteArgs) {
    return this.prisma.userVote.delete(data);
  }

  async upsert({
    userId,
    gameId,
    vote,
  }: {
    userId: string;
    gameId: string;
    vote: string;
  }) {
    return this.prisma.userVote.upsert({
      create: {
        vote,
        user: {
          connect: {
            id: userId,
          },
        },
        game: {
          connect: {
            id: gameId,
          },
        },
      },
      update: {
        vote,
      },
      where: {
        userId_gameId: {
          userId,
          gameId,
        },
      },
    });
  }

  async getGameVotes(gameId: string) {
    return this.prisma.userVote.findMany({
      select: {
        vote: true,
        user: {
          select: {
            id: true,
          },
        },
      },
      where: {
        gameId,
      },
    });
  }
}
