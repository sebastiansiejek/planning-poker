import { PrismaRoomUserService } from '@/shared/api/services/prisma/prisma-room-user-service';
import type { User } from '@/shared/types/user/user';

export type RoomUserService = {
  addUserToRoom: (userId: string, roomId: string) => Promise<unknown>;
  getRoomMembers: (roomId: string) => Promise<{ user: User }[]>;
  delete: (parameters: { roomId: string; userId: string }) => Promise<unknown>;
};

export const RoomUserServiceFactory = {
  getService(): RoomUserService {
    return new PrismaRoomUserService();
  },
};
