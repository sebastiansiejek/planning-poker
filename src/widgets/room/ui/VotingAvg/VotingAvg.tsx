import { useMemo } from 'react';

import { getVotesAvg } from '@/widgets/room/libs/getVotesAvg/getVotesAvg';
import type { VotingAvgProps } from '@/widgets/room/ui/VotingAvg/types';

export const VotingAvg = ({ votes }: VotingAvgProps) => {
  const sameVotes = useMemo(() => getVotesAvg(votes), [votes]);
  const correctVotes = votes
    .map((vote) => parseInt(vote.value, 10))
    .filter((v) => !Number.isNaN(v));
  const avgVotes =
    correctVotes.reduce((acc, v) => acc + v, 0) / correctVotes.length;

  return (
    <div className="flex justify-center items-center flex-col gap-5 p-6">
      {!!avgVotes && (
        <div>
          Average: <strong>{avgVotes}</strong>
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-4">
        {sameVotes.map(({ value, count }) => (
          <div key={value} className="text-center">
            <div className="flex items-center justify-center rounded bg-primary-100 dark:bg-gray-700 h-24 w-20 font-bold">
              {value}
            </div>
            <div className="mt-2">{count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
