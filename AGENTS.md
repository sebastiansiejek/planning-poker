# Project Rules For AI Agents

## Read This First

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Tooling And Environment

- Use `pnpm` only. Do not use `npm`, `yarn`, or `bun`.
- Assume Node `24.14.0` and pnpm `10.30.3`, matching `package.json`.
- Prefer existing scripts over ad-hoc commands:
  - `pnpm lint`
  - `pnpm check-types`
  - `pnpm test:unit`
  - `pnpm test:e2e`
- Keep changes compatible with the existing Husky and commitlint setup.

## Project Architecture

- Keep code inside the current `src/` structure. Do not introduce a parallel top-level `app/`, `components/`, or `lib/` tree.
- Use the `@/` import alias for internal imports instead of long relative paths.
- Reuse the existing domain structure:
  - `src/app` for routes, layouts, loading/error files, and route handlers
  - `src/widgets` and `src/features` for UI and feature modules
  - `src/shared` for cross-cutting code, factories, services, hooks, utilities, and UI kit
- Prefer extending existing modules over creating near-duplicate abstractions.

## Next.js Rules

- Default to Server Components. Add `'use client'` only when a file truly needs browser APIs, React client hooks, or event handlers.
- Keep client boundaries as small as possible. Do not turn layouts or large trees into Client Components unless necessary.
- In App Router pages, layouts, metadata functions, and route handlers, follow Next.js 16 conventions exactly.
- Route params are promise-based in this codebase. Await `params` rather than treating them as a plain object.
- Put API endpoints in `src/app/api/**/route.ts`. Do not add `pages/api`.
- For mutations initiated from UI, prefer the existing server action pattern with `next-safe-action` and `zod` when it fits the feature.
- Use route-aware helpers and shared route builders where possible instead of hardcoded internal paths.

## Data, Auth, And Providers

- Supabase PostgreSQL is the only persistence backend and Prisma is the only data adapter.
- Keep business logic behind the existing ports in `src/shared/factories/*` instead of coupling feature code directly to Prisma.
- Prisma Migrate is the single source of truth for database schema changes, including raw SQL required for PostgreSQL policies.
- Reuse the existing auth helpers in `src/shared/auth/*`. Do not introduce a parallel auth flow.
- Be careful with environment-dependent code. Preserve `.env.example` accuracy when adding or renaming required variables.

## Validation, Routing, And UI

- Validate external input with `zod` instead of hand-rolled checks when touching forms, server actions, or route handlers.
- Reuse `src/shared/routes/routes.ts` for internal navigation and redirects instead of scattering literal route strings.
- Use `next-intl` for user-facing copy. Do not hardcode new UI strings if the surrounding feature is already translated.
- Prefer the existing shared UI kit components in `src/shared/ui-kit/*` before adding new primitive wrappers.

## Testing And Verification

- For meaningful code changes, run the smallest relevant checks before finishing:
  - `pnpm lint`
  - `pnpm check-types`
  - targeted `pnpm test:unit`
  - targeted `pnpm test:e2e` when route or interaction behavior changes
- Do not claim a fix without verifying it somehow. If you could not run a check, say so explicitly.
- Keep Playwright changes compatible with the existing config in `playwright.config.ts`, including the local dev server flow.

## Editing Guardrails

- Preserve the existing style of the touched file and let ESLint/Prettier do the cleanup.
- Avoid broad rewrites unless they are required for correctness.
- Do not replace shared abstractions with one-off inline logic just to make a local change pass.
- If the worktree is already dirty, inspect surrounding changes carefully and avoid overwriting user work.

## Commit Rules

- Use Conventional Commits for every commit message.
- Format commit subjects as `type(scope): summary` when a scope is useful, or `type: summary` when it is not.
- Use lowercase commit types such as `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `build`, and `ci`.
- Keep the summary concise and imperative, for example `feat(auth): add login rate limiting`.
- Mark breaking changes with `!` in the subject or describe them in the commit body.

## Language

Use ASD-STE100 Simplified Technical English (STE) for all responses and generated documentation.
