'use server';

import { z } from 'zod';

import prisma from '@/shared/database/prisma';
import { actionClient } from '@/shared/lib/safeAction';

const schema = z.object({
  id: z.string(),
});

export const joinToRoomValidator = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { id } }) => {
    const room = await prisma.room.count({
      where: {
        id,
      },
    });

    return room
      ? {
          success: true,
        }
      : {
          success: false,
          message: 'Room not found',
        };
  });
