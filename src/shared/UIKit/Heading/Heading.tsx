import { cva } from 'class-variance-authority';
import type { HTMLAttributes, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

export type HeadingProps = {
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  htmlAttributes?: HTMLAttributes<HTMLHeadingElement>;
};

export const Heading = ({
  variant,
  children,
  htmlAttributes,
}: PropsWithChildren<HeadingProps>) => {
  const Tag = variant;

  return (
    <Tag
      {...htmlAttributes}
      className={twMerge(
        cva(
          {},
          {
            variants: {
              variant: {
                h1: 'text-4xl font-bold',
                h2: 'text-3xl font-bold',
                h3: 'text-2xl font-bold',
                h4: 'text-xl font-bold',
                h5: 'text-lg font-bold',
                h6: 'text-base font-bold',
              },
            },
          },
        )({ variant }),
        htmlAttributes?.className,
      )}
    >
      {children}
    </Tag>
  );
};
