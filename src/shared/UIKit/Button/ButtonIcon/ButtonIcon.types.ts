import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonIconProps = {
  icon: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;
