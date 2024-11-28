'use server';

import { z } from 'zod';

import { PrismaRoomService } from '@/shared/api/services/prisma/PrismaRoomService';
import { actionClient } from '@/shared/lib/safeAction';

const schema = z.object({
  id: z.string(),
});

export const joinToRoomValidator = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { id } }) => {
    const roomService = new PrismaRoomService();
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
