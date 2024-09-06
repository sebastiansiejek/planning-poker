import type { Vote } from '@/shared/types/types';

export const getNumberVotes = (votes: Vote[]) =>
  votes.map((vote) => +vote.value).filter((v) => !Number.isNaN(v));
