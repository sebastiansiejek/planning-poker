'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { getSession } from '@/shared/auth/auth';
import { RoomServiceFactory } from '@/shared/factories/room-service-factory';
import { actionClient } from '@/shared/lib/safe-action';
import { RealtimeEvents, RealtimeTopics } from '@/shared/realtime/config/realtime-events';
import { broadcastToRealtime } from '@/shared/realtime/lib/supabase-realtime-server';

export const deleteRoom = actionClient
  .schema(z.object({ roomId: z.string().min(1).max(128) }))
  .action(async ({ parsedInput: { roomId } }) => {
    const authorId = (await getSession())?.user.id;
    if (!authorId) return { success: false };

    const deleted = await RoomServiceFactory.getService().deleteOwned({ roomId, authorId });
    if (!deleted) return { success: false };

    revalidatePath('/[locale]/dashboard', 'page');
    try {
      await broadcastToRealtime(RealtimeTopics.roomEvents(roomId), RealtimeEvents.ROOM_DELETED, {});
    } catch (error) {
      console.error('Room was deleted, but the Realtime notice failed', error);
    }

    return { success: true };
  });
