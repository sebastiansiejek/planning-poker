'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { getSession } from '@/shared/auth/auth';
import { RoomServiceFactory } from '@/shared/factories/room-service-factory';
import { actionClient } from '@/shared/lib/safe-action';


const schema = z.object({
  name: z.string().trim().min(1).max(100),
});

export const createRoom = actionClient
  .schema(schema)
  .action(async ({ parsedInput: { name } }) => {
    const session = await getSession();
    const authorId = session?.user?.id;

    if (!authorId) {
      return {
        error: {
          code: 'unauthorized',
        },
      };
    }

    const roomServiceFactory = RoomServiceFactory.getService();
    const room = await roomServiceFactory.getByAuthorIdAndName({
      name,
      authorId,
    });

    if (room) {
      return {
        success: false,
        data: {
          id: room.id,
        },
        error: {
          code: 'P2002',
        },
      };
    }

    let createdRoom;
    try {
      createdRoom = await roomServiceFactory.create({ name, authorId });
    } catch (error) {
      if (error instanceof Error && error.message === 'Room limit reached') {
        return { success: false, error: { code: 'ROOM_LIMIT' } };
      }
      throw error;
    }

    revalidatePath('/[locale]/dashboard', 'page');

    return {
      success: true,
      data: createdRoom,
    };
  });

export type CreateOrJoinToRoomParameters = z.infer<typeof schema>;
