import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

import { firebaseStore } from '@/shared/database/firebase';
import type { UserVoteService } from '@/shared/factories/UserVoteServiceFactory';
import type { Vote } from '@/shared/types/types';

export class FirebaseUserVoteService implements UserVoteService {
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
    const gameCollectionRef = collection(roomDocRef, 'games');
    const gameDocRef = doc(gameCollectionRef, gameId);
    const gameDoc = await getDoc(gameDocRef);

    if (!gameDoc.exists()) {
      return setDoc(gameDocRef, {
        votes: [vote, userId],
        createdAt: serverTimestamp(),
      });
    }

    const game = gameDoc.data() as {
      votes: Vote[];
    };

    const votes = game.votes || [];
    const existingVoteIndex = votes.findIndex((v) => v.userId === userId);

    if (existingVoteIndex >= 0) {
      votes[existingVoteIndex] = { userId, vote };
    } else {
      votes.push({ userId, vote });
    }

    return updateDoc(gameDocRef, {
      votes,
    });
  };
}
