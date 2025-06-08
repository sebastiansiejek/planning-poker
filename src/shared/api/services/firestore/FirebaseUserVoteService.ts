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

    const roomDocumentReference = doc(firebaseStore, 'rooms', roomId);
    const gameCollectionReference = collection(roomDocumentReference, 'games');
    const gameDocumentReference = doc(gameCollectionReference, gameId);
    const gameSnapshot = await getDoc(gameDocumentReference);
    const game = gameSnapshot.data();

    return game?.votes || [];
  };

  upsert: UserVoteService['upsert'] = async ({
    gameId,
    vote,
    userId,
    roomId,
  }) => {
    const roomDocumentReference = doc(firebaseStore, 'rooms', roomId);
    const gameCollectionReference = collection(roomDocumentReference, 'games');
    const gameDocumentReference = doc(gameCollectionReference, gameId);
    const gameDocument = await getDoc(gameDocumentReference);

    if (!gameDocument.exists()) {
      return setDoc(gameDocumentReference, {
        votes: [vote, userId],
        createdAt: serverTimestamp(),
      });
    }

    const game = gameDocument.data() as {
      votes: Vote[];
    };

    const votes = game.votes || [];
    const existingVoteIndex = votes.findIndex((v) => v.userId === userId);

    if (existingVoteIndex === -1) {
      votes.push({ userId, vote });
    } else {
      votes[existingVoteIndex] = { userId, vote };
    }

    return updateDoc(gameDocumentReference, {
      votes,
    });
  };

  delete: UserVoteService['delete'] = async ({ roomId, userId }) => {
    const gameReference = doc(firebaseStore, 'rooms', roomId);
    await updateDoc(gameReference, {
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

    const gameReference = doc(firebaseStore, 'rooms', roomId, 'games', gameId);
    const gameSnapshot = await getDoc(gameReference);
    const gameData = gameSnapshot.data() as {
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
