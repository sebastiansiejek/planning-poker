import { useAction } from 'next-safe-action/hooks';

import { voting } from '@/widgets/Room/actions/voting';
import { votingValues } from '@/widgets/Room/config/votingConstants';
import { VotingCard } from '@/widgets/Room/ui/VotingCard/VotingCard';

type VotingFormProps = {
  meId: string;
  roomId: string;
  isRevealedCards: boolean;
  voteValue: string;
  setVoteValue: (value: string) => void;
};

export const VotingForm = ({
  meId,
  roomId,
  isRevealedCards,
  voteValue,
  setVoteValue,
}: VotingFormProps) => {
  const { execute } = useAction(voting);

  return (
    <form
      onSubmit={(e) => {
        const formData = new FormData(e.target as HTMLFormElement);

        execute({
          roomId,
          userId: meId,
          value: formData.get('value') as string,
        });
      }}
    >
      <div className="flex gap-4 mt-8 flex-wrap p-6 justify-center">
        {votingValues.map((option) => {
          return (
            <VotingCard
              key={option}
              isDisabled={isRevealedCards}
              voteValue={voteValue}
              option={option}
              setVoteValue={setVoteValue}
            />
          );
        })}
      </div>
    </form>
  );
};
