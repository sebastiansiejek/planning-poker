'use server';

import { z } from 'zod';

import { GameServiceFactory } from '@/shared/factories/GameServiceFactory';
import { actionClient } from '@/shared/lib/safeAction';
import { PUSHER_EVENTS } from '@/shared/pusher/config/PUSHER_EVENTS';
import { pusherServer } from '@/shared/pusher/lib/pusherServer';

const schema = z.object({
  roomId: z.string(),
  gameId: z.string(),
});

export const revealCards = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { roomId, gameId } }) => {
    const gameFactory = GameServiceFactory.getService();
    const finishedGame = await gameFactory.finishGame({ roomId, gameId });

    await pusherServer.trigger(roomId, PUSHER_EVENTS.REVEAL_VOTES, {});

    return {
      success: true,
      data: {
        finishedGame,
      },
    };
  });
