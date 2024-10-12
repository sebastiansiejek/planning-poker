'use server';

import { z } from 'zod';

import { actionClient } from '@/shared/lib/safeAction';
import { PUSHER_EVENTS } from '@/shared/pusher/config/PUSHER_EVENTS';
import { pusherServer } from '@/shared/pusher/lib/pusherServer';

const schema = z.object({
  channelName: z.string(),
  userId: z.string(),
  type: z.string(),
});

export const notifyUserByPusher = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { userId, channelName, type } }) => {
    await pusherServer.trigger(channelName, PUSHER_EVENTS.USER_ID(userId), {
      type,
    });

    return {
      success: true,
    };
  });
