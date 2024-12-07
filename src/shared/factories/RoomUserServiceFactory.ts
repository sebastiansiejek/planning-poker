import { FirebaseRoomUserService } from '@/shared/api/services/firestore/FirebaseRoomUserService';
import { PrismaRoomUserService } from '@/shared/api/services/prisma/PrismaRoomUserService';

export type RoomUserService = {
  addUserToRoom: (userId: string, roomId: string) => any;
  getRoomMembers: (roomId: string) => any;
  delete: (params: { roomId: string; userId: string }) => Promise<any>;
};

export class RoomUserServiceFactory {
  static getService() {
    const provider = process.env.DATABASE_PROVIDER;

    switch (provider) {
      case 'firebase':
        return new FirebaseRoomUserService();
      case 'prisma':
        return new PrismaRoomUserService();
      default:
        throw new Error(`Unsupported database provider: ${provider}`);
    }
  }
}
