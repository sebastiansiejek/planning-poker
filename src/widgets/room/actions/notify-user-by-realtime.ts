'use server';

import { z } from 'zod';

import { actionClient } from '@/shared/lib/safe-action';
import { RealtimeEvents, RealtimeTopics } from '@/shared/realtime/config/realtime-events';
import { broadcastToRealtime } from '@/shared/realtime/lib/supabase-realtime-server';

const schema = z.object({
  channelName: z.string(),
  userId: z.string(),
  type: z.string(),
});

export const notifyUserByRealtime = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { userId, channelName, type } }) => {
    await broadcastToRealtime(
      RealtimeTopics.roomNotifications(channelName),
      RealtimeEvents.USER_ID(userId),
      { type },
    );

    return {
      success: true,
    };
  });
