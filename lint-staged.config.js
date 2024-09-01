module.exports = {
  '**/*.ts?(x)': () => ['pnpm run lint', 'pnpm run check-types'],
};
