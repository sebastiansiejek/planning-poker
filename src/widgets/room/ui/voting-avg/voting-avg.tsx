'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { Container } from '@/shared/ui-kit/container/container';
import { calcVotingAvg } from '@/widgets/room/libs/calc-voting-avg/calc-voting-avg';
import { getNumberVotes } from '@/widgets/room/libs/get-number-votes/get-number-votes';
import { getVotesAvg } from '@/widgets/room/libs/get-votes-avg/get-votes-avg';
import type { VotingAvgProperties } from '@/widgets/room/ui/voting-avg/types';

export const VotingAvg = ({ votes }: VotingAvgProperties) => {
  const sameVotes = useMemo(() => getVotesAvg(votes), [votes]);
  const numberVotes = getNumberVotes(votes);
  const avgVotes = calcVotingAvg(numberVotes);
  const translate = useTranslations('Voting');
  const areVotes = sameVotes.length > 0;

  return (
    <Container className="sticky bg-background bottom-0 flex justify-center items-center flex-col gap-5 py-4">
      {!!avgVotes && (
        <div data-testid="voting-avg">
          {translate.rich('avg', {
            avg: avgVotes,
          })}
        </div>
      )}
      {!areVotes && <div>{translate('noVotes')}</div>}
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
    </Container>
  );
};
