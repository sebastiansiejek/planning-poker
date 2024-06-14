'use server';

import { z } from 'zod';

import { PUSHER_EVENTS } from '@/shared/pusher/config/PUSHER_EVENTS';
import { pusherServer } from '@/shared/pusher/lib/pusherServer';

export const notifyUserByPusher = async (data: FormData) => {
  const channelName = data.get('channelName') as string;
  const userId = data.get('userId') as string;
  const type = data.get('type') as string;

  try {
    z.object({
      channelName: z.string(),
      userId: z.string(),
    }).parse({
      channelName,
      userId,
    });

    await pusherServer.trigger(channelName, PUSHER_EVENTS.USER_ID(userId), {
      type,
    });
  } catch (e) {
    console.log(e);
  }
};
