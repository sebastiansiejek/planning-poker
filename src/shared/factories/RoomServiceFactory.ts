import { FirebaseRoomService } from '@/shared/api/services/firestore/FirebaseRoomService';
import { PrismaRoomService } from '@/shared/api/services/prisma/PrismaRoomService';

export type RoomDTO = {
  id: string;
  name: string;
  createdAt: any;
};

export type RoomService = {
  create: (data: { name: string; authorId: string }) => Promise<RoomDTO>;
  get: (data: { id: string }) => Promise<RoomDTO | null>;
  getByAuthorIdAndName: (data: {
    name: string;
    authorId: string;
  }) => Promise<RoomDTO | null>;
  getRoomName: (id: string) => Promise<string | undefined>;
};

export class RoomServiceFactory {
  static getService() {
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
