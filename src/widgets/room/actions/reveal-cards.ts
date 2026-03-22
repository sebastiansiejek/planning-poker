'use server';

import { z } from 'zod';

import { GameServiceFactory } from '@/shared/factories/game-service-factory';
import { actionClient } from '@/shared/lib/safe-action';
import { RealtimeEvents, RealtimeTopics } from '@/shared/realtime/config/realtime-events';
import { broadcastToRealtime } from '@/shared/realtime/lib/supabase-realtime-server';

const schema = z.object({
  roomId: z.string(),
  gameId: z.string(),
});

export const revealCards = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { roomId, gameId } }) => {
    const gameFactory = GameServiceFactory.getService();
    const finishedGame = await gameFactory.finishGame({ roomId, gameId });

    await broadcastToRealtime(
      RealtimeTopics.roomEvents(roomId),
      RealtimeEvents.REVEAL_VOTES,
      {},
    );

    return {
      success: true,
      data: {
        finishedGame,
      },
    };
  });
