import { FlatCompat } from '@eslint/eslintrc';
import stylistic from '@stylistic/eslint-plugin';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ['next'],
    ignorePatterns: ['.next'],
    settings: {
      next: {
        rootDir: './src',
      },
    },
  }),
  {
    languageOptions: {
      globals: globals.builtin,
    },
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    plugins: {
      'simple-import-sort': simpleImportSort,
      '@stylistic': stylistic,
      'unicorn': eslintPluginUnicorn,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      '@stylistic/quotes': ['error', 'single'],
      'unicorn/no-keyword-prefix': ['error', { disallowedPrefixes: ['className'] }],
      'unicorn/no-null': ['off'],
      'unicorn/no-array-reduce': ['off'],
    },
  },
];

export default eslintConfig;
