'use server';

import z from 'zod';

import { actionClient } from '@/shared/lib/safe-action';
import { PusherEvents } from '@/shared/pusher/config/pusher-events';
import { pusherServer } from '@/shared/pusher/lib/pusher-server';

const schema = z.object({
  channelName: z.string(),
});

export const resetVotes = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { channelName } }) => {
    await pusherServer.trigger(channelName, PusherEvents.RESET_VOTES, {});

    return {
      success: true,
    };
  });
