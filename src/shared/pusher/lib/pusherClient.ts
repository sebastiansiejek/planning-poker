'use client';

import Pusher from 'pusher-js';

export const pusherClient = () => {
  if (typeof window !== 'undefined') {
    if (!window.pusherInstance) {
      window.pusherInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
      });
    }

    return window.pusherInstance;
  }

  return null;
};
