'use server';

import { z } from 'zod';

import { getRoomActor } from '@/shared/auth/room-access';
import { ParticipantServiceFactory } from '@/shared/factories/participant-service-factory';
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
  channelName: z.string().min(1),
  targetUser: z.object({
    id: z.string().min(1),
  }),
});

export const triggerPaperThrowing = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { channelName, targetUser } }) => {
    const actor = await getRoomActor(channelName);
    if (!actor) return { success: false };
    const target = await ParticipantServiceFactory.getService().getActive(channelName, targetUser.id);
    if (!target) return { success: false };

    await broadcastToRealtime(
      RealtimeTopics.roomNotifications(channelName),
      RealtimeEvents.PAPER_THROWN,
      { triggerUser: { id: actor.participant.id }, targetUser: { id: target.id } },
    );

    return {
      success: true,
    };
  });
