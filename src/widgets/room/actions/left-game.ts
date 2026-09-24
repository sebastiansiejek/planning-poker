'use server';

import { z } from 'zod';

import { getRoomActor } from '@/shared/auth/room-access';
import { ParticipantServiceFactory } from '@/shared/factories/participant-service-factory';
import { RoomServiceFactory } from '@/shared/factories/room-service-factory';
import { actionClient } from '@/shared/lib/safe-action';
import { RealtimeEvents, RealtimeTopics } from '@/shared/realtime/config/realtime-events';
import { broadcastToRealtime } from '@/shared/realtime/lib/supabase-realtime-server';

const schema = z.object({
  roomId: z.string().min(1),
  participantId: z.string().min(1),
});

export const leftGame = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { roomId, participantId } }) => {
    const actor = await getRoomActor(roomId);
    if (!actor || actor.participant.id === participantId) return { success: false };
    const participantService = ParticipantServiceFactory.getService();
    const room = await RoomServiceFactory.getService().get({ id: roomId });
    if (!room || room.authorId !== actor.userId) return { success: false };

    const target = await participantService.getActive(roomId, participantId);
    if (!target) return { success: false };

    const removed = await participantService.leave(roomId, participantId);
    if (!removed) return { success: false };

    await broadcastToRealtime(
      RealtimeTopics.roomEvents(roomId),
      RealtimeEvents.MEMBER_REMOVED,
      { id: participantId },
    );

    return {
      success: true,
    };
  });
