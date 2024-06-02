import type { ButtonProps } from '@/shared/UIKit/Button/types';

export const Button = (props: ButtonProps) => {
  const { type } = props;
  return (
    <button
      type={type === 'submit' ? 'submit' : 'button'}
      className="transition-colors bg-primary-500 text-white py-2 px-4 rounded text-sm font-medium hover:bg-primary-600"
      {...props}
    />
  );
};
