import type { ButtonHTMLAttributes, ReactNode } from 'react';

import type { ButtonProps } from '@/shared/UIKit/Button/types';

export type ButtonIconProps = {
  icon: ReactNode;
  isLoading?: boolean;
} & Pick<ButtonProps, 'size'> &
  ButtonHTMLAttributes<HTMLButtonElement>;
