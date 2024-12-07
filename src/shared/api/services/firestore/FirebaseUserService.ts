import { doc, getDoc } from 'firebase/firestore';

import { firebaseStore } from '@/shared/database/firebase';
import type { User } from '@/shared/types/user/user';

export class FirebaseUserService {
  get = async (userId: string) => {
    const userDocRef = doc(firebaseStore, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();

      return {
        id: userDoc.id,
        ...userData,
      } as User;
    }

    throw Error(`User with ${userId} not exists`);
  };
}
