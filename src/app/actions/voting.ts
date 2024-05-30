'use server';

import z from 'zod';

import { pusherServer } from '@/shared/pusher/lib/pusherServer';

export const voting = async (data: FormData) => {
  const userId = data.get('userId');
  const value = data.get('value');
  const channelName = data.get('channelName') as string;

  try {
    z.object({
      userId: z.string(),
      value: z.string(),
      channelName: z.string(),
    }).parse({
      userId,
      value,
      channelName,
    });

    await pusherServer.trigger(channelName, 'voting', { userId, value });
  } catch (e) {
    // saa
    throw new Error(e as string);
  }
};
