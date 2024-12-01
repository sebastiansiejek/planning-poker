import { getDocs, limit, orderBy, query } from 'firebase/firestore';

import { FirebaseRoomService } from '@/shared/api/services/firestore/FirebaseRoomService';
import type { GameService } from '@/shared/factories/GameServiceFactory';

export class FirebaseGameService implements GameService {
  // TODO: Get game instead room
  getLatestRoomGame: GameService['getLatestRoomGame'] = async () => {
    const roomService = new FirebaseRoomService();
    const latestQuery = query(
      roomService.roomCollection,
      orderBy('createdAt', 'desc'),
      limit(1),
    );
    const querySnapshot = await getDocs(latestQuery);

    if (querySnapshot.empty) return null;

    return {
      ...querySnapshot.docs[0].data(),
      id: querySnapshot.docs[0].id,
    };
  };
}
