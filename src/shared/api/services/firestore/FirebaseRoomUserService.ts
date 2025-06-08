import {
  arrayRemove,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

import type { FirebaseRoomDTO } from '@/shared/api/services/firestore/FirebaseRoomService';
import { FirebaseRoomService } from '@/shared/api/services/firestore/FirebaseRoomService';
import { firebaseStore } from '@/shared/database/firebase';
import type { RoomUserService } from '@/shared/factories/RoomUserServiceFactory';

export class FirebaseRoomUserService implements RoomUserService {
  addUserToRoom: RoomUserService['addUserToRoom'] = async (userId, roomId) => {
    const roomService = new FirebaseRoomService();
    const roomDocument = doc(roomService.roomCollection, roomId);
    const room = await roomService.get({ id: roomId });
    const users = room?.users || [];

    if (users.includes(userId)) {
      return;
    }

    users.push(userId);

    await updateDoc(roomDocument, {
      users,
    });
  };

  getRoomMembers = async (roomId: string) => {
    const roomService = new FirebaseRoomService();
    const room = await roomService.get({ id: roomId });
    const users = room?.users || [];

    const usersQuery = query(
      collection(firebaseStore, 'users'),
      where('__name__', 'in', users),
    );
    const querySnapshot = await getDocs(usersQuery);

    return querySnapshot.docs.map((userDocument) => ({
      user: {
        id: userDocument.id,
        ...userDocument.data(),
      } as FirebaseRoomDTO,
    }));
  };

  delete: RoomUserService['delete'] = async ({ roomId, userId }) => {
    const gameReference = doc(firebaseStore, 'rooms', roomId);

    await updateDoc(gameReference, {
      users: arrayRemove(userId),
    });
  };
}
