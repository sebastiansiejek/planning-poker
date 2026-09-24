import type { Prisma } from '@prisma/client';

import { PrismaBaseService } from '@/shared/api/services/prisma/prisma-base-service';

export class PrismaUserService extends PrismaBaseService {
  async updateUser(id: string, data: Pick<Prisma.UserCreateManyInput, 'name'>) {
    return this.prisma.$transaction(async (transaction) => {
      const user = await transaction.user.update({
        data,
        where: { id },
      });
      await transaction.participant.updateMany({
        data: { name: user.name },
        where: { userId: id, leftAt: null },
      });
      const participants = await transaction.participant.findMany({
        where: { userId: id, leftAt: null },
        select: { id: true, roomId: true },
      });

      return { user, participants };
    });
  }

  async getOrCreateUserByEmail({
    email,
    name,
  }: {
    email: string;
    name: string;
  }) {
    return this.prisma.user.upsert({
      create: {
        email,
        name,
      },
      update: {},
      where: {
        email,
      },
    });
  }
}
