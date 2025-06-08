import type Pusher from 'pusher-js';

import type en from './messages/en.json';

type Messages = typeof en;

declare global {
  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}
  var pusherInstance: Pusher | undefined;
  var prismaGlobal: ReturnType<typeof prismaClientSingleton>;

  interface Window {
    pusherInstance: Pusher | null;
  }
}
