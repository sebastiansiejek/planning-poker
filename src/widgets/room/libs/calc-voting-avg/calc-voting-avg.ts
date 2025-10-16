import { roundHalf } from '@/shared/utils/round-half/round-half';

export const calcVotingAvg = (numberVotes: number[]) => {
  if (numberVotes.length === 0) return 0;

  return roundHalf(
    numberVotes.reduce((accumulator, v) => accumulator + v, 0) / numberVotes.length,
  );
};
