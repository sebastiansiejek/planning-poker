import type { Prisma } from '@prisma/client';

import { BasePrismaService } from '@/shared/api/services/prisma/BasePrismaService';

export class RoomUserPrismaService extends BasePrismaService {
  async delete(data: Prisma.RoomUserDeleteArgs) {
    return this.prisma.roomUser.delete(data);
  }

  async addUserToRoom(userId: string, roomId: string) {
    return this.prisma.roomUser.upsert({
      create: {
        room: {
          connect: {
            id: roomId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
      update: {},
      where: {
        roomId_userId: {
          roomId,
          userId,
        },
      },
    });
  }

  async getRoomMembers(roomId: string) {
    return this.prisma.roomUser.findMany({
      select: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      where: {
        roomId,
      },
    });
  }
}
