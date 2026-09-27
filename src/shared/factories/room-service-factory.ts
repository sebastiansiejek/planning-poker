import { PrismaRoomService } from '@/shared/api/services/prisma/prisma-room-service';

export type RoomDTO = {
  id: string;
  name: string;
  authorId: string;
  createdAt: Date | string;
};

export type RoomService = {
  create: (data: { name: string; authorId: string }) => Promise<RoomDTO>;
  deleteOwned: (data: { roomId: string; authorId: string }) => Promise<boolean>;
  get: (data: { id: string }) => Promise<RoomDTO | null>;
  getByAuthorIdAndName: (data: {
    name: string;
    authorId: string;
  }) => Promise<RoomDTO | null>;
  getRoomName: (id: string) => Promise<string | undefined>;
  getRoomsWhereTheUserIsAParticipant: (userId: string) => Promise<
    {
      name: string;
      id: string;
      authorId: string;
      createdAt: Date;
      author: { name: string };
      _count: { participants: number };
    }[]
  >;
};

export const RoomServiceFactory = {
  getService(): RoomService {
    return new PrismaRoomService();
  },
};
