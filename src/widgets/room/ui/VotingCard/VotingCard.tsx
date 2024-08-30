import { cva } from 'class-variance-authority';

import type { VotingCardProps } from '@/widgets/room/ui/VotingCard/types';

export const VotingCard = ({
  isDisabled,
  option,
  voteValue,
  setVoteValue,
}: VotingCardProps) => {
  return (
    <label
      className={cva('', {
        variants: {
          isDisabled: {
            true: 'cursor-not-allowed pointer-events-none',
          },
        },
      })({ isDisabled })}
    >
      <input
        name="value"
        type="radio"
        className="invisible absolute peer"
        value={option}
        checked={voteValue === option}
        onChange={(e) => {
          e.currentTarget.form?.requestSubmit();
          setVoteValue(e.currentTarget.value);
        }}
      />
      <div
        data-testid={`voting-card-${option}`}
        className={cva(
          'transition font-bold flex items-center justify-center text-center p-4 text-xl rounded w-20 h-32 border-2 border-solid border-primary-500 cursor-pointer text-primary-500 hover:text-white hover:bg-primary-500 peer-checked:bg-primary-500 peer-checked:text-white',
          {
            variants: {
              isDisabled: {
                true: 'bg-gray-200 dark:bg-gray-900 text-gray-500',
              },
            },
          },
        )({
          isDisabled,
        })}
      >
        {option}
      </div>
    </label>
  );
};
