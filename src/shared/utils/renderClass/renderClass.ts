import type { ClassValue } from 'clsx';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const renderClass = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
