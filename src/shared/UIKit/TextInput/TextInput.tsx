import { Input } from '@headlessui/react';

import { FormField } from '@/shared/UIKit/Form/FormField/FormField';
import type { TextInputProps } from '@/shared/UIKit/TextInput/TextInput.types';
import { renderClass } from '@/shared/utils/renderClass/renderClass';

export const TextInput = (props: TextInputProps) => {
  const { name } = props;
  const { innerRef, errors, className, label, ...rest } = props;

  return (
    <FormField name={name} label={label}>
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
    </FormField>
  );
};
