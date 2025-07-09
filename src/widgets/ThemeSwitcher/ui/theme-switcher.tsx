'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

const ICON_SIZE = 14;

export const ThemeSwitcher = () => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      className="cursor-pointer hover:text-primary-500"
      type="button"
      onClick={() => {
        setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
      }}
    >
      {resolvedTheme === 'light' ? (
        <Moon size={ICON_SIZE} />
      ) : (
        <Sun size={ICON_SIZE} />
      )}
    </button>
  );
};
