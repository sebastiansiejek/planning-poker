import { PrismaBaseService } from '@/shared/api/services/prisma/PrismaBaseService';
import type { RoomUserService } from '@/shared/factories/RoomUserServiceFactory';

export class PrismaRoomUserService
  extends PrismaBaseService
  implements RoomUserService
{
  delete: RoomUserService['delete'] = async ({ userId, roomId }) => {
    return this.prisma.roomUser.delete({
      where: {
        roomId_userId: {
          userId,
          roomId,
        },
      },
    });
  };

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
