import type { Prisma } from '@prisma/client';

import { BasePrismaService } from '@/shared/api/services/BasePrismaService';
import prisma from '@/shared/database/prisma';

export class UserApiService extends BasePrismaService {
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
      user = await prisma.user.create({
        data: {
          email,
          name,
        },
      });
    }

    return user;
  }
}
