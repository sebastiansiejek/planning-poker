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
- Google remains the only account sign-in method for the current scope. GitHub
  and email magic links are deferred.
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
6. Implement guest identity, merge-on-login, and Presence (deferred to the final feature stage).
7. Additional account sign-in methods and provider linking (deferred; Google is sufficient for now).
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

### 2026-09-24 — Stage 3: participant data foundation and signed-in room flow

The new room identity is `Participant`, scoped to one room and optionally linked
to a `User`. It stores a display snapshot, an optional hashed guest credential,
and a `leftAt` marker so leaving does not destroy vote history. `Vote` now points
to a participant and a game (the current round). `RoomInvitation` stores only a
SHA-256 hash of a random 256-bit token; rotation revokes earlier invitations and
the service enforces an expiry. The raw token exists only in the rotate response.

The migration backfills participants from `room_users`, room authors, the older
implicit membership table, and users with historical votes. It then copies
legacy votes to participant votes and aborts if the vote counts differ. The
legacy tables were initially retained for the expansion phase. An initial migration draft
would have dropped those tables and changed older game statuses. Automatic
approval review rejected applying that draft, so it was replaced with an
additive migration before local execution. This is a useful example of why
migration safety must be checked against data effects, not just schema validity.

The signed-in room path, vote action, revealed-vote query, member display, and
dashboard count now use participant identity. Room creation creates the owner's
participant in the same transaction. Joining locks the room row before counting
active participants, enforcing the limit of 12 under concurrent requests.
Creating a round also locks the room row before checking for another active
round. Leaving marks the participant inactive while retaining votes. Anonymous
room access currently redirects to login until the guest join flow can issue
and verify guest credentials.

Verification:

- Prisma Migrate applied all migrations to a verified empty local Supabase
  database; no production database was used.
- A transaction-scoped fixture replayed the exact migration SQL and confirmed
  that owner, explicit member, implicit member, vote-only user, and vote were
  preserved; the fixture transaction rolled back.
- An integration scenario confirmed the 12-person limit with concurrent final
  joins, invitation rotation, and vote retention after leaving.
- `pnpm lint`, `pnpm check-types`, `pnpm test:unit --runInBand`, and `pnpm build`
  passed. The two existing browser scenarios and two new database integration
  scenarios passed against local Supabase.

Remaining before release: invitation issuance and consumption in the UI, guest
join/vote identity, linking a guest participant on login, authorization of all
remaining room actions, private Realtime, locale routes, and the delivery gates.
The current room lookup still uses a room ID and is not an invitation
authorization boundary.

### 2026-09-24 — Local development database mismatch

The participant implementation passed tests against local Supabase, but the
existing developer server still read a hosted database from `.env`. Opening
the join page and creating a room therefore failed with Prisma `P2021` because
that database had no `participants` table. The earlier claim that creation and
joining worked in the user's current server was incorrect; the tests had used
explicit local environment overrides.

This checkout now uses ignored `.env.local` overrides for local PostgreSQL and
Supabase endpoints. The `pnpm prisma:migrate` and `pnpm prisma:status`
commands load that same local override when present, so the CLI and Next.js
target the same development database. A Next config timestamp update made the
already-running dev server reload its environment without ending the user's
session. `pnpm prisma:status` reported all 10 migrations applied to
`127.0.0.1:54322`. Authenticated access and a new browser scenario covering
room creation, the join page, and joining by ID passed against the existing
port 3000 server. The hosted database was neither migrated nor changed.

### 2026-09-24 — Remove unused legacy membership tables

The user clarified that the earlier Prisma-based application never worked in
production and there are no existing production users to migrate. The
`_RoomParticipants` table was Prisma's implicit many-to-many relation between
`Room` and `User`: `A` referenced `Room.id` and `B` referenced `User.id`. It was
separate from the later explicit `room_users` table, which made the schema
unnecessarily confusing.

Read-only checks found zero rows in local `_RoomParticipants`, `room_users`,
and `user_votes`. A second Prisma migration now removes all three tables and
their unused schema relations. It raises an exception before dropping anything
if any of those tables contains rows in another environment. The first
backfill migration remains in history; this correction makes the final schema
use only `Participant` and `Vote` for room membership and voting. The cleanup
migration was applied only to local Supabase. A fixture test also confirmed the
guard rejects a database with legacy rows.

### 2026-09-24 — Stage 4: signed-in room action authorization

The room Server Actions now verify the current session and an active participant
before creating or revealing a round, voting, reading revealed votes, sending an
alarm, or throwing paper. Alarm and paper targets must be active participants in
the same room. Paper events derive the sender's participant ID on the server
instead of trusting the client. Vote input is restricted to the displayed card
values, and room names and action IDs are validated at the server boundary.

Round creation, reveal, voting, and removal serialize on the room row. Round
creation and reveal check active membership inside the transaction, so removal
cannot race past the action's earlier membership check. A round can be revealed
only once while its status is `STARTED`. Starting a new round now sends one
`GAME_CREATED` event that also clears the previous vote display; the separate
unauthorized reset action and its extra broadcast were removed.

Only the room owner can remove another participant, and the UI shows that
control only to the owner. A removed signed-in participant cannot rejoin by
refreshing or submitting the room ID again. This uses the existing `leftAt`
marker; there is no self-leave control in this signed-in flow.

Verification: lint, types, 5 unit tests, production build, and all 6 local
Playwright scenarios passed. The new browser scenario replays a captured
round-creation Server Action with a different signed-in user's session after
the first round ends; it receives `unauthorized` and creates no game. The
participant integration scenario checks that removal blocks rejoin and round
creation while preserving old votes. All database checks used local Supabase.

Remaining before the release: joining still treats possession of a room ID as
the credential, and Realtime topics are still public. Invitation consumption,
private Realtime, locale routes, guest join/vote and login linking, and the
other delivery gates remain. Guest join/vote and login linking are deferred to
the final feature stage before release, as requested.

### 2026-09-24 — Follow-up: account name changes on the room board

A two-account manual check found that editing a signed-in user's name in
settings left their name unchanged on the room board. The settings endpoint
updated `User.name`, but the board reads the room-scoped `Participant.name`
snapshot. The client also memoized member positions by member count, so a
same-size name update would have remained visually stale.

The settings update now changes active linked participants in the same database
transaction as the user, then broadcasts a member-update event to each affected
room. Open boards apply the event and recalculate member positions when member
data changes. The endpoint validates the trimmed name before saving. Realtime
delivery is best effort: a failed broadcast is logged, while the saved name
appears after a room reload. Joining an existing room also reconciles the
participant name with the account, repairing records left stale by the older
settings behavior.

The first concurrent browser run exposed a connection gap: a board could render
the old member name before its Realtime subscription completed, then miss the
update event. The board now fetches authorized members whenever the channel
subscribes or reconnects, while preserving any newer events received during
that fetch. The two-account scenario then passed three consecutive runs.

Verification: a new two-account Playwright scenario changed one account's name
from settings while another account kept the room open; the board updated live
and the participant row held the new name. Lint, types, 5 unit tests, the
production build, and all 7 local Playwright scenarios passed. The tests used
local Supabase only.

### 2026-09-25 — Stage 5: Polish and English routes

The invitation/private Realtime experiment was stashed at the user's request.
Invitation links are deferred; signed-in users still join using room IDs. Private
Realtime can be implemented independently. Guests remain the final feature stage.
The experiment's applied local SQL migration and ignored local JWT setting remain
outside the stash; no production database or deployment was changed.

Application pages now live under `[locale]`, with `/en` and `/pl` prefixes.
Unprefixed links redirect using the remembered language or browser preference,
with English as the fallback. The footer language selector keeps the current
page, query string, and fragment. API routes, static assets, and the Sentry tunnel
remain outside locale routing. Localized navigation wrappers preserve the locale
for links, client navigation, server redirects, and sign-out.

The authentication proxy protects the localized dashboard and game routes. A
translated Google sign-in page retains the destination through login and language
switches; callback destinations are restricted to the configured application
origin. NextAuth handles the provider flow and session as before. Polish copy now
covers the homepage, dashboard, settings, room controls, forms, menus, and ordinary
error/not-found pages. Dates and voting averages use locale-aware formatting.
Both catalogs contain the same 72 message keys. The framework's root-failure
fallback remains the existing Next.js global error page.

Browser coverage checks language detection and persistence, query/hash retention,
localized authentication redirects and Google callback parameters, translated
validation, room creation/joining, switching languages inside a room, voting,
settings metadata, and sign-out. The Google handoff is intercepted in tests; an
external Google OAuth round trip was not performed. A name-update test initially
failed; focusing its input before filling and asserting the submitted payload
made its interaction explicit, and the final suite passed.

Verification: lint, type checks, 5 unit tests, and all 11 local WebKit scenarios
passed, along with the production build. The restricted build stalled during
compilation; rerunning outside the sandbox completed successfully. Database tests
used local Supabase only. Existing development warnings about the Edge runtime, stream
closure, and dialog descriptions remain follow-up items.

### 2026-09-25 — Follow-up: compact language selector

Replaced the native language dropdown with the official shadcn/ui Radix Select,
adapted to the existing shared UI kit. The borderless trigger shows EN/PL and a
chevron; the menu shows full language names. Added the Radix Select dependency.
Lint, type checks, and all 4 locale browser tests passed. A local screenshot
confirmed the menu layout, and keyboard selection also changed the locale.

### 2026-09-26 — Private room Realtime

Room events and notifications now use private channels. Signed-in users continue
to join by room ID; invitation links remain deferred and their stash is intact.
Guests remain the final feature stage, and Google remains the only login provider.

A server endpoint checks the current session and active room membership before
issuing a room-scoped, 60-second JWT. The browser renews it every 30 seconds and
disconnects if renewal fails through expiry. Database authorization binds the
token's user, participant, room, and channel topic to an active participant.
Browser clients cannot publish events. A removed client that ignores the normal
removal redirect can retain its existing subscription until token expiry, for
up to approximately one minute; renewals and new subscriptions are denied.

The previously applied private Realtime migration was restored byte-for-byte
from the stash to preserve its checksum. Inspection also found that application
tables lacked RLS, which would have exposed data through the Data API to the new
authenticated tokens. A second migration enables RLS and revokes anonymous and
authenticated browser access to those tables while preserving Prisma access.
It also restricts Realtime to server broadcasts using the application's issuer.
Both migrations are applied locally; all 13 migrations are up to date.

Each open room owns its Realtime client. The client supplies the latest JWT via
the access-token callback: testing found that setting a token manually without
this callback allowed reconnects to fall back to the anonymous token. On
subscription or reconnection, the board fetches an authorized snapshot to recover
missed rounds and votes. Unrevealed votes remain hidden except for the viewer's
own vote, and newer events prevent stale snapshots from overwriting live state.
Connection and retry messages are translated into English and Polish.

Verification: lint, type checks, 5 unit tests, all 13 local WebKit/integration
scenarios, and the production build passed. New tests cover unauthorized and
forged credentials, room scope, public-channel isolation, denied browser writes,
denied Data API reads, actual token renewal and expiry after removal, and offline
reconnection with missed state and hidden votes. Tests used local Supabase only.
The build still reports the existing Edge runtime deprecation warning.

Deployment requires the server-only `SUPABASE_JWT_SECRET` accepted by the same
Supabase project's legacy HS256 JWT verifier and both migrations. The README
documents these requirements and recommends disabling public Realtime access in
the hosted project. No hosted settings, production database, or deployment were
changed in this step.

### 2026-09-27 — Let removed participants join again

The owner can still remove an active participant. Removal ends their current
room access and sends their open board to the join page. The same account can
enter the room ID in the join form to return, subject to the 12-participant
limit. Opening the room URL does not reactivate a removed account. Rejoining
reactivates the existing participant record, so its identity and past votes
remain intact. The join form now reports a full room with a specific message.

Verification: lint, types, a two-account browser scenario that removes and
rejoins a participant, and the participant integration scenario passed against
local Supabase. The browser scenario also checks that a direct URL stays blocked
until the account submits the join form.

### 2026-09-27 — Small trial room limits

The first trial allows each account to own two rooms. A room still allows 12
active participants. The account limit is checked inside the room creation
transaction. A lock on the owner row makes concurrent create requests use the
same count. The check also applies to direct service calls.

An owner can delete a room from the dashboard after a confirmation that names
the data it will remove. The server checks ownership before deletion. The
database also removes the room's rounds, votes, participants, and invitations.
Deletion frees one room slot. Open room boards receive a private deletion event,
return to the dashboard, and show a translated notice. The client refreshes the
dashboard table after a successful deletion.

The create form explains the two-room limit in English and Polish. Tests cover
two concurrent creations, a rejected third room, an unauthorized deletion,
related data removal, slot reuse, the dashboard confirmation, and an open board.
The first full browser run failed because tests reused one account across files
and past runs. Test setup now gives each browser test a new account. Lint, types,
five unit tests, and all 16 local WebKit scenarios passed. This trial uses a
room quota; shared request rate limiting remains a later release task.

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
