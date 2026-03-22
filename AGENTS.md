# Project Rules For AI Agents

## Read This First

<!-- BEGIN:nextjs-agent-rules -->
- This project uses Next.js 16 with the App Router under `src/app`.
- Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Treat those docs as the source of truth.
- When updating packages or changing framework APIs, use `context7` to check breaking changes before editing code.
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

- This app supports multiple persistence providers via `NEXT_PUBLIC_DATABASE_PROVIDER`.
- When business logic must work across providers, go through the existing factories in `src/shared/factories/*` instead of hardcoding Prisma or Firebase directly.
- Do not silently break one provider while fixing the other. If a change is intentionally provider-specific, keep the scope explicit in code and in your explanation.
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
