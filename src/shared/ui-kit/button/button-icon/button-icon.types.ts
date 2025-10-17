import type { ButtonHTMLAttributes, ReactNode } from 'react';

import type { ButtonProperties } from '@/shared/ui-kit/button/types';

export type ButtonIconProperties = {
  icon: ReactNode;
  isLoading?: boolean;
} & Pick<ButtonProperties, 'size'> &
  ButtonHTMLAttributes<HTMLButtonElement>;
