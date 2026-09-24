'use server';

import { z } from 'zod';

import { getRoomActor } from '@/shared/auth/room-access';
import { ParticipantServiceFactory } from '@/shared/factories/participant-service-factory';
import { actionClient } from '@/shared/lib/safe-action';

export const getRoomMembers = actionClient
  .schema(z.object({ roomId: z.string().min(1) }))
  .action(async ({ parsedInput: { roomId } }) => {
    if (!(await getRoomActor(roomId))) return { success: false };

    const members = await ParticipantServiceFactory.getService().getRoomMembers(roomId);
    return { success: true, members };
  });
