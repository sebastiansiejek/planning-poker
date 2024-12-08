import { FirebaseGameService } from '@/shared/api/services/firestore/FirebaseGameService';
import { PrismaGameService } from '@/shared/api/services/prisma/PrismaGameService';

export type GameService = {
  getLatestRoomGame: (roomId: string) => any;
  create: (data: {
    name?: string;
    roomId: string;
    description?: string;
  }) => Promise<{
    id: string;
  }>;
  getActiveGame: (data: { roomId: string }) => any;
  finishGame: ({
    roomId,
    gameId,
  }: {
    roomId?: string;
    gameId: string;
  }) => Promise<{
    id: string;
  }>;
};

export class GameServiceFactory {
  static getService() {
    const provider = process.env.DATABASE_PROVIDER;

    switch (provider) {
      case 'firebase':
        return new FirebaseGameService();
      case 'prisma':
        return new PrismaGameService();
      default:
        throw new Error(`Unsupported database provider: ${provider}`);
    }
  }
}
