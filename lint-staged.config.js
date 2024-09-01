module.exports = {
  '*': ['eslint --fix'],
  '**/*.ts?(x)': () => 'npm run check-types',
};
