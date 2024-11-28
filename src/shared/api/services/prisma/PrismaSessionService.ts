import type { Prisma } from '@prisma/client';

import { PrismaBaseService } from '@/shared/api/services/prisma/PrismaBaseService';

export class PrismaSessionService extends PrismaBaseService {
  async create(data: Prisma.SessionUncheckedCreateInput) {
    return this.prisma.session.create({
      data,
    });
  }

  async deleteMany(data: Prisma.SessionDeleteManyArgs) {
    return this.prisma.session.deleteMany(data);
  }
}
