import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import { FormFieldProvider } from '@/shared/UIKit/Form/model/useFormField/useFormField';

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldProvider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldProvider>
  );
};

export { FormField };
