'use server';

import z from 'zod';

import { PUSHER_EVENTS } from '@/shared/pusher/config/PUSHER_EVENTS';
import { pusherServer } from '@/shared/pusher/lib/pusherServer';

export const revealCards = async (data: FormData) => {
  const channelName = data.get('channelName') as string;
  const voteValue = data.get('voteValue') as string;

  try {
    z.object({
      channelName: z.string(),
      voteValue: z.string(),
    }).parse({ channelName, voteValue });

    await pusherServer.trigger(channelName, PUSHER_EVENTS.REVEAL_VOTES, {
      value: voteValue,
    });
  } catch (error) {
    console.error(error);
  }
};
