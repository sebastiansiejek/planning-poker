import { collection, onSnapshot, query, where } from 'firebase/firestore';

import type { IRoomListener } from '@/features/room/lib/RoomListener/RoomListener.types';
import { firebaseStore } from '@/shared/database/firebase';
import type { PusherNewMember } from '@/shared/types/pusher/pusher';
import type { Vote } from '@/shared/types/types';
import type { RoomContextType } from '@/widgets/Room/model/RoomContext';

export class RoomFirebaseListener implements IRoomListener {
  constructor(private roomId: string) {}

  onGameCreated(callback: (data: RoomContextType['game']) => void): this {
    return this;
  }

  onMemberAdded(callback: (params: PusherNewMember) => void): this {
    return this;
  }

  onMemberRemoved(callback: (params: PusherNewMember) => void): this {
    return this;
  }

  onResetVotes(callback: Function): this {
    return this;
  }

  onRevealVotes(callback: Function): this {
    return this;
  }

  onShowVotes(callback: (params: Vote) => void): this {
    return this;
  }

  onVoted(callback: (params: { userId: string }) => void): this {
    const gamesCollectionRef = collection(
      firebaseStore,
      `rooms/${this.roomId}/games`,
    );
    const q = query(gamesCollectionRef, where('status', '==', 'STARTED'));

    onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const data = change.doc.data();
        const { userId } = data.votes.at(-1);
        callback({ userId });
      });
    });

    return this;
  }
}
