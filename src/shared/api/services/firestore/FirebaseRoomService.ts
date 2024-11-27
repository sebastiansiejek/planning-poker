import { child, get, ref, set } from 'firebase/database';
import { nanoid } from 'nanoid';

import { firebaseDatabase } from '@/shared/database/firebase';

export class FirebaseRoomService {
  static ref = ref(firebaseDatabase, 'rooms');

  static create(name: string, authorId: string) {
    return set(child(FirebaseRoomService.ref, `${name}/users/${authorId}`), {
      name,
      id: nanoid(),
    });
  }

  static get(name: string, authorId?: string) {
    if (authorId) {
      return get(child(FirebaseRoomService.ref, `${name}/users/${authorId}`));
    }

    return get(child(FirebaseRoomService.ref, name));
  }
}
