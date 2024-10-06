import type { HTMLAttributes, PropsWithChildren } from 'react';

export const Paragraph = ({
  children,
  htmlAttributes,
}: PropsWithChildren & {
  htmlAttributes?: HTMLAttributes<HTMLParagraphElement>;
}) => {
  return <p {...htmlAttributes}>{children}</p>;
};
