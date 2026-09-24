'use server';

import { z } from 'zod';

import { getRoomActor } from '@/shared/auth/room-access';
import { GameServiceFactory } from '@/shared/factories/game-service-factory';
import { actionClient } from '@/shared/lib/safe-action';
import { RealtimeEvents, RealtimeTopics } from '@/shared/realtime/config/realtime-events';
import { broadcastToRealtime } from '@/shared/realtime/lib/supabase-realtime-server';

const schema = z.object({
  roomId: z.string().min(1),
  gameId: z.string().min(1),
});

export const revealCards = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { roomId, gameId } }) => {
    const actor = await getRoomActor(roomId);
    if (!actor) return { success: false };

    const gameFactory = GameServiceFactory.getService();
    let finishedGame;
    try {
      finishedGame = await gameFactory.finishGame({ roomId, gameId, actorUserId: actor.userId });
    } catch (error) {
      if (
        (error as { code?: string }).code === 'P2025' ||
        (error instanceof Error && error.message === 'Participant is not active')
      ) {
        return { success: false };
      }
      throw error;
    }

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
