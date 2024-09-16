import { Button as ButtonUI } from '@headlessui/react';
import { cva } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

import type { ButtonProps } from '@/shared/UIKit/Button/types';
import { Spinner } from '@/shared/UIKit/Loaders/Spinner/Spinner';

export const Button = (props: ButtonProps) => {
  const {
    type,
    variant = 'primary',
    isLoading = false,
    children,
    disabled,
    ...rest
  } = props;

  return (
    <ButtonUI
      type={type === 'submit' ? 'submit' : 'button'}
      {...rest}
      className={twMerge(
        cva(
          'transition-colors inline-flex justify-center items-center gap-2 py-2 px-4 rounded text-sm font-medium min-w-24',
          {
            variants: {
              variant: {
                primary: 'bg-primary-500 text-white hover:bg-primary-600',
                secondary:
                  'bg-white dark:bg-gray-700 text-primary-500 border border-primary-500 border-solid hover:bg-primary-500 dark:hover:bg-gray-800 hover:text-white',
                text: 'text-primary-500 hover:text-primary-600',
              },
              disabled: {
                true: 'pointer-events-none opacity-50',
                false: '',
              },
            },
          },
        )({
          variant,
          disabled,
        }),
        rest.className,
      )}
      disabled={disabled || isLoading}
    >
      {children}
      {isLoading && <Spinner />}
    </ButtonUI>
  );
};
