import { doc, getDoc } from 'firebase/firestore';

import { firebaseStore } from '@/shared/database/firebase';
import type { User } from '@/shared/types/user/user';

export class FirebaseUserService {
  get = async (userId: string) => {
    const userDocumentReference = doc(firebaseStore, 'users', userId);
    const userDocument = await getDoc(userDocumentReference);

    if (userDocument.exists()) {
      const userData = userDocument.data();

      return {
        id: userDocument.id,
        ...userData,
      } as User;
    }

    throw new Error(`User with ${userId} not exists`);
  };
}
