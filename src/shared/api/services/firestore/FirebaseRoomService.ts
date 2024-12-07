import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  where,
} from 'firebase/firestore';

import { FirebaseUserService } from '@/shared/api/services/firestore/FirebaseUserService';
import { firebaseStore } from '@/shared/database/firebase';
import type {
  RoomDTO,
  RoomService,
} from '@/shared/factories/RoomServiceFactory';

export type FirebaseRoomDTO = RoomDTO & {
  authorId: string;
  image: string;
  users: Array<string>;
};

const normalizeRoomData = (
  id: string,
  data: {
    name: string;
    authorId: string;
    createdAt: Timestamp;
  },
) => {
  return {
    ...data,
    createdAt:
      data?.createdAt instanceof Timestamp
        ? data.createdAt.toDate().toISOString()
        : data?.createdAt,
    id,
  } as unknown as FirebaseRoomDTO;
};

export class FirebaseRoomService implements RoomService {
  roomCollection = collection(firebaseStore, 'rooms');

  get = async ({ id }: Parameters<RoomService['get']>[0]) => {
    const roomDoc = doc(this.roomCollection, id);
    const roomSnapshot = await getDoc(roomDoc);

    if (!roomSnapshot.exists()) {
      return null;
    }

    return normalizeRoomData(
      roomDoc.id,
      roomSnapshot.data() as FirebaseRoomDTO,
    );
  };

  getRoomName: RoomService['getRoomName'] = async (id) => {
    return (await this.get({ id }))?.name;
  };

  getByAuthorIdAndName: RoomService['getByAuthorIdAndName'] = async ({
    name,
    authorId,
  }) => {
    const rooms = (
      await getDocs(
        query(
          this.roomCollection,
          where('authorId', '==', authorId),
          where('name', '==', name),
        ),
      )
    ).docs;

    if (rooms.length === 0) {
      return null;
    }

    return rooms[0].data() as ReturnType<RoomService['getByAuthorIdAndName']>;
  };

  create: RoomService['create'] = async ({ name, authorId }) => {
    const createdRoom = await addDoc(this.roomCollection, {
      name,
      authorId,
      createdAt: serverTimestamp(),
    });

    const data = (await getDoc(createdRoom)).data() as FirebaseRoomDTO;

    return normalizeRoomData(createdRoom.id, data);
  };

  getRoomsWhereTheUserIsAParticipant: RoomService['getRoomsWhereTheUserIsAParticipant'] =
    async (userId) => {
      const userService = new FirebaseUserService();
      const rooms = (
        await getDocs(
          query(this.roomCollection, where('users', 'array-contains', userId)),
        )
      ).docs;

      return Promise.all(
        rooms.map(async (room) => {
          const roomData = room.data();
          const author = await userService.get(roomData.authorId);

          return {
            id: room.id,
            name: roomData.name,
            createdAt: roomData.createdAt.toDate().toISOString(),
            authorId: roomData.authorId,
            author: {
              name: author.name,
            },
            _count: {
              RoomUser: roomData.users.length,
            },
          };
        }),
      );
    };
}
