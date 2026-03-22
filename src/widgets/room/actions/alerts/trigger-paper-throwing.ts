'use server';

import { z } from 'zod';

import { actionClient } from '@/shared/lib/safe-action';
import { RealtimeEvents, RealtimeTopics } from '@/shared/realtime/config/realtime-events';
import { broadcastToRealtime } from '@/shared/realtime/lib/supabase-realtime-server';

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
    await broadcastToRealtime(
      RealtimeTopics.roomNotifications(channelName),
      RealtimeEvents.PAPER_THROWN,
      rest,
    );

    return {
      success: true,
    };
  });
