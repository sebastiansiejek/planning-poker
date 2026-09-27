import { useTranslations } from 'next-intl';
import { useAction } from 'next-safe-action/hooks';

import { voting } from '@/widgets/room/actions/voting';
import { votingValues } from '@/widgets/room/config/voting-constants';
import { VotingCard } from '@/widgets/room/ui/voting-card/voting-card';

type VotingFormProperties = {
  roomId: string;
  isRevealedCards: boolean;
  voteValue: string;
  gameId: string;
};

export const VotingForm = ({
  roomId,
  isRevealedCards,
  voteValue,
  gameId,
}: VotingFormProperties) => {
  const translate = useTranslations('Room');
  const { execute, isPending } = useAction(voting);

  return (
    <form
      className="lg:sticky bottom-0 bg-background"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const value = votingValues.find((option) => option === formData.get('value'));
        if (!value) return;

        execute({
          roomId,
          value,
          gameId,
        });
      }}
    >
      <fieldset className="flex gap-4 flex-wrap p-4 justify-center">
        <legend className="sr-only">{translate('voteOptions')}</legend>
        {votingValues.map((option) => {
          return (
            <VotingCard
              key={option}
              isDisabled={isRevealedCards}
              isLoading={isPending}
              voteValue={voteValue}
              option={option}
            />
          );
        })}
      </fieldset>
    </form>
  );
};
