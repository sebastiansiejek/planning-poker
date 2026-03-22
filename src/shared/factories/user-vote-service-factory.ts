import { FirebaseUserVoteService } from '@/shared/api/services/firestore/firebase-user-vote-service';
import { PrismaUserVoteService } from '@/shared/api/services/prisma/prisma-user-vote-service';

export type UserVoteService = {
  getVotedUsers: (
    gameId: string,
    roomId?: string,
  ) => Promise<
    {
      userId: string;
      vote: string;
    }[]
  >;
  upsert: (data: {
    gameId: string;
    vote: string;
    userId: string;
    roomId: string;
  }) => Promise<unknown>;
  delete: (parameters: {
    roomId: string;
    userId: string;
    gameId: string;
  }) => Promise<unknown>;
  getGameVotes: (parameters: { gameId: string; roomId?: string }) => Promise<
    {
      user: {
        id: string;
      };
      vote: string;
    }[]
  >;
};

export const UserVoteServiceFactory = {
  getService() {
    const provider = process.env.NEXT_PUBLIC_DATABASE_PROVIDER;

    switch (provider) {
      case 'firebase': {
        return new FirebaseUserVoteService();
      }
      case 'prisma': {
        return new PrismaUserVoteService();
      }
      default: {
        throw new Error(`Unsupported database provider: ${provider}`);
      }
    }
  },
};
