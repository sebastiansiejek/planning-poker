'use server';

import { z } from 'zod';

import { RoomUserServiceFactory } from '@/shared/factories/RoomUserServiceFactory';
import { UserVoteServiceFactory } from '@/shared/factories/UserVoteServiceFactory';
import { actionClient } from '@/shared/lib/safeAction';
import { PUSHER_EVENTS } from '@/shared/pusher/config/PUSHER_EVENTS';
import { pusherServer } from '@/shared/pusher/lib/pusherServer';

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

    await pusherServer.trigger(roomId, PUSHER_EVENTS.MEMBER_REMOVED, {
      id: userId,
    });

    return {
      success: true,
    };
  });
