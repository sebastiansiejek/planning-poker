import { FirebaseGameService } from '@/shared/api/services/firestore/FirebaseGameService';
import { PrismaGameService } from '@/shared/api/services/prisma/PrismaGameService';

export type GameService = {
  getLatestRoomGame: (roomId: string) => any;
  create: (data: {
    name?: string;
    roomId: string;
    description?: string;
  }) => any;
  getActiveGame: (data: { roomId: string }) => any;
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
