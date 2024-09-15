# Table of Contents

<details>
  <summary>Expand content</summary>

1. [Getting Started](#getting-started)
2. [Requirements](#requirements)
3. [Development](#development)
4. [Automation](#automation)
5. [Environments](#environments)
6. [Available scripts](#available-scripts)
7. [Author](#author)

</details>

# Getting Started

## Requirements

* [Node.js](https://nodejs.org/en/) (v20.9.0)
* [pnpm](https://pnpm.io/) (v>=8)

## Development

1. copy `.env.example` to `.env`
2. run `pnpm install`
3. run `docker-compose up -d`
4. run `npx prisma migrate dev`
5. run `pnpm run dev`

# Automation

* We use [Husky](https://typicode.github.io/husky) for:
    * Pre-commit hooks
        * Linting ([Eslint](https://eslint.org/))
        * Formatting ([Prettier](https://prettier.io/))
        * Type checking ([TypeScript](https://www.typescriptlang.org/))
* We use GitHub Actions for:
    * Running tests
    * Linting
    * Formatting
    * Type checking
    * Building
    * Deploying

# Environments

We use [vercel](https://vercel.com) for deployment.

## Staging

Every pull request will trigger a deployment to the development environment.

## Production

Every push to the `main` branch will trigger a deployment to the production environment.

# Available scripts

### Start dev server

`pnpm run dev`

### Production build

`pnpm run build`

### Start production server

`pnpm run start`

### Lint

`pnpm run lint`

### Format code

`pnpm run format`

### Check types

`pnpm run check-types`

### Run tests (unit and e2e)

`pnpm run test`

### Run unit tests

`pnpm run test:unit`

### Run e2e tests

`pnpm run test:e2e`

### Run e2e tests in watch mode

`pnpm run test:e2e:watch`

### Generate Playwright tests

`pnpm run playwright:codegen`

# Author

* [Sebastian Siejek](https://sebastiansiejek.dev/)
