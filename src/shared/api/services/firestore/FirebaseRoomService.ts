import { child, ref, set } from 'firebase/database';

import { firebaseDatabase } from '@/shared/database/firebase';

export class FirebaseRoomService {
  static create(name: string, authorId: number) {
    set(child(ref(firebaseDatabase, 'rooms'), `${name}/users/${authorId}`), {
      name,
    });
  }
}
