export type Vote = { vote: string; userId: string };

export type ILoader = {
  isLoading?: boolean;
};

export type DatabaseProvider = 'firebase' | 'prisma';
