import { cva } from 'class-variance-authority';

import type { ButtonProps } from '@/shared/UIKit/Button/types';

export const Button = (props: ButtonProps) => {
  const { type, variant = 'primary' } = props;

  return (
    <button
      type={type === 'submit' ? 'submit' : 'button'}
      className={cva(
        'transition-colors py-2 px-4 rounded text-sm font-medium min-w-24',
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
      {...props}
    />
  );
};
