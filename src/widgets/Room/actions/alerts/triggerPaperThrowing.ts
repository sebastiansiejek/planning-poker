'use server';

import { z } from 'zod';

import { PUSHER_EVENTS } from '@/shared/pusher/config/PUSHER_EVENTS';
import { pusherServer } from '@/shared/pusher/lib/pusherServer';

export type TriggerPaperThrowingParams = {
  channelName: string;
  triggerUser: {
    id: string;
  };
  targetUser: {
    id: string;
  };
};
export const triggerPaperThrowing = async (
  data: TriggerPaperThrowingParams,
) => {
  try {
    z.object({
      channelName: z.string(),
      triggerUser: z.object({
        id: z.string(),
      }),
      targetUser: z.object({
        id: z.string(),
      }),
    }).parse(data);

    const { channelName, ...rest } = data;

    await pusherServer.trigger(channelName, PUSHER_EVENTS.PAPER_THROWN, rest);
  } catch (e) {
    console.log(e);
  }
};
