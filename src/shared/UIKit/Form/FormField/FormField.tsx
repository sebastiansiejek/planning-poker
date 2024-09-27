import { Field } from '@headlessui/react';
import type { PropsWithChildren, ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

import { FormFieldError } from '@/shared/UIKit/Form/FormFieldError/FormFieldError';
import { FormFieldLabel } from '@/shared/UIKit/Form/FormFieldLabel/FormFieldLabel';

export const FormField = ({
  children,
  label,
  name,
}: PropsWithChildren<{
  label?: ReactNode;
  name: string;
}>) => {
  const {
    formState: { errors },
  } = useFormContext();

  return (
    <Field className="flex flex-col w-full">
      {label && <FormFieldLabel>{label}</FormFieldLabel>}
      {children}
      {errors && <FormFieldError errors={errors} name={name} />}
    </Field>
  );
};
