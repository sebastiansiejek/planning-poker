import type { DetailedHTMLProps, InputHTMLAttributes, Ref } from 'react';
import type { FieldErrors } from 'react-hook-form';

export type TextInputProps = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'ref'
> & {
  innerRef?: Ref<HTMLInputElement>;
  errors?: FieldErrors;
  name: string;
  label?: string;
};
