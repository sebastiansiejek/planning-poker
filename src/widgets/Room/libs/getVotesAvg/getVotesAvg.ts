import type { Vote } from '@/shared/types/types';

export const getVotesAvg = (votes: Vote[]) =>
  votes.reduce(
    (acc, vote) => {
      const { value } = vote;
      const found = acc.find((v) => v.value === value);
      if (found) {
        found.count += 1;
      } else {
        acc.push({ value, count: 1 });
      }

      return acc;
    },
    votes.length > 0
      ? [
          {
            value: votes[0].value,
            count: 0,
          },
        ]
      : [],
  );
