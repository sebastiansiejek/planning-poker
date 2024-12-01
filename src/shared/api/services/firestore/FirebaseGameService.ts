import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';

import { firebaseStore } from '@/shared/database/firebase';
import type { GameService } from '@/shared/factories/GameServiceFactory';

export class FirebaseGameService implements GameService {
  getLatestRoomGame: GameService['getLatestRoomGame'] = async (roomId) => {
    const gamesRef = collection(firebaseStore, 'rooms', roomId, 'games');
    const latestQuery = query(gamesRef, orderBy('createdAt', 'desc'), limit(1));
    const querySnapshot = await getDocs(latestQuery);

    if (querySnapshot.empty) return null;

    const data = querySnapshot.docs[0].data();

    return {
      ...data,
      id: querySnapshot.docs[0].id,
      createdAt: data.createdAt.toString(),
    };
  };

  create: GameService['create'] = async ({
    roomId,
    description = '',
    name = '',
  }) => {
    const gamesCollectionRef = collection(
      firebaseStore,
      'rooms',
      roomId,
      'games',
    );

    await addDoc(gamesCollectionRef, {
      description,
      name,
      status: 'STARTED',
      createdAt: serverTimestamp(),
    });
  };

  getActiveGame: GameService['getActiveGame'] = async ({ roomId }) => {
    const roomRef = doc(firebaseStore, 'rooms', roomId);
    const gamesRef = collection(roomRef, 'games');
    const q = query(gamesRef, where('status', '==', 'STARTED'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    return querySnapshot.docs[0];
  };
}
