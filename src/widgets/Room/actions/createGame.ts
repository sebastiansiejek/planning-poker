'use server';

import type { PrismaClientKnownRequestError } from '@prisma/client/runtime/binary';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import prisma from '@/shared/database/prisma';
import { actionClient } from '@/shared/lib/safeAction';
import { routes } from '@/shared/routes/routes';

const schema = z.object({
  roomId: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
});

export const createGame = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { name, roomId, description } }) => {
    const isActiveGame = await prisma.game.count({
      where: {
        roomId,
        status: 'STARTED',
      },
    });

    if (isActiveGame) {
      return {
        success: false,
        error: {
          message: 'There is an active game in this room',
        },
      };
    }

    try {
      const data = await prisma.game.create({
        data: {
          name,
          roomId,
          description,
        },
      });

      revalidatePath(routes.game.singleGame.getPath(roomId));

      return {
        success: true,
        data,
      };
    } catch (error) {
      const typedError = error as PrismaClientKnownRequestError;
      return {
        success: false,
        error: {
          code: typedError.code,
        },
      };
    }
  });

export type CreateGameParams = z.infer<typeof schema>;
