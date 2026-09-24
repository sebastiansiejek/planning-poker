'use server';

import { z } from 'zod';

import { getRoomActor } from '@/shared/auth/room-access';
import { ParticipantServiceFactory } from '@/shared/factories/participant-service-factory';
import { actionClient } from '@/shared/lib/safe-action';
import { RealtimeEvents, RealtimeTopics } from '@/shared/realtime/config/realtime-events';
import { broadcastToRealtime } from '@/shared/realtime/lib/supabase-realtime-server';

const schema = z.object({
  channelName: z.string().min(1),
  userId: z.string().min(1),
  type: z.literal('alarm'),
});

export const notifyUserByRealtime = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { userId, channelName, type } }) => {
    const actor = await getRoomActor(channelName);
    if (!actor) return { success: false };
    const target = await ParticipantServiceFactory.getService().getActive(channelName, userId);
    if (!target) return { success: false };

    await broadcastToRealtime(
      RealtimeTopics.roomNotifications(channelName),
      RealtimeEvents.USER_ID(userId),
      { type },
    );

    return {
      success: true,
    };
  });
