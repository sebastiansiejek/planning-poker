'use server';

import { z } from 'zod';

import { RoomApiService } from '@/shared/api/services/RoomApiService';
import { actionClient } from '@/shared/lib/safeAction';

const schema = z.object({
  gameId: z.string(),
});

export const getGameVotes = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { gameId } }) => {
    const roomApiService = new RoomApiService();
    const gameVotes = await roomApiService.getGameVotes(gameId);

    return {
      success: true,
      data: {
        gameVotes,
      },
    };
  });
