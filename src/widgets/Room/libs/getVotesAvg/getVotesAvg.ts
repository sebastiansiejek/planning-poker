import type { Vote } from '@/shared/types/types';

export const getVotesAvg = (votes: Vote[]) =>
  votes.reduce(
    (acc, vote) => {
      const { vote: voteValue } = vote;
      const found = acc.find((v) => v.value === voteValue);
      if (found) {
        found.count += 1;
      }

      if (!found) {
        acc.push({ value: voteValue, count: 1 });
      }

      return acc;
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
