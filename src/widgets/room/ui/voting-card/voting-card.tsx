import { cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

import { useRoomContext } from '@/widgets/room/model/room-context';
import type { VotingCardProperties } from '@/widgets/room/ui/voting-card/types';

export const VotingCard = ({
  isDisabled,
  isLoading,
  option,
  voteValue,
}: VotingCardProperties) => {
  const { dispatch } = useRoomContext();
  const isSelected = voteValue === option;
  const isInteractionDisabled = isDisabled || isLoading;
  const isSelectedLoading = isLoading && isSelected;

  return (
    <label
      className={cva('', {
        variants: {
          isInteractionDisabled: {
            true: 'pointer-events-none',
          },
          isDisabled: {
            true: 'cursor-not-allowed',
          },
          isLoading: {
            true: 'cursor-wait',
          },
        },
      })({ isInteractionDisabled, isDisabled, isLoading })}
    >
      <input
        name="value"
        type="radio"
        className="sr-only peer"
        value={option}
        checked={isSelected}
        disabled={isInteractionDisabled}
        onChange={(event) => {
          event.currentTarget.form?.requestSubmit();
          dispatch({
            type: 'SET_VOTE',
            payload: {
              value: event.currentTarget.value,
            },
          });
        }}
      />
      <div
        data-testid={`voting-card-${option}`}
        aria-busy={isSelectedLoading}
        className={cva(
          'transition font-bold flex items-center justify-center text-center p-4 text-xl rounded w-16 h-24 border-2 border-solid border-primary-500 cursor-pointer text-primary-500 hover:text-white hover:bg-primary-500 peer-checked:bg-primary-500 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2',
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
        <span className={isSelectedLoading ? 'sr-only' : undefined}>{option}</span>
        {isSelectedLoading && (
          <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
        )}
      </div>
    </label>
  );
};
