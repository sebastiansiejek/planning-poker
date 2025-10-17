'use server';

import { z } from 'zod';

import { RoomUserServiceFactory } from '@/shared/factories/room-user-service-factory';
import { UserVoteServiceFactory } from '@/shared/factories/user-vote-service-factory';
import { actionClient } from '@/shared/lib/safe-action';
import { PusherEvents } from '@/shared/pusher/config/pusher-events';
import { pusherServer } from '@/shared/pusher/lib/pusher-server';

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

    await pusherServer.trigger(roomId, PusherEvents.MEMBER_REMOVED, {
      id: userId,
    });

    return {
      success: true,
    };
  });
