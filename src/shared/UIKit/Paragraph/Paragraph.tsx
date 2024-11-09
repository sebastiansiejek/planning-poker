import type { HTMLAttributes, PropsWithChildren } from 'react';

export const Paragraph = ({
  children,
  htmlAttributes,
}: PropsWithChildren & {
  htmlAttributes?: HTMLAttributes<HTMLParagraphElement>;
}) => {
  return (
    <p className="leading-7 [&:not(:first-child)]:mt-6" {...htmlAttributes}>
      {children}
    </p>
  );
};
