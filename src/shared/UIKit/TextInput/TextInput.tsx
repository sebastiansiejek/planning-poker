import type { DetailedHTMLProps, InputHTMLAttributes } from 'react';

export const TextInput = (
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
) => {
  return (
    <input className="border border-solid border-primary-500 p-2" {...props} />
  );
};
