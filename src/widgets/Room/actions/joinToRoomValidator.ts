'use server';

import { z } from 'zod';

import { RoomApiService } from '@/shared/api/services/RoomApiService';
import { actionClient } from '@/shared/lib/safeAction';

const schema = z.object({
  id: z.string(),
});

export const joinToRoomValidator = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { id } }) => {
    const roomService = new RoomApiService();
    const isRoom = await roomService.count(id);

    return isRoom
      ? {
          success: true,
        }
      : {
          success: false,
          message: 'Room not found',
        };
  });
