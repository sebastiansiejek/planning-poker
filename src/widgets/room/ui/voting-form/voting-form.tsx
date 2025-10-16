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
  const { execute } = useAction(voting);

  return (
    <form
      className="lg:sticky bottom-0 bg-background"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);

        execute({
          roomId,
          value: formData.get('value') as string,
          gameId,
        });
      }}
    >
      <div className="flex gap-4 flex-wrap p-4 justify-center">
        {votingValues.map((option) => {
          return (
            <VotingCard
              key={option}
              isDisabled={isRevealedCards}
              voteValue={voteValue}
              option={option}
            />
          );
        })}
      </div>
    </form>
  );
};
