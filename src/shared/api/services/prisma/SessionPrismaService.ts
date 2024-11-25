import type { Prisma } from '@prisma/client';

import { BasePrismaService } from '@/shared/api/services/prisma/BasePrismaService';

export class SessionPrismaService extends BasePrismaService {
  async create(data: Prisma.SessionUncheckedCreateInput) {
    return this.prisma.session.create({
      data,
    });
  }

  async deleteMany(data: Prisma.SessionDeleteManyArgs) {
    return this.prisma.session.deleteMany(data);
  }
}
