'use server';

import z from 'zod';

import { actionClient } from '@/shared/lib/safeAction';
import { PUSHER_EVENTS } from '@/shared/pusher/config/PUSHER_EVENTS';
import { pusherServer } from '@/shared/pusher/lib/pusherServer';

const schema = z.object({
  userId: z.string(),
  value: z.string(),
  roomId: z.string(),
});

export const voting = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { userId, value, roomId } }) => {
    try {
      await pusherServer.trigger(roomId, PUSHER_EVENTS.VOTED, {
        userId,
        value,
      });

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
      };
    }
  });
