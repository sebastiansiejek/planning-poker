import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'text';
  isLoading?: boolean;
  color?: 'primary' | 'danger';
} & ButtonHTMLAttributes<HTMLButtonElement>;
