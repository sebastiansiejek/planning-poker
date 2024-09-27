import { Textarea as TextareaUI } from '@headlessui/react';
import type { TextareaHTMLAttributes } from 'react';

export const Textarea = (
  props: TextareaHTMLAttributes<HTMLTextAreaElement>,
) => {
  return (
    <TextareaUI
      className="border border-solid border-primary-500 p-2 w-full"
      style={{ resize: 'none' }}
      {...props}
    />
  );
};
