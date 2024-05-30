import {cookies} from "next/headers";

export class UserModel {
  static storeKey = 'USER_NAME'

  static getUserName = () => {
    const cookieStore = cookies()

    return cookieStore.get(this.storeKey)?.value
  }

  static setUserName = (name: string) => {
    const cookieStore = cookies()

    return cookieStore.set(this.storeKey, name)
  }

}
