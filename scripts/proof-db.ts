import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';
import { Hono } from 'hono';
import postgres from 'postgres';
import Stripe from 'stripe';
import { BillingService } from '@/services/billing';
import { BillingRepository } from '@/repositories/billing';
import { StripeProvider, type BillingProvider } from '@/providers/stripe';
import type { SubscriptionState } from '@/lib/billing-contract';
import { createBillingRoutes } from '@/api/billing';
import { AppError } from '@/lib/errors';
for (const name of [
  'DATABASE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
])
  if (!process.env[name])
    throw new Error(name + ' is required for local database integration.');
for (const value of [
  process.env.DATABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
])
  if (!['localhost', '127.0.0.1'].includes(new URL(value).hostname))
    throw new Error(
      'Database integration supports disposable local Hikari only.',
    );
const sql = postgres(process.env.DATABASE_URL!, {
  prepare: false,
  max: 1,
  connect_timeout: 10,
  connection: { statement_timeout: 15000 },
});
const email = 'hikari-db-' + crypto.randomUUID() + '@example.test';
const password = 'Hikari-db-' + crypto.randomUUID();
const auth = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);
const { data, error } = await auth.auth.signUp({ email, password });
assert.equal(error, null);
assert.ok(data.user);
assert.ok(data.session, 'Signup must immediately establish a session.');
const userId = data.user.id;
const approved = 'price_dbapproved';
const customerId = 'cus_db' + crypto.randomUUID().replaceAll('-', '');
const id = 'sub_db' + crypto.randomUUID().replaceAll('-', '');
let current: SubscriptionState = {
  id,
  customerId,
  status: 'trialing',
  priceId: approved,
  cancelAtPeriodEnd: true,
  currentPeriodEnd: new Date('2030-01-02T03:04:05Z'),
};
process.env.STRIPE_SECRET_KEY = 'sk_test_fixture';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_fixture';
const verifier = new StripeProvider();
const provider: BillingProvider = {
  createCustomer: async () => customerId,
  currentSubscriptions: async () => [],
  currentSubscription: async () => current,
  recurringPrice: async () => {},
  openCheckout: async () => null,
  checkout: async () => 'https://checkout.stripe.com/fixture',
  portal: async () => 'https://billing.stripe.com/fixture',
  verify: (raw, signature) => verifier.verify(raw, signature),
};
const service = new BillingService(
  new BillingRepository(),
  provider,
  () => approved,
  () => 'http://localhost:3000',
);
const api = new Hono()
  .route(
    '/api',
    createBillingRoutes(service, async () => ({ id: userId, email })),
  )
  .onError((error, c) =>
    c.json(
      { error: error.message },
      error instanceof AppError ? error.status : 503,
    ),
  );
const stripe = new Stripe('sk_test_fixture');
const deliver = async (eventId: string) => {
  const payload = JSON.stringify({
    id: eventId,
    type: 'customer.subscription.updated',
    livemode: false,
    data: { object: { id, object: 'subscription', status: 'active' } },
  });
  const signature = await stripe.webhooks.generateTestHeaderStringAsync({
    payload,
    secret: 'whsec_fixture',
  });
  return api.request('/api/webhooks/stripe', {
    method: 'POST',
    body: payload,
    headers: { 'stripe-signature': signature },
  });
};
try {
  assert.equal((await api.request('/api/subscription/access')).status, 403);
  assert.equal(
    (await api.request('/api/billing/checkout', { method: 'POST' })).status,
    200,
  );
  assert.equal((await deliver('evt_dbnew')).status, 200);
  assert.equal((await deliver('evt_dbnew')).status, 200);
  const rows = await sql`select * from public.subscriptions where id=${id}`;
  assert.equal(rows.length, 1);
  assert.equal(rows[0].status, 'trialing');
  assert.equal(rows[0].price_id, approved);
  assert.equal(rows[0].cancel_at_period_end, true);
  assert.equal(
    new Date(rows[0].current_period_end).toISOString(),
    '2030-01-02T03:04:05.000Z',
  );
  assert.equal((await api.request('/api/subscription/access')).status, 200);
  const reader = await (await api.request('/api/billing/subscription')).json();
  assert.equal(reader.access, true);
  assert.equal(reader.subscriptions[0].cancelAtPeriodEnd, true);
  assert.equal(
    reader.subscriptions[0].currentPeriodEnd,
    '2030-01-02T03:04:05.000Z',
  );
  current = { ...current, status: 'canceled' };
  assert.equal((await deliver('evt_dbold')).status, 200);
  assert.equal((await api.request('/api/subscription/access')).status, 403);
  let reads = 0;
  provider.currentSubscription = async () => {
    if (++reads === 1) {
      await Bun.sleep(50);
      return { ...current, status: 'active' };
    }
    return current;
  };
  const overlapping = await Promise.all([
    deliver('evt_overlap_a'),
    deliver('evt_overlap_b'),
  ]);
  assert.ok(overlapping.every((response) => response.status === 200));
  assert.equal((await api.request('/api/subscription/access')).status, 403);
  const migration = await Bun.file(
    'supabase/migrations/20261001144703_server_owned_billing.sql',
  ).text();
  await assert.rejects(
    sql.begin(async (transaction) => {
      await transaction.unsafe(migration);
    }),
    /requires a fresh Supabase project/,
  );
  assert.equal(
    (await sql`select id from public.subscriptions where id=${id}`).length,
    1,
  );
  const invalid = await api.request('/api/webhooks/stripe', {
    method: 'POST',
    body: '{}',
    headers: { 'stripe-signature': 'invalid' },
  });
  assert.equal(invalid.status, 400);
  const unauthorized = new Hono()
    .route(
      '/api',
      createBillingRoutes(service, async () => {
        throw new AppError(401, 'Sign in');
      }),
    )
    .onError((error, c) => c.json({ error: error.message }, 401));
  assert.equal(
    (await unauthorized.request('/api/subscription/access')).status,
    401,
  );
  for (const client of [
    createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false } },
    ),
    auth,
  ])
    for (const table of ['customers', 'subscriptions']) {
      assert.equal(
        (await client.from(table).select('*')).error?.code,
        '42501',
        'Direct client read must be denied',
      );
      assert.equal(
        (
          await client.from(table).insert(
            table === 'customers'
              ? { user_id: userId, stripe_customer_id: 'cus_forbidden' }
              : {
                  id: 'sub_forbidden',
                  customer_id: customerId,
                  status: 'active',
                  price_id: approved,
                  cancel_at_period_end: false,
                },
          )
        ).error?.code,
        '42501',
        'Direct client write must be denied',
      );
      assert.equal(
        (
          await client
            .from(table)
            .update(
              table === 'customers'
                ? { stripe_customer_id: 'cus_forbidden' }
                : { status: 'active' },
            )
            .eq(
              table === 'customers' ? 'user_id' : 'id',
              table === 'customers' ? userId : id,
            )
        ).error?.code,
        '42501',
        'Direct client update must be denied',
      );
      assert.equal(
        (
          await client
            .from(table)
            .delete()
            .eq(
              table === 'customers' ? 'user_id' : 'id',
              table === 'customers' ? userId : id,
            )
        ).error?.code,
        '42501',
        'Direct client delete must be denied',
      );
    }
  const legacy =
    await sql`select tablename from pg_tables where schemaname='public' and tablename in ('users','prices','products','posts','user_email_list')`;
  assert.equal(legacy.length, 0);
  const policies =
    await sql`select * from pg_policies where schemaname='public' and tablename in ('customers','subscriptions')`;
  assert.equal(policies.length, 0);
  console.log(
    'PASS: signed fixture webhook -> production service -> real Drizzle/transaction -> local rows -> real Hono reader; non-default fields, duplicate/older delivery, invalid signature, authorization, anonymous/authenticated direct read/write/update/delete denial. Stripe retrieval and request principal were controlled fixtures; no Stripe API called.',
  );
} finally {
  await sql`delete from public.subscriptions where customer_id=${customerId}`;
  await sql`delete from public.customers where user_id=${userId}`;
  await sql`delete from auth.users where id=${userId}`;
  await sql.end();
  // The production repository pool is otherwise held by this short-lived proof process.
}
