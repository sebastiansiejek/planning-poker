'use server';

import type { PrismaClientKnownRequestError } from '@prisma/client/runtime/binary';
import z from 'zod';

import { getRoomActor } from '@/shared/auth/room-access';
import { VoteServiceFactory } from '@/shared/factories/vote-service-factory';
import { actionClient } from '@/shared/lib/safe-action';
import { RealtimeEvents, RealtimeTopics } from '@/shared/realtime/config/realtime-events';
import { broadcastToRealtime } from '@/shared/realtime/lib/supabase-realtime-server';
import { votingValues } from '@/widgets/room/config/voting-constants';

const schema = z.object({
  value: z.enum(votingValues),
  roomId: z.string().min(1),
  gameId: z.string().min(1),
});

export const voting = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { value, roomId, gameId } }) => {
    const actor = await getRoomActor(roomId);
    if (!actor) return { success: false, message: 'Participant not found' };

    const voteService = VoteServiceFactory.getService();
    try {
      await voteService.upsert({
        gameId,
        vote: value,
        participantId: actor.participant.id,
        roomId,
      });

      await broadcastToRealtime(
        RealtimeTopics.roomEvents(roomId),
        RealtimeEvents.VOTED,
        { participantId: actor.participant.id },
      );

      return {
        success: true,
      };
    } catch (error) {
      const typedError = error as PrismaClientKnownRequestError;

      if (typedError.code === 'P2025') {
        throw new Error('Game or user not found');
      }

      return {
        success: false,
      };
    }
  });
