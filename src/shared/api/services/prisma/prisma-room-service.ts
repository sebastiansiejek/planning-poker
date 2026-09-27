import { PrismaBaseService } from '@/shared/api/services/prisma/prisma-base-service';
import type { RoomService } from '@/shared/factories/room-service-factory';

const maxOwnedRooms = 2;

export class PrismaRoomService
  extends PrismaBaseService
  implements RoomService
{
  create: RoomService['create'] = async (data) => {
    return this.prisma.$transaction(async (transaction) => {
      // Serialize this owner's room creation and deletion before checking the limit.
      await transaction.$queryRaw`SELECT "id" FROM "users" WHERE "id" = ${data.authorId} FOR UPDATE`;
      const ownedCount = await transaction.room.count({ where: { authorId: data.authorId } });
      if (ownedCount >= maxOwnedRooms) throw new Error('Room limit reached');

      const author = await transaction.user.findUniqueOrThrow({
        where: { id: data.authorId },
        select: { name: true, image: true },
      });
      return transaction.room.create({
        data: {
          ...data,
          participants: {
            create: { userId: data.authorId, name: author.name, image: author.image },
          },
        },
      });
    });
  };

  deleteOwned: RoomService['deleteOwned'] = async ({ roomId, authorId }) => {
    return this.prisma.$transaction(async (transaction) => {
      await transaction.$queryRaw`SELECT "id" FROM "users" WHERE "id" = ${authorId} FOR UPDATE`;
      const result = await transaction.room.deleteMany({ where: { id: roomId, authorId } });
      return result.count === 1;
    });
  };

  get: RoomService['get'] = async ({ id }) => {
    return this.prisma.room.findUnique({
      where: {
        id,
      },
    });
  };

  getByAuthorIdAndName: RoomService['getByAuthorIdAndName'] = async ({
    authorId,
    name,
  }) => {
    return this.prisma.room.findFirst({
      where: {
        name,
        authorId,
      },
    });
  };

  getRoomName: RoomService['getRoomName'] = async (roomId: string) => {
    const room = await this.prisma.room.findUnique({
      select: {
        name: true,
      },
      where: {
        id: roomId,
      },
    });
    return room?.name;
  };

  getRoomsWhereTheUserIsAParticipant: RoomService['getRoomsWhereTheUserIsAParticipant'] =
    async (userId: string) => {
      return this.prisma.room.findMany({
        where: {
          participants: {
            some: {
              userId,
              leftAt: null,
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
              participants: { where: { leftAt: null } },
            },
          },
        },
      });
    };

  async count(id: string) {
    return this.prisma.room.count({
      where: {
        id,
      },
    });
  }
}
