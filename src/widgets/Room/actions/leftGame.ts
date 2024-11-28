'use server';

import { z } from 'zod';

import { PrismaRoomUserService } from '@/shared/api/services/prisma/PrismaRoomUserService';
import { PrismaUserVoteService } from '@/shared/api/services/prisma/PrismaUserVoteService';
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
    const userVoteService = new PrismaUserVoteService();
    const roomUserService = new PrismaRoomUserService();

    await Promise.all([
      roomUserService.delete({
        where: {
          roomId_userId: {
            userId,
            roomId,
          },
        },
      }),
      userVoteService.delete({
        where: {
          userId_gameId: {
            userId,
            gameId,
          },
        },
      }),
    ]);

    await pusherServer.trigger(roomId, PUSHER_EVENTS.MEMBER_REMOVED, {
      id: userId,
    });

    return {
      success: true,
    };
  });
