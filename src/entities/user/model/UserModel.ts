import { cookies } from 'next/headers';

export class UserModel {
  static storeNameKey = 'USER_NAME';

  static storeAvatarKey = 'USER_AVATAR';

  static getUserName = () => {
    const cookieStore = cookies();

    return cookieStore.get(this.storeNameKey)?.value;
  };

  static getAvatarUrl = () => {
    const cookieStore = cookies();

    return cookieStore.get(this.storeAvatarKey)?.value;
  };

  static setUserName = (name: string) => {
    const cookieStore = cookies();

    return cookieStore.set(this.storeNameKey, name);
  };

  static setAvatarUrl = (url: string) => {
    const cookieStore = cookies();

    return cookieStore.set(this.storeAvatarKey, url);
  };
}
