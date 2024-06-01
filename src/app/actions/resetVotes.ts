'use server';

import z from 'zod';

import { PUSHER_EVENTS } from '@/shared/pusher/config/PUSHER_EVENTS';
import { pusherServer } from '@/shared/pusher/lib/pusherServer';

export const resetVotes = async (data: FormData) => {
  const channelName = data.get('channelName') as string;

  try {
    z.string().parse(channelName);

    await pusherServer.trigger(channelName, PUSHER_EVENTS.RESET_VOTES, {});
  } catch (error) {
    console.error(error);
  }
};
