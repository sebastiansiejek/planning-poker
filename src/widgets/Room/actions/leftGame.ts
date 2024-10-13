'use server';

import { z } from 'zod';

import prisma from '@/shared/database/prisma';
import { actionClient } from '@/shared/lib/safeAction';
import { PUSHER_EVENTS } from '@/shared/pusher/config/PUSHER_EVENTS';
import { pusherServer } from '@/shared/pusher/lib/pusherServer';

const schema = z.object({
  channelId: z.string(),
  userId: z.string(),
});

export const leftGame = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { channelId, userId } }) => {
    await prisma.roomUser.delete({
      where: {
        roomId_userId: {
          roomId: channelId,
          userId,
        },
      },
    });

    await pusherServer.trigger(channelId, PUSHER_EVENTS.MEMBER_REMOVED, {
      id: userId,
    });

    return {
      success: true,
    };
  });
