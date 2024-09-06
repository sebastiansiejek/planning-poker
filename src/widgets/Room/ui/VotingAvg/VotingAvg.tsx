import { useMemo } from 'react';

import { roundHalf } from '@/shared/utils/roundHalf/roundHalf';
import { getNumberVotes } from '@/widgets/Room/libs/getNumberVotes/getNumberVotes';
import { getVotesAvg } from '@/widgets/Room/libs/getVotesAvg/getVotesAvg';
import type { VotingAvgProps } from '@/widgets/Room/ui/VotingAvg/types';

export const VotingAvg = ({ votes }: VotingAvgProps) => {
  const sameVotes = useMemo(() => getVotesAvg(votes), [votes]);
  const numberVotes = getNumberVotes(votes);
  const avgVotes = roundHalf(
    numberVotes.reduce((acc, v) => acc + v, 0) / numberVotes.length,
  );

  return (
    <div className="flex justify-center items-center flex-col gap-5 p-6">
      {!!avgVotes && (
        <div data-testid="voting-avg">
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
