import type { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import { FormFieldProvider } from '@/shared/UIKit/form/model/useFormField/use-form-field';

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...properties
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldProvider value={{ name: properties.name }}>
      <Controller {...properties} />
    </FormFieldProvider>
  );
};

export { FormField };
