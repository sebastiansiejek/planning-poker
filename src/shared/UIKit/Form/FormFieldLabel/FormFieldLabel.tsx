import { Label } from '@headlessui/react';
import type { PropsWithChildren } from 'react';

export const FormFieldLabel = ({ children }: PropsWithChildren) => {
  return (
    <Label className="cursor-pointer font-medium text-sm mb-2">
      {children}
    </Label>
  );
};
