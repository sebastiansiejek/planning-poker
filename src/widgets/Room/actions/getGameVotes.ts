'use server';

import { z } from 'zod';

import prisma from '@/shared/database/prisma';
import { actionClient } from '@/shared/lib/safeAction';

const schema = z.object({
  gameId: z.string(),
});

export const getGameVotes = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { gameId } }) => {
    const data = await prisma.userVote.findMany({
      select: {
        vote: true,
        user: {
          select: {
            id: true,
          },
        },
      },
      where: {
        gameId,
      },
    });

    return {
      success: true,
      data,
    };
  });
