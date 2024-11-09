import prisma from '@/shared/database/prisma';

export abstract class BasePrismaService {
  prisma: typeof prisma;

  constructor() {
    this.prisma = prisma;
  }
}
