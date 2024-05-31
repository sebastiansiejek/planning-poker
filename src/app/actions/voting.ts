'use server';

import z from 'zod';

import { pusherServer } from '@/shared/pusher/lib/pusherServer';

export const voting = async (data: FormData) => {
  const userId = data.get('userId');
  const channelName = data.get('channelName') as string;

  try {
    z.string().parse(userId);

    await pusherServer.trigger(channelName, 'voted', { userId });
  } catch (error) {
    console.error(error);
  }
};
