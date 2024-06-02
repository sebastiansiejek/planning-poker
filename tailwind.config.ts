import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    colors: {
      white: '#fff',
      primary: {
        100: '#E6FFFA',
        200: '#B2F5EA',
        300: '#81E6D9',
        400: '#4FD1C5',
        500: '#3CEAB8',
        600: '#1EAE7E',
        700: '#0F766E',
        800: '#035666',
        900: '#003E52',
      },
      gray: {
        100: '#F7FAFC',
        200: '#EDF2F7',
        300: '#E2E8F0',
        400: '#CBD5E0',
        500: '#A0AEC0',
        600: '#718096',
        700: '#44403c',
        800: '#292524',
        900: '#1c1917',
      },
    },
  },
  plugins: [],
};
export default config;
