'use server';

import type { PrismaClientKnownRequestError } from '@prisma/client/runtime/binary';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { RoomApiService } from '@/shared/api/services/prisma/RoomApiService';
import { getSession } from '@/shared/auth/auth';
import { actionClient } from '@/shared/lib/safeAction';
import { routes } from '@/shared/routes/routes';

const schema = z.object({
  name: z.string(),
});

export const createRoom = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { name } }) => {
    const session = await getSession();
    const authorId = session?.user?.id;

    const roomService = new RoomApiService();

    if (!authorId) {
      return {
        error: {
          code: 'unauthorized',
        },
      };
    }

    try {
      const room = await roomService.create({
        name,
        authorId,
      });

      revalidatePath(routes.dashboard.getPath());

      return {
        success: true,
        data: room,
      };
    } catch (error) {
      const typedError = error as PrismaClientKnownRequestError;
      const room = await roomService.findFirst({
        where: {
          name,
          authorId,
        },
      });

      return {
        success: false,
        data: {
          id: room?.id,
        },
        error: {
          code: typedError.code,
        },
      };
    }
  });

export type CreateOrJoinToRoomParams = z.infer<typeof schema>;
