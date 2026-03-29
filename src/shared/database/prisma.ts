import { PrismaClient } from '@prisma/client';

import {
  getDatabaseProvider,
  validatePrismaDatabaseUrl,
} from '@/shared/lib/database-provider';

const prismaClientSingleton = () => {
  if (getDatabaseProvider() === 'prisma') {
    validatePrismaDatabaseUrl();
  }

  return new PrismaClient();
};

export const getPrisma = () => {
  const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

  if (process.env.NODE_ENV !== 'production') {
    globalThis.prismaGlobal = prisma;
  }

  return prisma;
};
