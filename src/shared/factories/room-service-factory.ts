import { FirebaseRoomService } from '@/shared/api/services/firestore/firebase-room-service';
import { PrismaRoomService } from '@/shared/api/services/prisma/prisma-room-service';

export type RoomDTO = {
  id: string;
  name: string;
  createdAt: Date | string;
};

export type RoomService = {
  create: (data: { name: string; authorId: string }) => Promise<RoomDTO>;
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
      _count: { RoomUser: number };
    }[]
  >;
};

export const RoomServiceFactory = {
  getService() {
    const provider = process.env.NEXT_PUBLIC_DATABASE_PROVIDER;

    switch (provider) {
      case 'firebase': {
        return new FirebaseRoomService();
      }
      case 'prisma': {
        return new PrismaRoomService();
      }
      default: {
        throw new Error(`Unsupported database provider: ${provider}`);
      }
    }
  },
};
