import { cva } from 'class-variance-authority';
import Skeleton from 'react-loading-skeleton';

import type { MemberCardProps } from '@/widgets/Member/MemberCard/types';

export const MemberCard = (props: MemberCardProps) => {
  const {
    isVoted = false,
    isRevealedCards = false,
    htmlAttributes,
    vote,
    isLoading,
  } = props;

  return (
    <div
      {...htmlAttributes}
      className={cva(
        'h-20 w-16 flex justify-center items-center rounded border-2 dark:border-gray-800 border-solid text-primary-500 font-bold text-xl',
        {
          variants: {
            isVoted: {
              false: '',
            },
            isRevealedCards: {
              true: '',
            },
          },
          compoundVariants: [
            {
              isVoted: true,
              isRevealedCards: true,
              className: 'border-primary-500',
            },
            {
              isVoted: false,
              isRevealedCards: false,
              className: 'bg-gray-200 dark:bg-gray-800',
            },
            {
              isVoted: true,
              isRevealedCards: false,
              className: 'bg-primary-500',
            },
          ],
        },
      )({ isVoted, isRevealedCards })}
    >
      {isLoading ? (
        <Skeleton
          height="100%"
          width="100%"
          containerClassName="flex h-full w-full"
        />
      ) : (
        isRevealedCards && vote
      )}
    </div>
  );
};
