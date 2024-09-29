'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import prisma from '@/shared/database/prisma';
import { actionClient } from '@/shared/lib/safeAction';
import { routes } from '@/shared/routes/routes';

const schema = z.object({
  id: z.string(),
});

export const deleteRoom = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { id } }) => {
    const deletedRoom = await prisma.room.delete({
      where: {
        id,
      },
    });

    revalidatePath(routes.dashboard.getPath());

    return {
      success: true,
      data: deletedRoom,
    };
  });
