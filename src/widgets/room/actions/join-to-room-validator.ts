'use server';

import { z } from 'zod';

import { RoomServiceFactory } from '@/shared/factories/room-service-factory';
import { actionClient } from '@/shared/lib/safe-action';

const schema = z.object({
  id: z.string(),
});

export const joinToRoomValidator = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { id } }) => {
    const roomService = RoomServiceFactory.getService();
    const isRoom = await roomService.get({ id });

    return isRoom
      ? {
          success: true,
        }
      : {
          success: false,
          message: 'Room not found',
        };
  });
