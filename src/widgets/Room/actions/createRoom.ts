'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { getSession } from '@/shared/auth/auth';
import { RoomServiceFactory } from '@/shared/factories/RoomServiceFactory';
import { actionClient } from '@/shared/lib/safeAction';
import { routes } from '@/shared/routes/routes';

const schema = z.object({
  name: z.string(),
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

    const createdRoom = await roomServiceFactory.create({
      name,
      authorId,
    });

    revalidatePath(routes.dashboard.getPath());

    return {
      success: true,
      data: createdRoom,
    };
  });

export type CreateOrJoinToRoomParams = z.infer<typeof schema>;
