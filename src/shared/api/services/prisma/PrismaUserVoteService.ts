import { PrismaBaseService } from '@/shared/api/services/prisma/PrismaBaseService';
import type { UserVoteService } from '@/shared/factories/UserVoteServiceFactory';

export class PrismaUserVoteService
  extends PrismaBaseService
  implements UserVoteService
{
  delete: UserVoteService['delete'] = async ({ userId, gameId }) => {
    return this.prisma.userVote.delete({
      where: {
        userId_gameId: {
          userId,
          gameId,
        },
      },
    });
  };

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

  async getVotedUsers(gameId: string) {
    return this.prisma.userVote.findMany({
      select: {
        userId: true,
        vote: true,
      },
      where: {
        gameId,
        vote: {
          not: undefined,
        },
      },
    });
  }
}
