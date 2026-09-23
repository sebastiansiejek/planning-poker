# Planning Poker production migration journal

This document records the migration of Planning Poker from the legacy
production release to a production-ready Supabase-based architecture. It is a
technical log and source material for a future blog post. Keep decisions,
measurements, failed approaches, and verification results here. Never record
credentials or production data.

## Starting point

- Public application: <https://planning-poker.sebastiansiejek.dev/>
- Legacy production: an ephemeral Pusher-based release from September 2024.
- Migration branch: `feat/supabase`, substantially ahead of `main`.
- Target hosting: Vercel Hobby plus Supabase Free.
- Target runtime: Node.js 24.14.0 and pnpm 10.30.3.

The branch already used Supabase Realtime and could use Supabase-hosted
PostgreSQL through Prisma, but it was not a native Supabase persistence or auth
provider. Authentication still used NextAuth v4 and Google, while the data
layer retained a runtime switch between Prisma and Firebase.

## Product and architecture decisions

- Supabase hosts PostgreSQL and private Realtime.
- Prisma remains the only production data adapter and the only migration
  system. Raw PostgreSQL policies live inside Prisma migrations.
- Auth stays on stable NextAuth v4 for this release.
- Login methods will be Google, GitHub, and a Resend-backed magic link.
- Creating a room requires an account; joining and voting do not.
- A room-scoped `Participant` represents both guests and signed-in users.
- A guest can link the current participant to an account without losing votes.
- Rooms support at most 12 active participants.
- Round control is cooperative; administrative room operations belong to the
  owner.
- The application is bilingual under `/pl` and `/en`.
- Production is promoted manually from a verified staging artifact.

## Audit findings worth writing about

### Routing

`/pl` returned 404 because the application had no locale route segment. The
next-intl request configuration selected a static English locale but did not
implement locale-aware routing. `/` worked correctly; the browser opening
`/pl` came from outside the application's route definitions.

### Architecture drift

The codebase presented Firebase and Prisma as interchangeable persistence
providers, while Supabase was only the Realtime transport (and potentially the
PostgreSQL host). CI claimed to test both providers, but its auth helpers and
database setup were Prisma-specific. This made the provider abstraction look
like an unfinished migration rather than an intentional portfolio feature.

Decision: preserve domain ports and factories, but remove the unused Firebase
adapter and runtime provider switch.

### Security gaps

Several room mutations trusted client-supplied room, game, or user IDs without
checking membership or ownership. Vote values could be fetched before reveal,
Realtime topics were public, and concurrent requests could create multiple
active rounds.

The target design makes Server Actions the authorization boundary, uses a
rotatable invite credential, issues short-lived room-scoped Realtime JWTs, and
enforces private Broadcast/Presence through RLS.

### Toolchain and supply chain

The repository declared multiple pnpm versions (8, 9, 10.30.3, and 10.33.2)
and documented an obsolete Node.js version. The initial production dependency
audit reported 104 advisories: 6 critical, 59 high, 34 moderate, and 5 low.
Important contributors included an affected Next.js release, NextAuth 4.24.14,
the unused Firebase stack, and unused js-cookie.

The security gate for the new release is zero known critical or high
vulnerabilities in production dependencies. Any remaining medium advisory must
have a documented, verified exception.

### Delivery pipeline

The old production workflow could deploy a different `main` commit than the
one tested by CI. It rebuilt production separately from preview, did not run
production migrations, and deployed automatically. The replacement will pin
the tested SHA, migrate staging explicitly, promote a verified artifact
manually, and retain the legacy Vercel deployment for immediate rollback.

## Planned stages

1. Establish a secure dependency and toolchain baseline.
2. Remove Firebase/Pusher remnants and keep one local Supabase stack.
3. Introduce the Participant, invite, round, and vote model.
4. Authorize and make all room mutations atomic.
5. Add locale routing and complete Polish/English translations.
6. Implement guest identity, merge-on-login, and Presence.
7. Add GitHub, magic-link auth, and explicit account linking.
8. Secure Realtime and add shared rate limiting.
9. Add monitoring, analytics, privacy documentation, and accessibility checks.
10. Rebuild CI/CD, validate staging, and promote to production.

## Work log

### 2026-09-23 — Stage 1: security baseline (complete)

Changes made:

- pin Node.js 24.14.0 and pnpm 10.30.3 across local metadata and CI;
- update Next.js within major 16 and NextAuth within stable major 4;
- remove Firebase and js-cookie from the production dependency graph;
- retain the repository/factory boundaries with Prisma as the only adapter;
- move build and lint tooling from runtime dependencies to dev dependencies;
- regenerate the lockfile and rerun lint, types, unit tests, build, and audit.

The provider switch and Firebase implementation were removed, but the service
interfaces and factories remain. This leaves a useful seam around the domain
without pretending that two persistence implementations are supported. The
Supabase JavaScript client was made a direct dependency because the SSR helper
expects the application to supply it.

Sentry was upgraded from v10 to v11. Its Next.js configuration import moved to
`@sentry/nextjs/config`, the obsolete `enableLogs` option was removed, and the
misspelled `NEXT_PUBLIC_SENTRY_DNS` variable became
`NEXT_PUBLIC_SENTRY_DSN`. Production tracing now samples 10 percent of requests
and Session Replay is disabled. User information and HTTP request bodies are
also explicitly excluded from collection.

The first dependency audit contained 104 findings: 6 critical, 59 high, 34
moderate, and 5 low. Updating Next.js, NextAuth, Sentry, and Supabase, removing
the unused Firebase and js-cookie trees, and pinning patched transitive versions
reduced the final production audit to zero findings at every severity. The one
cross-major override, `deepmerge-ts` 7 to 8, addresses its recursion advisory;
Prisma only uses its plain merge function for trusted local configuration, and
the full verification suite passed after the override.

Verification:

- `pnpm lint`: passed;
- `pnpm check-types`: passed;
- `pnpm test:unit --runInBand`: 4 suites and 5 tests passed;
- `pnpm test:e2e`: 2 WebKit scenarios passed (authenticated dashboard and
  complete voting flow);
- `pnpm build`: passed with Next.js 16.3.3;
- `pnpm audit --prod`: 0 vulnerabilities.

The host shell currently exposes Node.js 26.8.2, so pnpm prints an engine
warning before it applies the repository's managed runtime. `pnpm exec node
--version` resolves to the pinned Node.js 24.14.0. A remaining install-time peer
warning comes from `react-popper@2.3.0`, which only declares support through
React 18. It is still used by the member tooltip and should be replaced with the
existing Radix tooltip primitive in a focused UI change rather than removed
without interaction testing.

The end-to-end run also exposed non-blocking follow-up signals: Next.js warns
that the Edge Runtime is deprecated, Radix reports a dialog without a
description, and the development server exceeds the default listener count
during concurrent browser tests. These did not fail the scenarios, but they
should be resolved before treating the pipeline as release-ready.

## Blog angles and lessons

- An abstraction is valuable only when every implementation is intentionally
  supported and tested; otherwise it hides migration debt.
- Realtime delivery is not an authorization boundary.
- A guest is better represented as a domain participant than as a fake auth
  user.
- Preview deployment and production promotion should refer to the same tested
  artifact, not merely the same branch name.
- Free tiers reduce infrastructure cost but require explicit decisions about
  backups, sleep behavior, quotas, and observability.
- Security work is often dependency-tree work: four direct upgrades and a few
  targeted transitive pins removed over one hundred scanner findings without a
  framework rewrite.
- Runtime managers can make commands reproducible while still leaving a
  confusing warning from the parent shell; recording both versions avoids a
  misleading “works on my machine” story.
