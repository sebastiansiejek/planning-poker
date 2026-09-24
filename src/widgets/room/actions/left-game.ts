'use server';

import { z } from 'zod';

import { getSession } from '@/shared/auth/auth';
import { ParticipantServiceFactory } from '@/shared/factories/participant-service-factory';
import { RoomServiceFactory } from '@/shared/factories/room-service-factory';
import { actionClient } from '@/shared/lib/safe-action';
import { RealtimeEvents, RealtimeTopics } from '@/shared/realtime/config/realtime-events';
import { broadcastToRealtime } from '@/shared/realtime/lib/supabase-realtime-server';

const schema = z.object({
  roomId: z.string(),
  participantId: z.string(),
});

export const leftGame = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { roomId, participantId } }) => {
    const session = await getSession();
    const userId = session?.user.id;
    if (!userId) return { success: false };

    const participantService = ParticipantServiceFactory.getService();
    const [room, actor] = await Promise.all([
      RoomServiceFactory.getService().get({ id: roomId }),
      participantService.getAuthenticated(roomId, userId),
    ]);
    if (!room || !actor || (room.authorId !== userId && actor.id !== participantId)) {
      return { success: false };
    }

    await participantService.leave(roomId, participantId);

    await broadcastToRealtime(
      RealtimeTopics.roomEvents(roomId),
      RealtimeEvents.MEMBER_REMOVED,
      { id: participantId },
    );

    return {
      success: true,
    };
  });
