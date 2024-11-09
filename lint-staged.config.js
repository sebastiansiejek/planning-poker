module.exports = {
  '**/*.ts?(x)': () => [
    'pnpm run lint',
    'pnpm run format',
    'pnpm run check-types',
  ],
};
