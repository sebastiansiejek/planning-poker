import { child, get, ref, set } from 'firebase/database';
import { nanoid } from 'nanoid';

import { firebaseDatabase } from '@/shared/database/firebase';
import type { RoomService } from '@/shared/factories/RoomServiceFactory';

export class FirebaseRoomService implements RoomService {
  static ref = ref(firebaseDatabase, 'rooms');

  get: RoomService['get'] = async ({ name, authorId }) => {
    if (authorId) {
      return (
        await get(child(FirebaseRoomService.ref, `${name}/users/${authorId}`))
      ).val();
    }

    return (await get(child(FirebaseRoomService.ref, name))).val();
  };

  create: RoomService['create'] = async ({ name, authorId }) => {
    await set(child(FirebaseRoomService.ref, `${name}/users/${authorId}`), {
      name,
      id: nanoid(),
    });

    return (await this.get({ name, authorId }))!;
  };
}
