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

  async getActiveRoomGame(roomId: string) {
    return this.prisma.game.findFirst({
      select: {
        id: true,
        name: true,
        description: true,
      },
      where: {
        roomId,
        status: 'STARTED',
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
      },
      where: {
        gameId,
        vote: {
          not: undefined,
        },
      },
    });
  }

  async getGameVotes(gameId: string) {
    return this.prisma.userVote.findMany({
      select: {
        vote: true,
        user: {
          select: {
            id: true,
          },
        },
      },
      where: {
        gameId,
      },
    });
  }
}
