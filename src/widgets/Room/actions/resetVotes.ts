'use server';

import z from 'zod';

import { actionClient } from '@/shared/lib/safeAction';
import { PUSHER_EVENTS } from '@/shared/pusher/config/PUSHER_EVENTS';
import { pusherServer } from '@/shared/pusher/lib/pusherServer';

const schema = z.object({
  channelName: z.string(),
});

export const resetVotes = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { channelName } }) => {
    await pusherServer.trigger(channelName, PUSHER_EVENTS.RESET_VOTES, {});

    return {
      success: true,
    };
  });
