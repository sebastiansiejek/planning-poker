import type { Prisma } from '@prisma/client';

import { PrismaBaseService } from '@/shared/api/services/prisma/prisma-base-service';
import { getPrisma } from '@/shared/database/prisma';

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
    let user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      user = await getPrisma().user.create({
        data: {
          email,
          name,
        },
      });
    }

    return user;
  }
}
