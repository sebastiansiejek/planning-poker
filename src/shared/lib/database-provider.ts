import type { DatabaseProvider } from '@/shared/types/types';

const supportedDatabaseProviders: DatabaseProvider[] = ['firebase', 'prisma'];

export const getDatabaseProvider = (): DatabaseProvider => {
  const provider = process.env.NEXT_PUBLIC_DATABASE_PROVIDER;

  if (
    provider &&
    supportedDatabaseProviders.includes(provider as DatabaseProvider)
  ) {
    return provider as DatabaseProvider;
  }

  throw new Error(
    'NEXT_PUBLIC_DATABASE_PROVIDER must be set to either "firebase" or "prisma".',
  );
};

export const validatePrismaDatabaseUrl = () => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL is required when NEXT_PUBLIC_DATABASE_PROVIDER is set to "prisma".',
    );
  }

  if (
    !databaseUrl.startsWith('postgresql://') &&
    !databaseUrl.startsWith('postgres://')
  ) {
    throw new Error(
      'DATABASE_URL must start with "postgresql://" or "postgres://" when NEXT_PUBLIC_DATABASE_PROVIDER is set to "prisma".',
    );
  }
};
