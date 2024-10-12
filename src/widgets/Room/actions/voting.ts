'use server';

import type { PrismaClientKnownRequestError } from '@prisma/client/runtime/binary';
import z from 'zod';

import { getSession } from '@/shared/auth/auth';
import prisma from '@/shared/database/prisma';
import { actionClient } from '@/shared/lib/safeAction';
import { PUSHER_EVENTS } from '@/shared/pusher/config/PUSHER_EVENTS';
import { pusherServer } from '@/shared/pusher/lib/pusherServer';

const schema = z.object({
  userId: z.string(),
  value: z.string(),
  roomId: z.string(),
  gameId: z.string(),
});

export const voting = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { value, roomId, gameId } }) => {
    const session = await getSession();
    const userId = session?.user.id;

    if (!userId) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    // TODO: add guest user support

    // TODO: Add to service
    try {
      await prisma.userVote.upsert({
        create: {
          vote: value,
          user: {
            connect: {
              id: userId,
            },
          },
          game: {
            connect: {
              id: gameId,
            },
          },
        },
        update: {
          vote: value,
        },
        where: {
          userId_gameId: {
            userId,
            gameId,
          },
        },
      });

      await pusherServer.trigger(roomId, PUSHER_EVENTS.VOTED, {
        userId,
      });

      return {
        success: true,
      };
    } catch (error) {
      const typedError = error as PrismaClientKnownRequestError;

      if (typedError.code === 'P2025') {
        throw new Error('Game or user not found');
      }

      return {
        success: false,
      };
    }
  });
