import { roundHalf } from '@/shared/utils/roundHalf/roundHalf';

export const calcVotingAvg = (numberVotes: number[]) => {
  if (numberVotes.length === 0) return 0;

  return roundHalf(
    numberVotes.reduce((acc, v) => acc + v, 0) / numberVotes.length,
  );
};
