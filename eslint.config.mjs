import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

const eslintConfig = defineConfig([
  ...fixupConfigRules(nextVitals),
  ...fixupConfigRules(nextTypescript),
  prettier,
  {
    settings: {
      next: {
        rootDir: './src',
      },
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      globals: globals.builtin,
    },
    plugins: {
      'simple-import-sort': fixupPluginRules(simpleImportSort),
      '@stylistic': fixupPluginRules(stylistic),
      unicorn: fixupPluginRules(eslintPluginUnicorn),
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      '@stylistic/quotes': ['error', 'single'],
      'react-hooks/incompatible-library': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'unicorn/no-keyword-prefix': [
        'error',
        { disallowedPrefixes: ['className'] },
      ],
      'unicorn/no-null': 'off',
      'unicorn/no-array-reduce': 'off',
    },
  },
]);

export default eslintConfig;
