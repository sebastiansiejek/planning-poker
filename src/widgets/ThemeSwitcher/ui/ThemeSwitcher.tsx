'use client';

import { useTheme } from 'next-themes';
import { MdDarkMode, MdOutlineDarkMode } from 'react-icons/md';

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
      {resolvedTheme === 'light' ? <MdOutlineDarkMode /> : <MdDarkMode />}
    </button>
  );
};
