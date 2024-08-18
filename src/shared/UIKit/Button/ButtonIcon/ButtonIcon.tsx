import type { ButtonIconProps } from '@/shared/UIKit/Button/ButtonIcon/ButtonIcon.types';

export const ButtonIcon = ({ icon, type = 'button' }: ButtonIconProps) => {
  return (
    <button
      type={type === 'submit' ? 'submit' : 'button'}
      className="w-6 h-6 rounded-full bg-gray-600 dark:bg-gray-700 flex items-center justify-center hover:bg-primary-500 [&>svg]:fill-white"
    >
      {icon}
    </button>
  );
};
