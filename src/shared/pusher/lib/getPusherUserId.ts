import Cookie from 'js-cookie';
import { nanoid } from 'nanoid';

export const PUSHER_USER_ID_COOKIE = 'PUSHER_USER_ID';

export const getPusherUserId = () => {
  const storedId = Cookie.get(PUSHER_USER_ID_COOKIE);

  if (storedId) {
    return storedId;
  }

  const id = nanoid();
  Cookie.set(PUSHER_USER_ID_COOKIE, id);
  return id;
};
