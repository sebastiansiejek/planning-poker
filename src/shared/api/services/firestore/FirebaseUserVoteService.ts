import {
  arrayRemove,
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
  getVotedUsers: UserVoteService['getVotedUsers'] = async (gameId, roomId) => {
    if (!roomId) {
      throw new Error('Room id is required for Firebase provider');
    }

    const roomDocRef = doc(firebaseStore, 'rooms', roomId);
    const gameCollectionRef = collection(roomDocRef, 'games');
    const gameDocRef = doc(gameCollectionRef, gameId);
    const game = (await getDoc(gameDocRef)).data();

    return game?.votes || [];
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

  delete: UserVoteService['delete'] = async ({ roomId, userId }) => {
    const gameRef = doc(firebaseStore, 'rooms', roomId);
    await updateDoc(gameRef, {
      users: arrayRemove(userId),
    });
  };

  getGameVotes: UserVoteService['getGameVotes'] = async ({
    gameId,
    roomId,
  }) => {
    if (!roomId) {
      throw new Error('Argument gameId is required');
    }

    const gameRef = doc(firebaseStore, 'rooms', roomId, 'games', gameId);
    const gameData = (await getDoc(gameRef)).data() as {
      votes: {
        userId: string;
        vote: string;
      }[];
    };

    return gameData.votes.map(({ vote, userId }) => ({
      user: {
        id: userId,
      },
      vote,
    }));
  };
}
