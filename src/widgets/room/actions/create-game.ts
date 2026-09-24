'use server';

import { z } from 'zod';

import { getRoomActor } from '@/shared/auth/room-access';
import { GameServiceFactory } from '@/shared/factories/game-service-factory';
import { actionClient } from '@/shared/lib/safe-action';
import { RealtimeEvents, RealtimeTopics } from '@/shared/realtime/config/realtime-events';
import { broadcastToRealtime } from '@/shared/realtime/lib/supabase-realtime-server';

const schema = z.object({
  roomId: z.string().min(1),
  name: z.string().trim().max(100).optional(),
  description: z.string().trim().max(1000).optional(),
});

export const createGame = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { name, roomId, description } }) => {
    const actor = await getRoomActor(roomId);
    if (!actor) return { success: false, error: { code: 'unauthorized' } };

    const gameService = GameServiceFactory.getService();
    const isActiveGame = await gameService.getActiveGame({ roomId });

    if (isActiveGame) {
      return {
        success: false,
        error: {
          message: 'There is an active game in this room',
        },
      };
    }

    try {
      const data = await gameService.create({
        name,
        roomId,
        actorUserId: actor.userId,
        description,
      });

      if (data) {
        await broadcastToRealtime(
          RealtimeTopics.roomEvents(roomId),
          RealtimeEvents.GAME_CREATED,
          data,
        );
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      if (error instanceof Error && error.message === 'Participant is not active') {
        return { success: false, error: { code: 'unauthorized' } };
      }
      if (error instanceof Error && error.message === 'There is an active game in this room') {
        return { success: false, error: { message: error.message } };
      }
      const code = (error as { code?: string }).code;
      if (!code) throw error;
      return {
        success: false,
        error: {
          code,
        },
      };
    }
  });

export type CreateGameParameters = z.infer<typeof schema>;
