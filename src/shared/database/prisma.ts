import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => new PrismaClient();

export const getPrisma = () => {
  const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

  if (process.env.NODE_ENV !== 'production') {
    globalThis.prismaGlobal = prisma;
  }

  return prisma;
};
