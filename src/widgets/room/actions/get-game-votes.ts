'use server';

import { z } from 'zod';

import { getSession } from '@/shared/auth/auth';
import { ParticipantServiceFactory } from '@/shared/factories/participant-service-factory';
import { VoteServiceFactory } from '@/shared/factories/vote-service-factory';
import { actionClient } from '@/shared/lib/safe-action';

const schema = z.object({
  gameId: z.string(),
  roomId: z.string(),
});

export const getGameVotes = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { gameId, roomId } }) => {
    const session = await getSession();
    const userId = session?.user.id;
    const participant = userId
      ? await ParticipantServiceFactory.getService().getAuthenticated(roomId, userId)
      : null;
    if (!participant) return { success: false, data: { gameVotes: [] } };

    const gameVotes = await VoteServiceFactory.getService().getRevealedVotes(gameId, roomId);

    return {
      success: true,
      data: {
        gameVotes,
      },
    };
  });
