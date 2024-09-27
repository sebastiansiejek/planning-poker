import { Field } from '@headlessui/react';
import type { PropsWithChildren } from 'react';

export const FormField = ({ children }: PropsWithChildren) => {
  return <Field className="flex flex-col w-full">{children}</Field>;
};
