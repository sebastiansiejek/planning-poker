'use client';

import { Lightbulb  } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {PropsWithChildren, useMemo} from 'react';

import {Button} from '@/shared/ui-kit/button/button';
import { Container } from '@/shared/ui-kit/container/container';
import {Sheet, SheetContent, SheetTitle, SheetTrigger} from '@/shared/ui-kit/sheet/sheet';
import { calcVotingAvg } from '@/widgets/room/libs/calc-voting-avg/calc-voting-avg';
import { getNumberVotes } from '@/widgets/room/libs/get-number-votes/get-number-votes';
import { getVotesAvg } from '@/widgets/room/libs/get-votes-avg/get-votes-avg';
import type { VotingAvgProperties } from '@/widgets/room/ui/voting-avg/types';

type VotedUser = PropsWithChildren<{
  value: string;
  count: number;
}>

const VotedUser = ({children, value, count}: VotedUser) => {

  return (
    <div  className="text-center">
      <div className="flex items-center justify-center rounded bg-primary-100 dark:bg-gray-700 h-24 w-20 font-bold">
        {value}
      </div>
      <div className="mt-2">{count}</div>
      {children}
    </div>
  )
}

export const VotingAvg = ({ votes, issueEstimate }: VotingAvgProperties) => {
  const sameVotes = useMemo(() => getVotesAvg(votes), [votes]);
  const numberVotes = getNumberVotes(votes);
  const avgVotes = calcVotingAvg(numberVotes);
  const translate = useTranslations('Voting');
  const areVotes = sameVotes.length > 0;
  const t = useTranslations();

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
        {sameVotes.map(({ value, count }, index) => (
         <VotedUser key={index} value={value} count={count}/>
        ))}
        {issueEstimate && (
           <VotedUser value={'AI'} count={issueEstimate.story_points}>
             <Sheet>
               <SheetTrigger asChild={true}>
                 <div  className={'flex items-center justify-center mt-2'}>
                  <Lightbulb />
                 </div>
               </SheetTrigger>
               <SheetContent className={'sm:max-w-2xl'}>
                 <SheetTitle>{t('Game.single.ai_estimate.explanation.title')}</SheetTitle>
                 {issueEstimate.explanation}
               </SheetContent>
             </Sheet>
           </VotedUser>
        )}
      </div>
    </Container>
  );
};
