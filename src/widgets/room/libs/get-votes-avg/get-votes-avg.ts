import type { Vote } from '@/shared/types/types';

export const getVotesAvg = (votes: Vote[]) =>
  votes.reduce(
    (accumulator, vote) => {
      const { vote: voteValue } = vote;
      const found = accumulator.find((v) => v.value === voteValue);
      if (found) {
        found.count += 1;
      }

      if (!found) {
        accumulator.push({ value: voteValue, count: 1 });
      }

      return accumulator;
    },
    votes.length > 0
      ? [
          {
            value: votes[0].vote,
            count: 0,
          },
        ]
      : [],
  );
