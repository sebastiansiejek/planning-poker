import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

import { firebaseStore } from '@/shared/database/firebase';
import type { GameService } from '@/shared/factories/GameServiceFactory';

export class FirebaseGameService implements GameService {
  getLatestRoomGame: GameService['getLatestRoomGame'] = async (roomId) => {
    const gamesReference = collection(firebaseStore, 'rooms', roomId, 'games');
    const latestQuery = query(gamesReference, orderBy('createdAt', 'desc'), limit(1));
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
    const gamesCollectionReference = collection(
      firebaseStore,
      'rooms',
      roomId,
      'games',
    );

    const { id } = await addDoc(gamesCollectionReference, {
      description,
      name,
      status: 'STARTED',
      createdAt: serverTimestamp(),
    });

    return {
      id,
    };
  };

  getActiveGame: GameService['getActiveGame'] = async ({ roomId }) => {
    const roomReference = doc(firebaseStore, 'rooms', roomId);
    const gamesReference = collection(roomReference, 'games');
    const q = query(gamesReference, where('status', '==', 'STARTED'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    return querySnapshot.docs[0];
  };

  finishGame: GameService['finishGame'] = async ({ gameId, roomId }) => {
    if (!roomId) {
      throw new Error('Argument roomId is required');
    }

    const gameReference = doc(firebaseStore, 'rooms', roomId, 'games', gameId);
    await updateDoc(gameReference, {
      status: 'FINISHED',
    });

    return {
      id: gameReference.id,
    };
  };
}
