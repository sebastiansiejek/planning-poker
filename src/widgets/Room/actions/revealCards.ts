'use server';

import { z } from 'zod';

import { RoomApiService } from '@/shared/api/services/RoomApiService';
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
    const roomApiService = new RoomApiService();
    const finishedGame = await roomApiService.finishGame(gameId);

    await pusherServer.trigger(roomId, PUSHER_EVENTS.REVEAL_VOTES, {});

    return {
      success: true,
      data: {
        finishedGame,
      },
    };
  });
