'use server';

import type { PrismaClientKnownRequestError } from '@prisma/client/runtime/binary';
import { z } from 'zod';

import { getSession } from '@/shared/auth/auth';
import prisma from '@/shared/database/prisma';
import { actionClient } from '@/shared/lib/safeAction';

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

    try {
      await prisma.room.create({
        data: {
          name,
          authorId,
        },
      });
    } catch (error) {
      const typedError = error as PrismaClientKnownRequestError;
      return {
        error: {
          code: typedError.code,
        },
      };
    }

    return {
      success: true,
    };
  });

export type CreateOrJoinToRoomParams = z.infer<typeof schema>;
