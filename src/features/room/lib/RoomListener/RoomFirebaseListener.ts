import { collection, doc, onSnapshot } from 'firebase/firestore';

import { RoomListener } from '@/features/room/lib/RoomListener/RoomListener';
import { firebaseStore } from '@/shared/database/firebase';

export class RoomFirebaseListener extends RoomListener {
  constructor(private roomId: string) {
    super();
    this.gameSnapshot();
    this.roomSnapshot();
  }

  private roomSnapshot() {
    const roomCollectionRef = doc(firebaseStore, `rooms/${this.roomId}`);
    let isInitialLoad = true;

    const unsubscribe = onSnapshot(roomCollectionRef, (snapshot) => {
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
    const gamesCollectionRef = collection(
      firebaseStore,
      `rooms/${this.roomId}/games`,
    );
    let isInitialLoad = true;

    const unsubscribe = onSnapshot(gamesCollectionRef, (snapshot) => {
      if (isInitialLoad) {
        isInitialLoad = false;
        return;
      }

      snapshot.docChanges().forEach((change) => {
        const { name, status, description, votes } = change.doc.data();

        if (change.type === 'modified') {
          if (votes) {
            const { userId } = votes.at(-1);

            this.emit('voted', {
              userId,
            });

            if (status === 'FINISHED') {
              this.emit('revealVotes');
            }
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
      });
    });

    this.unsubscribeListener.push(unsubscribe);
  }
}
