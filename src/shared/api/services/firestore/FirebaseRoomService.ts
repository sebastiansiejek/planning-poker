import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

import { firebaseStore } from '@/shared/database/firebase';
import type { RoomService } from '@/shared/factories/RoomServiceFactory';

export class FirebaseRoomService implements RoomService {
  roomCollection = collection(firebaseStore, 'rooms');

  get: RoomService['get'] = async ({ id }) => {
    const roomDoc = doc(this.roomCollection, id);
    const roomSnapshot = await getDoc(roomDoc);

    if (!roomSnapshot.exists()) {
      return null;
    }

    return roomSnapshot.data() as ReturnType<RoomService['get']>;
  };

  getByAuthorIdAndName: RoomService['getByAuthorIdAndName'] = async ({
    name,
    authorId,
  }) => {
    return (
      await getDocs(
        query(
          this.roomCollection,
          where('authorId', '==', authorId),
          where('name', '==', name),
        ),
      )
    ).docs?.[0].data() as ReturnType<RoomService['getByAuthorIdAndName']>;
  };

  create: RoomService['create'] = async ({ name, authorId }) => {
    const createdRoom = await addDoc(this.roomCollection, {
      name,
      authorId,
    });

    return (await getDoc(createdRoom)).data() as ReturnType<
      RoomService['create']
    >;
  };
}
