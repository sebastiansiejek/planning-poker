'use server';

import type { PrismaClientKnownRequestError } from '@prisma/client/runtime/binary';
import { z } from 'zod';

import { GameServiceFactory } from '@/shared/factories/GameServiceFactory';
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
    const gamePrismaService = GameServiceFactory.getService();
    const isActiveGame = await gamePrismaService.getActiveGame({ roomId });

    if (isActiveGame) {
      return {
        success: false,
        error: {
          message: 'There is an active game in this room',
        },
      };
    }

    try {
      const data = await gamePrismaService.create({
        name,
        roomId,
        description,
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
      // TODO: adjust error to firebase
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
