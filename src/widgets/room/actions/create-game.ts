'use server';

import type { PrismaClientKnownRequestError } from '@prisma/client/runtime/binary';
import { z } from 'zod';

import { GameServiceFactory } from '@/shared/factories/game-service-factory';
import { actionClient } from '@/shared/lib/safe-action';
import { PusherEvents } from '@/shared/pusher/config/pusher-events';
import { pusherServer } from '@/shared/pusher/lib/pusher-server';

const schema = z.object({
  roomId: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
});

export const createGame = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { name, roomId, description } }) => {
    const gameService = GameServiceFactory.getService();
    const isActiveGame = await gameService.getActiveGame({ roomId });

    if (isActiveGame) {
      return {
        success: false,
        error: {
          message: 'There is an active game in this room',
        },
      };
    }

    try {
      const data = await gameService.create({
        name,
        roomId,
        description,
      });

      if (data) {
        await pusherServer.trigger(roomId, PusherEvents.GAME_CREATED, {
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

export type CreateGameParameters = z.infer<typeof schema>;
