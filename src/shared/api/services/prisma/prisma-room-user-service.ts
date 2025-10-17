import { PrismaBaseService } from '@/shared/api/services/prisma/prisma-base-service';
import type { RoomUserService } from '@/shared/factories/room-user-service-factory';
import { User } from '@/shared/types/user/user';

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

  async getRoomMembers(roomId: string): Promise<{ user: User}[]> {
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
