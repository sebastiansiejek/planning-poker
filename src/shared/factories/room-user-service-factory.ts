import { FirebaseRoomUserService } from '@/shared/api/services/firestore/firebase-room-user-service';
import { PrismaRoomUserService } from '@/shared/api/services/prisma/prisma-room-user-service';
import type { User } from '@/shared/types/user/user';

export type RoomUserService = {
  addUserToRoom: (userId: string, roomId: string) => Promise<unknown>;
  getRoomMembers: (roomId: string) => Promise<{ user: User }[]>;
  delete: (parameters: { roomId: string; userId: string }) => Promise<unknown>;
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
