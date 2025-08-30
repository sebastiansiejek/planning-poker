'use server';

import { z } from 'zod';

import { actionClient } from '@/shared/lib/safe-action';
import { PusherEvents } from '@/shared/pusher/config/pusher-events';
import { pusherServer } from '@/shared/pusher/lib/pusher-server';

const schema = z.object({
  channelName: z.string(),
  userId: z.string(),
  type: z.string(),
});

export const notifyUserByPusher = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { userId, channelName, type } }) => {
    await pusherServer.trigger(channelName, PusherEvents.USER_ID(userId), {
      type,
    });

    return {
      success: true,
    };
  });
