import type { Prisma } from '@prisma/client';

import { BasePrismaService } from '@/shared/api/services/prisma/BasePrismaService';

export class RoomApiService extends BasePrismaService {
  async create(data: Prisma.RoomUncheckedCreateInput) {
    return this.prisma.room.create({
      data,
    });
  }

  async findFirst(data: Prisma.RoomFindFirstArgs) {
    return this.prisma.room.findFirst(data);
  }

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
