import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;
