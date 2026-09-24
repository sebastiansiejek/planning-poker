import { PrismaVoteService } from '@/shared/api/services/prisma/prisma-vote-service';

export type VoteService = {
  getVotedParticipants: (gameId: string, roomId: string) => Promise<{
    participantId: string;
    vote: string;
  }[]>;
  getRevealedVotes: (gameId: string, roomId: string) => Promise<{
    participantId: string;
    vote: string;
  }[]>;
  upsert: (data: {
    gameId: string;
    roomId: string;
    participantId: string;
    vote: string;
  }) => Promise<void>;
};

export const VoteServiceFactory = {
  getService(): VoteService {
    return new PrismaVoteService();
  },
};
