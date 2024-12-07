'use server';

import { z } from 'zod';

import { UserVoteServiceFactory } from '@/shared/factories/UserVoteServiceFactory';
import { actionClient } from '@/shared/lib/safeAction';

const schema = z.object({
  gameId: z.string(),
  roomId: z.string().optional(),
});

export const getGameVotes = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { gameId, roomId } }) => {
    const userService = UserVoteServiceFactory.getService();
    const gameVotes = await userService.getGameVotes({ gameId, roomId });

    return {
      success: true,
      data: {
        gameVotes,
      },
    };
  });
