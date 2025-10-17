module.exports = {
    '**/*.ts?(x)': () => [
        'pnpm run check-types',
        'pnpm run format',
    ],
};
