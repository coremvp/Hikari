import { test, expect } from 'bun:test';
import {
  hasSubscriptionAccess,
  type SubscriptionState,
  type SubscriptionStatus,
} from '@/lib/billing-contract';
import { BillingService } from '@/services/billing';
import type { BillingStore, Customer } from '@/repositories/billing';
import {
  StripeProvider,
  mapSubscription,
  type BillingProvider,
} from '@/providers/stripe';
import Stripe from 'stripe';
import { createBillingRoutes } from '@/api/billing';
import { Hono } from 'hono';
import { AppError } from '@/lib/errors';
import {
  formatRecurringPrice,
  configuredSubscriptionPrices,
  type PlanId,
  billingIntervals,
} from '@/lib/subscription-plans';
import { subscriptionTiers } from '@/config/pricing.config';
const approved = 'price_approved';
const state = (
  status: SubscriptionStatus = 'active',
  priceId: string | null = approved,
): SubscriptionState => ({
  id: 'sub_contract',
  customerId: 'cus_contract',
  status,
  priceId,
  cancelAtPeriodEnd: false,
  currentPeriodEnd: new Date('2030-01-02T00:00:00Z'),
});
for (const status of [
  'active',
  'trialing',
  'incomplete',
  'incomplete_expired',
  'past_due',
  'unpaid',
  'paused',
  'canceled',
] as const)
  test(status + ' is checked against the persisted access rule', () => {
    expect(hasSubscriptionAccess([state(status)], [approved])).toBe(
      ['active', 'trialing'].includes(status),
    );
  });
for (const status of ['active', 'trialing'] as const) {
  test(status + ' on an unapproved or ambiguous price denies access', () => {
    expect(
      hasSubscriptionAccess([state(status, 'price_other')], [approved]),
    ).toBe(false);
    expect(hasSubscriptionAccess([state(status, null)], [approved])).toBe(
      false,
    );
  });
  test(status + ' cancellation at period end keeps access', () =>
    expect(
      hasSubscriptionAccess(
        [{ ...state(status), cancelAtPeriodEnd: true }],
        [approved],
      ),
    ).toBe(true),
  );
}
test('missing approved configuration and no subscription never grant access', () => {
  expect(hasSubscriptionAccess([state()], [])).toBe(false);
  expect(hasSubscriptionAccess([], [approved])).toBe(false);
});
class MemoryStore implements BillingStore {
  customer: Customer | null = {
    userId: 'user_contract',
    stripeCustomerId: 'cus_contract',
  };
  rows = new Map<string, SubscriptionState>();
  locks = new Map<string, Promise<unknown>>();
  async withLock<T>(
    key: string,
    work: (store: BillingStore) => Promise<T>,
  ): Promise<T> {
    const current = (this.locks.get(key) ?? Promise.resolve())
      .catch(() => {})
      .then(() => work(this));
    this.locks.set(key, current);
    return current;
  }
  async customerForUser(id: string) {
    return this.customer?.userId === id ? this.customer : null;
  }
  async customerForStripe(id: string) {
    return this.customer?.stripeCustomerId === id ? this.customer : null;
  }
  async saveCustomer(customer: Customer) {
    this.customer = customer;
  }
  async subscriptions(id: string) {
    return [...this.rows.values()].filter((s) => s.customerId === id);
  }
  async saveSubscription(s: SubscriptionState) {
    this.rows.set(s.id, s);
  }
}
function fixture() {
  const store = new MemoryStore();
  let current = state();
  let checkoutCount = 0;
  let open: string | null = null;
  const provider: BillingProvider = {
    async createCustomer() {
      return 'cus_contract';
    },
    async currentSubscriptions() {
      return [];
    },
    async currentSubscription() {
      return current;
    },
    async recurringPrice(id) {
      return {
        currency: 'usd',
        amount: 1500,
        interval: id.endsWith('_yearly') ? 'year' : 'month',
        intervalCount: 1,
        livemode: false,
      } as const;
    },
    async openCheckout() {
      return open;
    },
    async checkout() {
      checkoutCount++;
      open = 'https://checkout.stripe.com/fixture';
      return open;
    },
    async portal() {
      return 'https://billing.stripe.com/fixture';
    },
    async verify(raw) {
      const event = JSON.parse(raw) as {
        id: string;
        type: string;
        subscriptionId: string;
      };
      return event;
    },
  };
  return {
    store,
    provider,
    service: new BillingService(
      store,
      provider,
      () => ({
        starter: { monthly: approved, yearly: 'price_starter_yearly' },
        pro: { monthly: 'price_pro', yearly: 'price_pro_yearly' },
        business: {
          monthly: 'price_business',
          yearly: 'price_business_yearly',
        },
      }),
      () => 'https://app.example',
    ),
    setCurrent: (s: SubscriptionState) => {
      current = s;
    },
    count: () => checkoutCount,
  };
}
const event = (id: string) =>
  JSON.stringify({
    id,
    type: 'customer.subscription.updated',
    subscriptionId: 'sub_contract',
    status: 'active',
  });
const user = { id: 'user_contract', email: 'fixture@example.test' };

for (const tier of subscriptionTiers)
  for (const interval of billingIntervals)
    test(
      tier.name +
        ' ' +
        interval +
        ' uses the source catalog for Checkout and access',
      async () => {
        const f = fixture();
        const expectedPrice =
          interval === 'monthly' ? tier.priceIdMonthly : tier.priceIdYearly;
        const service = new BillingService(
          f.store,
          f.provider,
          () => configuredSubscriptionPrices,
          () => 'https://app.example',
        );
        let selected: string | undefined;
        f.provider.recurringPrice = async () => ({
          currency: 'usd',
          amount: 1500,
          interval: interval === 'monthly' ? 'month' : 'year',
          intervalCount: 1,
          livemode: false,
        });
        f.provider.checkout = async (_customer, priceId) => {
          selected = priceId;
          return 'https://checkout.stripe.com/fixture';
        };
        await service.checkout(
          user,
          tier.id.replace(/^tier-/, '') as PlanId,
          true,
          interval,
        );
        expect(selected).toBe(expectedPrice);
        f.setCurrent(state('active', expectedPrice));
        await service.webhook(event('evt_catalog'), 'fixture');
        expect(f.store.rows.get('sub_contract')?.priceId).toBe(expectedPrice);
        expect((await service.view(user.id)).access).toBe(true);
        f.store.rows.set('sub_contract', state('active', 'price_other'));
        expect((await service.view(user.id)).access).toBe(false);
      },
    );

for (const [plan, price] of Object.entries({
  starter: approved,
  pro: 'price_pro',
  business: 'price_business',
}))
  for (const interval of billingIntervals) {
    const selectedPrice =
      interval === 'monthly' ? price : 'price_' + plan + '_yearly';
    test(
      plan +
        ' ' +
        interval +
        ' resolves a server-owned price for Checkout and persisted access',
      async () => {
        const f = fixture();
        let selected: string | undefined;
        f.provider.checkout = async (_customer, priceId) => {
          selected = priceId;
          return 'https://checkout.stripe.com/fixture';
        };
        await f.service.checkout(user, plan as PlanId, true, interval);
        expect(selected).toBe(selectedPrice);
        f.setCurrent(state('active', selectedPrice));
        await f.service.webhook(event('evt_plan'), 'fixture');
        expect(f.store.rows.get('sub_contract')?.priceId).toBe(selectedPrice);
        expect((await f.service.view(user.id)).access).toBe(true);
      },
    );
  }

test('public pricing maps provider currency and recurrence, and hides live or failed prices', async () => {
  const f = fixture();
  f.provider.recurringPrice = async (id) => {
    if (id === 'price_business') throw new Error('Provider unavailable');
    return {
      currency: 'jpy',
      amount: 2300,
      interval: id.endsWith('_yearly') ? 'year' : 'month',
      intervalCount: 1,
      livemode: id === 'price_pro',
    };
  };
  const plans = await f.service.plans();
  const starter = plans.find((plan) => plan.id === 'starter')!;
  expect(starter.prices.yearly?.amount).toBe(2300);
  expect(formatRecurringPrice(starter.prices.yearly!)).toEqual({
    amount: '¥2,300',
    interval: 'per year',
  });
  expect(plans.find((plan) => plan.id === 'pro')?.prices.monthly).toBeNull();
  expect(
    plans.find((plan) => plan.id === 'business')?.prices.monthly,
  ).toBeNull();
});

test('missing plans stay unavailable and never create a provider customer', async () => {
  const f = fixture();
  const service = new BillingService(
    f.store,
    f.provider,
    () => ({ starter: { monthly: approved } }),
    () => 'https://app.example',
  );
  f.store.customer = null;
  let created = false;
  f.provider.createCustomer = async () => {
    created = true;
    return 'cus_new';
  };
  expect(
    (await service.plans()).find((plan) => plan.id === 'pro')?.prices.monthly,
  ).toBeNull();
  await expect(service.checkout(user, 'pro', true)).rejects.toThrow(
    'not configured',
  );
  expect(created).toBe(false);
});

test('a stale pricing card cannot create a customer or session after a price switches to live mode', async () => {
  const f = fixture();
  expect(
    (await f.service.plans()).find((plan) => plan.id === 'pro')?.prices.monthly
      ?.livemode,
  ).toBe(false);
  f.store.customer = null;
  let created = false;
  f.provider.createCustomer = async () => {
    created = true;
    return 'cus_new';
  };
  f.provider.recurringPrice = async () => ({
    currency: 'usd',
    amount: 6500,
    interval: 'month',
    intervalCount: 1,
    livemode: true,
  });
  await expect(f.service.checkout(user, 'pro', true)).rejects.toThrow(
    'Test checkout is unavailable',
  );
  expect(created).toBe(false);
  expect(f.store.customer).toBeNull();
  expect(f.count()).toBe(0);
});

test('an archived purchase price does not block existing Account billing management', async () => {
  const f = fixture();
  f.store.rows.set('sub_contract', state());
  f.provider.recurringPrice = async () => {
    throw new Error('Archived price');
  };
  expect((await f.service.checkout(user)).destination).toBe('portal');
  expect(f.count()).toBe(0);
});

test('a yearly selection cannot fall back to a monthly or multi-year price', async () => {
  const f = fixture();
  f.store.customer = null;
  for (const intervalCount of [1, 2]) {
    f.provider.recurringPrice = async () => ({
      currency: 'usd',
      amount: 9900,
      interval: intervalCount === 1 ? 'month' : 'year',
      intervalCount,
      livemode: false,
    });
    expect(
      (await f.service.plans()).find((plan) => plan.id === 'pro')?.prices
        .yearly,
    ).toBeNull();
    await expect(
      f.service.checkout(user, 'pro', true, 'yearly'),
    ).rejects.toThrow('does not match');
    expect(f.store.customer).toBeNull();
    expect(f.count()).toBe(0);
  }
});

test('missing yearly configuration stays unavailable while monthly keeps working', async () => {
  const f = fixture();
  const service = new BillingService(
    f.store,
    f.provider,
    () => ({ starter: { monthly: approved } }),
    () => 'https://app.example',
  );
  const starter = (await service.plans()).find(
    (plan) => plan.id === 'starter',
  )!;
  expect(starter.prices.monthly?.amount).toBe(1500);
  expect(starter.prices.yearly).toBeNull();
  await expect(
    service.checkout(user, 'starter', true, 'yearly'),
  ).rejects.toThrow('not configured');
  expect(f.count()).toBe(0);
  expect((await service.checkout(user)).destination).toBe('checkout');
});

test('Checkout API rejects arbitrary prices and plan identifiers, and requires a verified user', async () => {
  const f = fixture();
  const api = new Hono().route(
    '/api',
    createBillingRoutes(f.service, async () => user),
  );
  const post = (body: unknown) =>
    api.request('/api/billing/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  for (const body of [
    { plan: 'enterprise' },
    { plan: 'pro', interval: 'weekly' },
    { plan: 'pro', priceId: 'price_attacker' },
    { demo: 'true' },
  ]) {
    expect((await post(body)).status).toBe(400);
  }
  expect(f.count()).toBe(0);
  expect((await post({ plan: 'pro', demo: true })).status).toBe(200);
  const anonymous = new Hono()
    .route(
      '/api',
      createBillingRoutes(f.service, async () => {
        throw new AppError(401, 'Sign in to continue.');
      }),
    )
    .onError((error, c) =>
      c.json(
        { error: error.message },
        error instanceof AppError ? error.status : 503,
      ),
    );
  expect(
    (
      await anonymous.request('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'business', demo: true }),
      })
    ).status,
  ).toBe(401);
});

test('Stripe price validation retains quoted fields and rejects unsupported or inactive products', async () => {
  const raw = {
    active: true,
    type: 'recurring',
    currency: 'eur',
    unit_amount: 1234,
    recurring: { interval: 'week', interval_count: 3, usage_type: 'licensed' },
    billing_scheme: 'per_unit',
    transform_quantity: null,
    livemode: false,
    product: { active: true, livemode: false },
  };
  let price = raw;
  const provider = new StripeProvider(
    () => ({ prices: { retrieve: async () => price } }) as unknown as Stripe,
  );
  expect(await provider.recurringPrice('price_fixture')).toEqual({
    currency: 'eur',
    amount: 1234,
    interval: 'week',
    intervalCount: 3,
    livemode: false,
  });
  expect(
    formatRecurringPrice(await provider.recurringPrice('price_fixture')),
  ).toEqual({ amount: '€12.34', interval: 'every 3 weeks' });
  for (const changed of [
    { active: false },
    { unit_amount: null },
    { billing_scheme: 'tiered' },
    { transform_quantity: { divide_by: 10, round: 'up' } },
    { product: { active: false, livemode: false } },
    { product: { active: true, livemode: true } },
    { recurring: { ...raw.recurring, usage_type: 'metered' } },
  ]) {
    price = { ...raw, ...changed } as typeof raw;
    await expect(provider.recurringPrice('price_fixture')).rejects.toThrow(
      'not configured correctly',
    );
  }
});
test('duplicates and an older event use current provider truth through the final reader', async () => {
  const f = fixture();
  await f.service.webhook(event('evt_new'), 'fixture');
  await f.service.webhook(event('evt_new'), 'fixture');
  expect(f.store.rows.size).toBe(1);
  expect((await f.service.view('user_contract')).access).toBe(true);
  f.setCurrent(state('canceled'));
  await f.service.webhook(event('evt_old'), 'fixture');
  expect(f.store.rows.get('sub_contract')?.status).toBe('canceled');
  expect((await f.service.view('user_contract')).access).toBe(false);
});
test('overlapping deliveries retrieve state inside the serialization boundary', async () => {
  const f = fixture();
  let reads = 0;
  f.provider.currentSubscription = async () => {
    reads++;
    if (reads === 1) {
      await new Promise((resolve) => setTimeout(resolve, 10));
      return state();
    }
    return state('canceled');
  };
  await Promise.all([
    f.service.webhook(event('evt_first'), 'fixture'),
    f.service.webhook(event('evt_second'), 'fixture'),
  ]);
  expect(f.store.rows.size).toBe(1);
  expect((await f.service.view('user_contract')).access).toBe(false);
});
for (const status of ['active', 'trialing'] as const)
  test(
    status + ' subscriber manages rather than buying another subscription',
    async () => {
      const f = fixture();
      f.store.rows.set('sub_contract', state(status, 'price_unapproved'));
      expect(
        (
          await f.service.checkout({
            id: 'user_contract',
            email: 'fixture@example.test',
          })
        ).destination,
      ).toBe('portal');
      expect(f.count()).toBe(0);
    },
  );
test('provider state before webhook arrival prevents a second checkout', async () => {
  const f = fixture();
  f.provider.currentSubscriptions = async () => [state('trialing')];
  expect(
    (
      await f.service.checkout({
        id: 'user_contract',
        email: 'fixture@example.test',
      })
    ).destination,
  ).toBe('portal');
  expect(f.count()).toBe(0);
});
test('concurrent checkout requests reuse one open provider session', async () => {
  const f = fixture();
  const user = { id: 'user_contract', email: 'fixture@example.test' };
  const result = await Promise.all([
    f.service.checkout(user),
    f.service.checkout(user),
  ]);
  expect(f.count()).toBe(1);
  expect(result[0]).toEqual(result[1]);
});
test('unmapped provider customer cannot mint local access', async () => {
  const f = fixture();
  f.store.customer = null;
  expect(
    (await f.service.webhook(event('evt_foreign'), 'fixture')).outcome,
  ).toBe('ignored');
  expect(f.store.rows.size).toBe(0);
});
test('provider failure is retryable and cannot return success or create access', async () => {
  const f = fixture();
  f.provider.currentSubscription = async () => {
    throw new Error('Fixture provider unavailable');
  };
  await expect(
    f.service.webhook(event('evt_failed'), 'fixture'),
  ).rejects.toThrow('Retry delivery');
  expect(f.store.rows.size).toBe(0);
});
test('webhook verification rejects tampered bytes before provider retrieval', async () => {
  const oldKey = process.env.STRIPE_SECRET_KEY,
    oldSecret = process.env.STRIPE_WEBHOOK_SECRET;
  process.env.STRIPE_SECRET_KEY = 'sk_test_contract';
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_contract';
  try {
    const client = new Stripe('sk_test_contract');
    const raw = JSON.stringify({
      id: 'evt_contract',
      livemode: false,
      type: 'customer.subscription.updated',
      data: { object: { object: 'subscription', id: 'sub_contract' } },
    });
    const signature = await client.webhooks.generateTestHeaderStringAsync({
      payload: raw,
      secret: 'whsec_contract',
    });
    const provider = new StripeProvider();
    expect((await provider.verify(raw, signature)).subscriptionId).toBe(
      'sub_contract',
    );
    await expect(provider.verify(raw + ' ', signature)).rejects.toThrow(
      'Invalid webhook signature',
    );
    await expect(provider.verify(raw, '')).rejects.toThrow(
      'Invalid webhook signature',
    );
  } finally {
    if (oldKey) process.env.STRIPE_SECRET_KEY = oldKey;
    else delete process.env.STRIPE_SECRET_KEY;
    if (oldSecret) process.env.STRIPE_WEBHOOK_SECRET = oldSecret;
    else delete process.env.STRIPE_WEBHOOK_SECRET;
  }
});
test('subscription items must describe one recurring item to grant access', () => {
  const item = {
    price: { id: approved, type: 'recurring' },
    quantity: 2,
    current_period_end: 1893542400,
  };
  const raw = {
    id: 'sub_contract',
    customer: 'cus_contract',
    status: 'active',
    cancel_at_period_end: true,
    items: { data: [item], has_more: false },
  } as unknown as Stripe.Subscription;
  for (const status of ['active', 'trialing'] as const) {
    const mapped = mapSubscription({ ...raw, status });
    expect(mapped.priceId).toBe(approved);
    expect(mapped.currentPeriodEnd?.toISOString()).toBe(
      '2030-01-02T00:00:00.000Z',
    );
    expect(hasSubscriptionAccess([mapped], [approved])).toBe(true);
  }
  expect(mapSubscription(raw).cancelAtPeriodEnd).toBe(true);
  expect(
    mapSubscription({
      ...raw,
      items: { ...raw.items, data: [...raw.items.data, ...raw.items.data] },
    }).priceId,
  ).toBe(null);
  expect(
    mapSubscription({ ...raw, items: { ...raw.items, has_more: true } })
      .priceId,
  ).toBe(null);
});

test('a lost Checkout response retains its idempotency key and a closed session starts a new cycle', async () => {
  const keys: string[] = [];
  const created = new Map<string, string>();
  let previous: {
    id: string;
    status: string;
    mode: string;
    metadata: { hikari_price_id: string };
  }[] = [];
  let loseResponse = true;
  const sdk = {
    checkout: {
      sessions: {
        async list() {
          return { has_more: false, data: previous };
        },
        async create(_params: unknown, options: { idempotencyKey: string }) {
          keys.push(options.idempotencyKey);
          if (!created.has(options.idempotencyKey))
            created.set(
              options.idempotencyKey,
              'https://checkout.stripe.com/' + created.size,
            );
          if (loseResponse) {
            loseResponse = false;
            throw new Error('Fixture response lost after creation');
          }
          return { url: created.get(options.idempotencyKey) };
        },
      },
    },
  } as unknown as Stripe;
  const provider = new StripeProvider(() => sdk);
  await expect(
    provider.checkout('cus_contract', approved, 'https://app.example'),
  ).rejects.toThrow('response lost');
  await provider.checkout('cus_contract', approved, 'https://app.example');
  expect(keys[0]).toBe(keys[1]);
  expect(created.size).toBe(1);
  previous = [
    {
      id: 'cs_closed',
      status: 'expired',
      mode: 'subscription',
      metadata: { hikari_price_id: approved },
    },
  ];
  await provider.checkout('cus_contract', approved, 'https://app.example');
  expect(keys[2]).not.toBe(keys[1]);
  expect(created.size).toBe(2);
});
