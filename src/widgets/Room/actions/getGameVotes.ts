'use server';

import { z } from 'zod';

import { actionClient } from '@/shared/lib/safeAction';
import { RoomApiService } from '@/widgets/Room/api/RoomApiService';

const schema = z.object({
  gameId: z.string(),
});

export const getGameVotes = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { gameId } }) => {
    const roomApiService = new RoomApiService();
    const data = await roomApiService.getGameVotes(gameId);

    return {
      success: true,
      data,
    };
  });
