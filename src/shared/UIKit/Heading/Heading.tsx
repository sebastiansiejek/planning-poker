import { cva } from 'class-variance-authority';
import type { HTMLAttributes, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

export type HeadingProps = {
  variant: 'h1' | 'h2' | 'h3' | 'h4';
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
                h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
                h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
                h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
                h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
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
