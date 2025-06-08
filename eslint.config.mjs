import { FlatCompat } from '@eslint/eslintrc';
import stylistic from '@stylistic/eslint-plugin';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  eslintPluginUnicorn.configs.all,
  ...compat.config({
    extends: ['next'],
    settings: {
      next: {
        rootDir: 'src',
      },
    },
  }),
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      '@stylistic': stylistic,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      '@stylistic/quotes': ['error', 'single'],
      'unicorn/no-keyword-prefix': ['error', { disallowedPrefixes: ['className'] }],
    },
  },
];

export default eslintConfig;
