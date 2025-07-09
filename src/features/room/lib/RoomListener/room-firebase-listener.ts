import { collection, doc, onSnapshot } from 'firebase/firestore';

import { RoomListener } from '@/features/room/lib/RoomListener/room-listener';
import { firebaseStore } from '@/shared/database/firebase';

export class RoomFirebaseListener extends RoomListener {
  constructor(private roomId: string) {
    super();
    this.gameSnapshot();
    this.roomSnapshot();
  }

  private roomSnapshot() {
    const roomCollectionReference = doc(firebaseStore, `rooms/${this.roomId}`);
    let isInitialLoad = true;

    const unsubscribe = onSnapshot(roomCollectionReference, (snapshot) => {
      if (isInitialLoad) {
        isInitialLoad = false;
        return;
      }

      const data = snapshot.data();
      if (data) {
        const { name } = data;

        this.emit('memberAdded', {
          id: snapshot.id,
          name,
          // TODO: Get avatar url
          avatarUrl: '',
        });
      }
    });

    this.unsubscribeListener.push(unsubscribe);
  }

  private gameSnapshot() {
    const gamesCollectionReference = collection(
      firebaseStore,
      `rooms/${this.roomId}/games`,
    );
    let isInitialLoad = true;

    const unsubscribe = onSnapshot(gamesCollectionReference, (snapshot) => {
      if (isInitialLoad) {
        isInitialLoad = false;
        return;
      }

      for (const change of snapshot.docChanges()) {
        const { name, status, description, votes } = change.doc.data();

        if (change.type === 'modified' && votes) {
            const { userId } = votes.at(-1);

            this.emit('voted', {
              userId,
            });

            if (status === 'FINISHED') {
              this.emit('revealVotes');
            }
          }

        if (change.type === 'added') {
          this.emit('resetVotes');
          this.emit('gameCreated', {
            name,
            status,
            description,
            id: change.doc.id,
          });
        }
      }
    });

    this.unsubscribeListener.push(unsubscribe);
  }
}
