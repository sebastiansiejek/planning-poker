import { cva } from 'class-variance-authority';

import type { ButtonProps } from '@/shared/UIKit/Button/types';
import { Spinner } from '@/shared/UIKit/Loaders/Spinner/Spinner';

export const Button = (props: ButtonProps) => {
  const {
    type,
    variant = 'primary',
    isLoading = false,
    children,
    ...rest
  } = props;

  return (
    <button
      type={type === 'submit' ? 'submit' : 'button'}
      className={cva(
        'transition-colors inline-flex justify-center items-center gap-2 py-2 px-4 rounded text-sm font-medium min-w-24',
        {
          variants: {
            variant: {
              primary: 'bg-primary-500 text-white hover:bg-primary-600',
              secondary:
                'bg-white dark:bg-gray-700 text-primary-500 border border-primary-500 border-solid hover:bg-primary-500 dark:hover:bg-gray-800 hover:text-white',
            },
          },
        },
      )({
        variant,
      })}
      {...rest}
      disabled={isLoading}
    >
      {children}
      {isLoading && <Spinner />}
    </button>
  );
};