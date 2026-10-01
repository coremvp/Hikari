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
    expect(hasSubscriptionAccess([state(status)], approved)).toBe(
      ['active', 'trialing'].includes(status),
    );
  });
for (const status of ['active', 'trialing'] as const) {
  test(status + ' on an unapproved or ambiguous price denies access', () => {
    expect(
      hasSubscriptionAccess([state(status, 'price_other')], approved),
    ).toBe(false);
    expect(hasSubscriptionAccess([state(status, null)], approved)).toBe(false);
  });
  test(status + ' cancellation at period end keeps access', () =>
    expect(
      hasSubscriptionAccess(
        [{ ...state(status), cancelAtPeriodEnd: true }],
        approved,
      ),
    ).toBe(true),
  );
}
test('missing approved configuration and no subscription never grant access', () => {
  expect(hasSubscriptionAccess([state()], '')).toBe(false);
  expect(hasSubscriptionAccess([], approved)).toBe(false);
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
    async recurringPrice() {},
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
      () => approved,
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
test('subscription items must describe one recurring unit to grant access', () => {
  const item = {
    price: { id: approved, type: 'recurring' },
    quantity: 1,
    current_period_end: 1893542400,
  };
  const raw = {
    id: 'sub_contract',
    customer: 'cus_contract',
    status: 'active',
    cancel_at_period_end: true,
    items: { data: [item], has_more: false },
  } as unknown as Stripe.Subscription;
  expect(mapSubscription(raw).priceId).toBe(approved);
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
