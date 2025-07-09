'use client';

import Pusher from 'pusher-js';

export const pusherClient = () => {
  if (globalThis.window !== undefined) {
    if (!globalThis.pusherInstance) {
      globalThis.pusherInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      });
    }

    return globalThis.pusherInstance;
  }

  throw new Error('Pusher is not initialized');
};
