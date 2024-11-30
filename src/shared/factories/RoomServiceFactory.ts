import { FirebaseRoomService } from '@/shared/api/services/firestore/FirebaseRoomService';
import { PrismaRoomService } from '@/shared/api/services/prisma/PrismaRoomService';

type Room = {
  id: string;
  name: string;
};

export type RoomService = {
  create: (data: { name: string; authorId: string }) => Promise<Room>;
  get: (data: { id: string }) => Promise<Room | null>;
  getByAuthorIdAndName: (data: {
    name: string;
    authorId: string;
  }) => Promise<Room | null>;
};

export class RoomServiceFactory {
  static getService(): RoomService {
    const provider = process.env.DATABASE_PROVIDER;

    switch (provider) {
      case 'firebase':
        return new FirebaseRoomService();
      case 'prisma':
        return new PrismaRoomService();
      default:
        throw new Error(`Unsupported database provider: ${provider}`);
    }
  }
}
