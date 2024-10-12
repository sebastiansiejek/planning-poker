'use server';

import { z } from 'zod';

import { actionClient } from '@/shared/lib/safeAction';
import { PUSHER_EVENTS } from '@/shared/pusher/config/PUSHER_EVENTS';
import { pusherServer } from '@/shared/pusher/lib/pusherServer';

export type TriggerPaperThrowingParams = {
  channelName: string;
  triggerUser: {
    id: string;
  };
  targetUser: {
    id: string;
  };
};

const schema = z.object({
  channelName: z.string(),
  triggerUser: z.object({
    id: z.string(),
  }),
  targetUser: z.object({
    id: z.string(),
  }),
});

export const triggerPaperThrowing = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { channelName, ...rest } }) => {
    await pusherServer.trigger(channelName, PUSHER_EVENTS.PAPER_THROWN, rest);

    return {
      success: true,
    };
  });
