import { PrismaBaseService } from '@/shared/api/services/prisma/PrismaBaseService';
import type { RoomService } from '@/shared/factories/RoomServiceFactory';

export class PrismaRoomService
  extends PrismaBaseService
  implements RoomService
{
  create: RoomService['create'] = async (data) => {
    return this.prisma.room.create({
      data,
    });
  };

  get: RoomService['get'] = async ({ authorId, name }) => {
    return this.prisma.room.findFirst({
      where: {
        name,
        authorId,
      },
    });
  };

  async getRoomName(roomId: string) {
    return this.prisma.room.findUnique({
      select: {
        name: true,
      },
      where: {
        id: roomId,
      },
    });
  }

  async getRoomsWhereTheUserIsAParticipant(userId: string) {
    return this.prisma.room.findMany({
      where: {
        RoomUser: {
          some: {
            userId,
          },
        },
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            RoomUser: true,
          },
        },
      },
    });
  }

  async count(id: string) {
    return this.prisma.room.count({
      where: {
        id,
      },
    });
  }
}
