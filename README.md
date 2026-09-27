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
2. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `SUPABASE_JWT_SECRET` in `.env.local` for local development (or the deployment environment).
3. `SUPABASE_JWT_SECRET` must be the server-only legacy HS256 signing secret from the same Supabase project. Never use a `NEXT_PUBLIC_` name for this secret. The project must still accept that signing key.
4. Run `pnpm prisma:migrate` before using private room updates. These migrations authorize Realtime reads for active room participants and deny browser access to application tables; Prisma retains server access.

Room updates and notifications use private channels. The server issues 60-second
room-scoped tokens and the browser renews them every 30 seconds. Removed users
cannot renew or start new subscriptions. A previously connected client that
ignores removal may receive events until its token expires (up to approximately
one minute). A removed user can enter the room ID on the join page to join
again, subject to the room capacity. Opening the room URL does not rejoin them.

For hosted Supabase, disable **Allow public access** in Realtime settings before
release. Application broadcasts already use `private: true`, which keeps them
separate from public subscriptions even while public channels remain enabled in
the local development stack. No hosted configuration is changed by these migrations.

An account can own two rooms. Each room can have 12 active participants. The
owner can delete a room from the dashboard to free a slot. Deletion also removes
that room's rounds, votes, participants, and invitations.

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
