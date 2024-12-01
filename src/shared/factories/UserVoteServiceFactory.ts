import { FirebaseUserVoteService } from '@/shared/api/services/firestore/FirebaseUserVoteService';
import { PrismaUserVoteService } from '@/shared/api/services/prisma/PrismaUserVoteService';

export type UserVoteService = {
  getVotedUsers: (gameId: string) => Promise<
    {
      userId: string;
      vote: string;
    }[]
  >;
};

export class UserVoteServiceFactory {
  static getService() {
    const provider = process.env.DATABASE_PROVIDER;

    switch (provider) {
      case 'firebase':
        return new FirebaseUserVoteService();
      case 'prisma':
        return new PrismaUserVoteService();
      default:
        throw new Error(`Unsupported database provider: ${provider}`);
    }
  }
}
