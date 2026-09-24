'use server';

import { z } from 'zod';

import { getSession } from '@/shared/auth/auth';
import { ParticipantServiceFactory } from '@/shared/factories/participant-service-factory';
import { RoomServiceFactory } from '@/shared/factories/room-service-factory';
import { actionClient } from '@/shared/lib/safe-action';

const schema = z.object({
  id: z.string().min(1),
});

export const joinToRoomValidator = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { id } }) => {
    const userId = (await getSession())?.user.id;
    if (!userId) return { success: false, message: 'Unauthorized' };

    if (await ParticipantServiceFactory.getService().isRemoved(id, userId)) {
      return { success: false, message: 'Room not found' };
    }

    const roomService = RoomServiceFactory.getService();
    const isRoom = await roomService.get({ id });

    return isRoom
      ? {
          success: true,
        }
      : {
          success: false,
          message: 'Room not found',
        };
  });
