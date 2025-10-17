import { FirebaseRoomUserService } from '@/shared/api/services/firestore/firebase-room-user-service';
import { PrismaRoomUserService } from '@/shared/api/services/prisma/prisma-room-user-service';
import { User } from '@/shared/types/user/user';

export type RoomUserService = {
  addUserToRoom: (userId: string, roomId: string) => any;
  getRoomMembers: (roomId: string) => Promise<{ user: User}[]>;
  delete: (parameters: { roomId: string; userId: string }) => Promise<any>;
};

export const RoomUserServiceFactory = {
  getService() {
    const provider = process.env.NEXT_PUBLIC_DATABASE_PROVIDER;

    switch (provider) {
      case 'firebase': {
        return new FirebaseRoomUserService();
      }
      case 'prisma': {
        return new PrismaRoomUserService();
      }
      default: {
        throw new Error(`Unsupported database provider: ${provider}`);
      }
    }
  },
};
