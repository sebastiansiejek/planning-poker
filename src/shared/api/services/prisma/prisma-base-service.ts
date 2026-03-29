import { getPrisma } from '@/shared/database/prisma';

export abstract class PrismaBaseService {
  prisma: ReturnType<typeof getPrisma>;

  constructor() {
    this.prisma = getPrisma();
  }
}
