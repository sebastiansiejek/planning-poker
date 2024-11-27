'use server';

import type { PrismaClientKnownRequestError } from '@prisma/client/runtime/binary';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { FirebaseRoomService } from '@/shared/api/services/firestore/FirebaseRoomService';
import { RoomPrismaService } from '@/shared/api/services/prisma/RoomPrismaService';
import { getSession } from '@/shared/auth/auth';
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

    const prismaRoomService = new RoomPrismaService();

    if (process.env.DATABASE_PROVIDER === 'firebase') {
      const room = await FirebaseRoomService.get(name, authorId);

      if (room.exists()) {
        const values = room.val();

        return {
          success: false,
          data: {
            id: values.id,
          },
          error: {
            code: 'P2002',
          },
        };
      }

      await FirebaseRoomService.create(name, authorId);

      revalidatePath(routes.dashboard.getPath());

      return {
        success: true,
        data: room.val(),
      };
    }

    try {
      const room = await prismaRoomService.create({
        name,
        authorId,
      });

      revalidatePath(routes.dashboard.getPath());

      return {
        success: true,
        data: room,
      };
    } catch (error) {
      const typedError = error as PrismaClientKnownRequestError;
      const room = await prismaRoomService.findFirst({
        where: {
          name,
          authorId,
        },
      });

      return {
        success: false,
        data: {
          id: room?.id,
        },
        error: {
          code: typedError.code,
        },
      };
    }
  });

export type CreateOrJoinToRoomParams = z.infer<typeof schema>;
