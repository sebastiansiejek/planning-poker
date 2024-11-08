import type { Prisma } from '@prisma/client';

import { BasePrismaService } from '@/shared/api/services/BasePrismaService';

export class RoomApiService extends BasePrismaService {
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

  async getLatestRoomGame(roomId: string) {
    return this.prisma.game.findFirst({
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
      },
      where: {
        roomId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
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

  async getVotedUsers(gameId: string) {
    return this.prisma.userVote.findMany({
      select: {
        userId: true,
        vote: true,
      },
      where: {
        gameId,
        vote: {
          not: undefined,
        },
      },
    });
  }

  async finishGame(gameId: string) {
    return this.prisma.game.update({
      data: {
        status: 'FINISHED',
      },
      where: {
        id: gameId,
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

  async delete(data: Prisma.RoomUserDeleteArgs) {
    return this.prisma.roomUser.delete(data);
  }
}
