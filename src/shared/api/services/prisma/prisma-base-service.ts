import prisma from '@/shared/database/prisma';

export abstract class PrismaBaseService {
  prisma: typeof prisma;

  constructor() {
    this.prisma = prisma;
  }
}
