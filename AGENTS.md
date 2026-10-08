# Hikari agent instructions

## Local provider setup in a CoreMVP engineering checkout

When Hikari work is run from a CoreMVP engineering checkout, use the existing
CoreMVP environment workflow before requesting manual provider configuration:

1. Run `./coremvp env sync -t nextjs` from the **CoreMVP root**, through host
   execution. This refreshes the template's ignored local environment from its
   existing credential store. The root command currently supports `nextjs`,
   not a `hikari` target.
2. Follow Hikari's local guide: start its Supabase project and apply pending
   migrations with `bunx supabase migration up --local` before signup. Never
   reset existing data to bypass the legacy-data migration guard. Run Hikari's
   own `./coremvp env sync`. Keep its origin, database and Supabase settings;
   do not copy the template's complete environment into Hikari.
3. For an authorized local billing test, consume the synced Stripe test key
   internally through a setup helper. Verify test mode, configure Hikari's
   three example plans with monthly and yearly prices, and derive the signing
   secret from the task-owned Stripe CLI listener. The example annual amounts
   are 80% of twelve monthly payments. Do not reuse a hosted webhook secret for
   a local listener or change another application's products or Portal settings.
4. Keep local settings ignored with file mode `0600`. Check presence and mode
   without printing credentials, environment contents or account access links.
   From the Hikari repository, run Hikari's `./coremvp e2e billing:subscription`
   against a disposable local project.

Routine local configuration is agent-owned when this workflow is available.
Do not ask the user to supply keys, price IDs or environment files before
using it. If it fails, diagnose the exact host command and report that evidence
without treating a sandbox failure as a credential or service failure.

This is an engineering setup path. A separate Hikari clone uses the provider
setup documented in its customer guides. Local test proof does not establish
hosted billing mode or authorize production changes.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
