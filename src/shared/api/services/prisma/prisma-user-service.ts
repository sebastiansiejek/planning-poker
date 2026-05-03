import type { Prisma } from '@prisma/client';

import { PrismaBaseService } from '@/shared/api/services/prisma/prisma-base-service';

export class PrismaUserService extends PrismaBaseService {
  async updateUser(id: string, data: Pick<Prisma.UserCreateManyInput, 'name'>) {
    return this.prisma.user.update({
      data,
      where: {
        id,
      },
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
