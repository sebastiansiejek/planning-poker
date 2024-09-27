import { Input } from '@headlessui/react';

import type { TextInputProps } from '@/shared/UIKit/TextInput/TextInput.types';
import { renderClass } from '@/shared/utils/renderClass/renderClass';

export const TextInput = (props: TextInputProps) => {
  const { name } = props;
  const { innerRef, errors, className, ...rest } = props;

  return (
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
  );
};
