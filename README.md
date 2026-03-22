# Table of Contents

<details>
  <summary>Expand content</summary>

1. [Getting Started](#getting-started)
2. [Requirements](#requirements)
3. [Development](#development)
4. [Automation](#automation)
5. [Environments](#environments)
6. [Author](#author)

</details>

# Getting Started

## Requirements

* [Node.js](https://nodejs.org/en/) (v20.9.0)
* [pnpm](https://pnpm.io/) (v>=8)

## Development

1. Copy `.env.example` to `.env`
2. Fill variables in `.env` file
3. Run `pnpm install`

### Databases

You can choose between Firebase and Prisma ORM.

#### Firebase

1. Create Firestore Database
2. Add variables `FIREBASE_DATABASE_URL`, `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` in `.env` file

#### Prisma

1. Add `DATABASE_URL` variable in `.env` (default is configured)
2. Run `docker-compose up -d`
3. Run `pnpm run prisma:generate`
4. Run `pnpm run prisma:migrate`

> For realtime room updates you need to have configured **Supabase Realtime**

1. Create a Supabase project
2. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in `.env`

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

# Author

* [Sebastian Siejek](https://sebastiansiejek.dev/)
