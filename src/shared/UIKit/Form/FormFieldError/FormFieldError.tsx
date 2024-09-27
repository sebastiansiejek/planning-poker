import { ErrorMessage } from '@hookform/error-message';
import type { FieldErrors } from 'react-hook-form';

export const FormFieldError = ({
  errors,
  name,
}: {
  errors: FieldErrors;
  name: string;
}) => {
  return (
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
  );
};
