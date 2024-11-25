'use server';

import { z } from 'zod';

import { UserVotePrismaService } from '@/shared/api/services/prisma/UserVotePrismaService';
import { actionClient } from '@/shared/lib/safeAction';

const schema = z.object({
  gameId: z.string(),
});

export const getGameVotes = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { gameId } }) => {
    const userService = new UserVotePrismaService();
    const gameVotes = await userService.getGameVotes(gameId);

    return {
      success: true,
      data: {
        gameVotes,
      },
    };
  });
