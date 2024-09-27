import { Input } from '@headlessui/react';
import { ErrorMessage } from '@hookform/error-message';

import { FormField } from '@/shared/UIKit/Form/FormField/FormField';
import { FormFieldLabel } from '@/shared/UIKit/Form/FormFieldLabel/FormFieldLabel';
import type { TextInputProps } from '@/shared/UIKit/TextInput/TextInput.types';
import { renderClass } from '@/shared/utils/renderClass/renderClass';

export const TextInput = (props: TextInputProps) => {
  const { name } = props;
  const { innerRef, errors, className, label, ...rest } = props;

  return (
    <FormField>
      {label && <FormFieldLabel>{label}</FormFieldLabel>}
      <Input
        className={renderClass(
          'border border-solid border-primary-500 p-2 w-full',
          {
            'border-red-500': errors?.[name],
            [className || '']: className,
          },
        )}
        ref={innerRef}
        {...rest}
      />
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => {
          return (
            <div className="text-red-500 mt-2">
              <small>{message}</small>
            </div>
          );
        }}
      />
    </FormField>
  );
};
