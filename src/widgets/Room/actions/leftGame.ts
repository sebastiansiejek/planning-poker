'use server';

import { z } from 'zod';

import { RoomUserPrismaService } from '@/shared/api/services/prisma/RoomUserPrismaService';
import { UserVotePrismaService } from '@/shared/api/services/prisma/UserVotePrismaService';
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
    const userVoteService = new UserVotePrismaService();
    const roomUserService = new RoomUserPrismaService();

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
