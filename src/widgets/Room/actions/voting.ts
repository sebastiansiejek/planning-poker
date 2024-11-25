'use server';

import type { PrismaClientKnownRequestError } from '@prisma/client/runtime/binary';
import z from 'zod';

import { UserVotePrismaService } from '@/shared/api/services/prisma/UserVotePrismaService';
import { getSession } from '@/shared/auth/auth';
import { actionClient } from '@/shared/lib/safeAction';
import { PUSHER_EVENTS } from '@/shared/pusher/config/PUSHER_EVENTS';
import { pusherServer } from '@/shared/pusher/lib/pusherServer';

const schema = z.object({
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

    const userVoteService = new UserVotePrismaService();
    try {
      await userVoteService.upsert({
        gameId,
        vote: value,
        userId,
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
