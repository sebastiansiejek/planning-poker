import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';

import { firebaseStore } from '@/shared/database/firebase';
import type { UserVoteService } from '@/shared/factories/UserVoteServiceFactory';

export class FirebaseUserVoteService implements UserVoteService {
  // TODO: implement that
  getVotedUsers: UserVoteService['getVotedUsers'] = () => {
    return Promise.resolve([]);
  };

  upsert: UserVoteService['upsert'] = async ({
    gameId,
    vote,
    userId,
    roomId,
  }) => {
    const roomDocRef = doc(firebaseStore, 'rooms', roomId);
    const gameCollectionRef = collection(roomDocRef, 'game');
    const gameDocRef = doc(gameCollectionRef, gameId);

    await setDoc(gameDocRef, {
      votes: [vote, userId],
      createdAt: serverTimestamp(),
    });
  };
}
