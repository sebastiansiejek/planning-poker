'use server';

import type { PrismaClientKnownRequestError } from '@prisma/client/runtime/binary';
import z from 'zod';

import { getSession } from '@/shared/auth/auth';
import { UserVoteServiceFactory } from '@/shared/factories/user-vote-service-factory';
import { actionClient } from '@/shared/lib/safe-action';
import { RealtimeEvents, RealtimeTopics } from '@/shared/realtime/config/realtime-events';
import { broadcastToRealtime } from '@/shared/realtime/lib/supabase-realtime-server';

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
    const userVoteService = UserVoteServiceFactory.getService();
    try {
      await userVoteService.upsert({
        gameId,
        vote: value,
        userId,
        roomId,
      });

      await broadcastToRealtime(
        RealtimeTopics.roomEvents(roomId),
        RealtimeEvents.VOTED,
        { userId },
      );

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
