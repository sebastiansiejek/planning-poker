'use server';

import z from 'zod';

import { PUSHER_EVENTS } from '@/shared/pusher/config/PUSHER_EVENTS';
import { pusherServer } from '@/shared/pusher/lib/pusherServer';

export const voting = async (data: FormData) => {
  const userId = data.get('userId');
  const value = data.get('value');
  const channelName = data.get('channelName') as string;

  try {
    z.string().parse(userId);

    await pusherServer.trigger(channelName, PUSHER_EVENTS.VOTED, {
      userId,
      value,
    });
  } catch (error) {
    console.error(error);
  }
};
