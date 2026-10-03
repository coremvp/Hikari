# Changelog

## Unreleased

Hikari by CoreMVP rebuilds the application around Bun, current Next.js and React, embedded Hono, Supabase Auth, Drizzle, and individual-account subscriptions.

- Email/password signup, signin, logout, confirmation, and recovery.
- Protected Dashboard and Account.
- Authenticated Stripe Checkout, subscription lifecycle webhooks, durable access, and Customer Portal.
- Server-owned billing tables with direct browser access denied.
- Local environment and verification commands, with a Vercel/Supabase deployment guide.
- Removal of tRPC, catalog synchronization, newsletter capture, embedded Blog/Docs, storage demos, and unused UI/dependencies.

This schema targets fresh Supabase projects. Migration refuses to discard nonempty legacy application data. Preserve existing deployments and plan their data migration separately.

Real Stripe and hosted verification are required before a release. No release tag or refreshed public demo is implied by this unreleased entry.
