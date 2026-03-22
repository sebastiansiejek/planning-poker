module.exports = {
    '**/*.ts?(x)': () => [
        'pnpm run check-types',
        'pnpm run format',
    ],
    '**/*.{json,yaml,yml}': [
        'prettier --write --ignore-path .gitignore',
    ],
};
