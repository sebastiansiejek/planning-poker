'use server';

import type { PrismaClientKnownRequestError } from '@prisma/client/runtime/binary';
import { z } from 'zod';

import prisma from '@/shared/database/prisma';
import { actionClient } from '@/shared/lib/safeAction';
import { PUSHER_EVENTS } from '@/shared/pusher/config/PUSHER_EVENTS';
import { pusherServer } from '@/shared/pusher/lib/pusherServer';

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

      if (data) {
        await pusherServer.trigger(roomId, PUSHER_EVENTS.GAME_CREATED, {
          data,
        });
      }

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
