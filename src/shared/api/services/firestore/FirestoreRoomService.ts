import { child, ref, set } from 'firebase/database';

import { firebaseDatabase } from '@/shared/database/firebase';

export class FirestoreRoomService {
  static create(name: string, authorId: number) {
    set(child(ref(firebaseDatabase, 'rooms'), `${name}/users/${authorId}`), {
      name,
    });
  }
}
