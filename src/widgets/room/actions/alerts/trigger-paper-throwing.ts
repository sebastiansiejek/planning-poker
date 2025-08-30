'use server';

import { z } from 'zod';

import { actionClient } from '@/shared/lib/safe-action';
import { PusherEvents } from '@/shared/pusher/config/pusher-events';
import { pusherServer } from '@/shared/pusher/lib/pusher-server';

export type TriggerPaperThrowingParameters = {
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
    await pusherServer.trigger(channelName, PusherEvents.PAPER_THROWN, rest);

    return {
      success: true,
    };
  });
