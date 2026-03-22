'use server';

import { z } from 'zod';

import { RoomUserServiceFactory } from '@/shared/factories/room-user-service-factory';
import { UserVoteServiceFactory } from '@/shared/factories/user-vote-service-factory';
import { actionClient } from '@/shared/lib/safe-action';
import { RealtimeEvents, RealtimeTopics } from '@/shared/realtime/config/realtime-events';
import { broadcastToRealtime } from '@/shared/realtime/lib/supabase-realtime-server';

const schema = z.object({
  roomId: z.string(),
  userId: z.string(),
  gameId: z.string(),
});

export const leftGame = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { roomId, userId, gameId } }) => {
    const userVoteService = UserVoteServiceFactory.getService();
    const roomUserService = RoomUserServiceFactory.getService();

    await Promise.all([
      roomUserService.delete({
        userId,
        roomId,
      }),
      userVoteService.delete({
        gameId,
        roomId,
        userId,
      }),
    ]);

    await broadcastToRealtime(
      RealtimeTopics.roomEvents(roomId),
      RealtimeEvents.MEMBER_REMOVED,
      { id: userId },
    );

    return {
      success: true,
    };
  });
