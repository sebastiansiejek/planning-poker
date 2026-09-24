'use server';

import { z } from 'zod';

import { getRoomActor } from '@/shared/auth/room-access';
import { VoteServiceFactory } from '@/shared/factories/vote-service-factory';
import { actionClient } from '@/shared/lib/safe-action';

const schema = z.object({
  gameId: z.string().min(1),
  roomId: z.string().min(1),
});

export const getGameVotes = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { gameId, roomId } }) => {
    if (!(await getRoomActor(roomId))) return { success: false, data: { gameVotes: [] } };

    const gameVotes = await VoteServiceFactory.getService().getRevealedVotes(gameId, roomId);

    return {
      success: true,
      data: {
        gameVotes,
      },
    };
  });
