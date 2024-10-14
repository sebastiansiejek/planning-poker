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
          {
            'scroll-m-20 tracking-tight': true,
          },
          {
            variants: {
              variant: {
                h1: 'text-4xl font-extrabold lg:text-5xl',
                h2: 'text-3xl border-b pb-2 font-semibold first:mt-0',
                h3: 'text-2xl font-semibold',
                h4: 'text-xl font-semibold',
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
