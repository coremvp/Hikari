import { test, expect } from '@playwright/test';
import Stripe from 'stripe';
import postgres from 'postgres';
test('real test subscription reaches signed webhook, durable access and Customer Portal', async ({
  page,
}) => {
  for (const name of [
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'STRIPE_PRICE_ID',
    'DATABASE_URL',
  ])
    if (!process.env[name])
      throw new Error(name + ' is required; real Stripe proof was not run.');
  if (!process.env.STRIPE_SECRET_KEY!.startsWith('sk_test_'))
    throw new Error('This journey accepts Stripe test mode only.');
  if (
    !['localhost', '127.0.0.1'].includes(
      new URL(process.env.DATABASE_URL!).hostname,
    )
  )
    throw new Error(
      'This automated journey supports disposable local Hikari only.',
    );
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    timeout: 10000,
    maxNetworkRetries: 0,
  });
  const sql = postgres(process.env.DATABASE_URL!, {
    prepare: false,
    max: 1,
    connect_timeout: 10,
  });
  const email = 'hikari-billing-' + crypto.randomUUID() + '@example.test';
  const password = 'Hikari-billing-' + crypto.randomUUID();
  let customerId: string | undefined;
  try {
    await page.goto('/signup');
    await page.getByLabel('Email', { exact: true }).fill(email);
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page
      .getByRole('button', { name: 'Create account', exact: true })
      .click();
    await expect(page).toHaveURL(/\/dashboard/);
    const account = (await (await page.request.get('/api/account')).json()) as {
      id: string;
    };
    const checkout = await page.request.post('/api/billing/checkout', {
      headers: { Origin: process.env.APP_URL || 'http://localhost:3000' },
      data: {},
    });
    expect(checkout.status()).toBe(200);
    const response = (await checkout.json()) as {
      url: string;
      destination: string;
    };
    expect(response.destination).toBe('checkout');
    const customers =
      await sql`select stripe_customer_id from public.customers where user_id=${account.id}`;
    customerId = customers[0].stripe_customer_id;
    const sessions = await stripe.checkout.sessions.list({
      customer: customerId,
      status: 'open',
      limit: 10,
    });
    const session = sessions.data.find((s) => s.url === response.url);
    expect(session).toBeDefined();
    const items = await stripe.checkout.sessions.listLineItems(session!.id);
    expect(items.data[0].price?.id).toBe(process.env.STRIPE_PRICE_ID);
    await page.goto(response.url);
    await page.locator('input[name="cardNumber"]').fill('4242424242424242');
    await page.locator('input[name="cardExpiry"]').fill('1235');
    await page.locator('input[name="cardCvc"]').fill('123');
    const name = page.locator('input[name="billingName"]');
    if (await name.count()) await name.fill('Hikari Local Test');
    const postal = page.locator('input[name="billingPostalCode"]');
    if (await postal.count()) await postal.fill('94107');
    await page
      .getByRole('button', { name: /Subscribe|Pay/, exact: false })
      .click();
    await expect(page).toHaveURL(/localhost:3000\/account/, { timeout: 45000 });
    await expect
      .poll(
        async () =>
          (await page.request.get('/api/subscription/access')).status(),
        { timeout: 45000 },
      )
      .toBe(200);
    const rows =
      await sql`select * from public.subscriptions where customer_id=${customerId!}`;
    expect(
      rows.some(
        (s) =>
          ['active', 'trialing'].includes(s.status) &&
          s.price_id === process.env.STRIPE_PRICE_ID,
      ),
    ).toBe(true);
    await page.reload();
    await expect(
      page.getByRole('button', { name: 'Manage subscription', exact: true }),
    ).toBeVisible();
    const management = await page.request.post('/api/billing/checkout', {
      headers: { Origin: process.env.APP_URL || 'http://localhost:3000' },
      data: {},
    });
    expect((await management.json()).destination).toBe('portal');
    const portal = await page.request.post('/api/billing/portal', {
      headers: { Origin: process.env.APP_URL || 'http://localhost:3000' },
      data: {},
    });
    expect(portal.status()).toBe(200);
    const portalData = (await portal.json()) as { url: string };
    expect(new URL(portalData.url).hostname).toBe('billing.stripe.com');
    await page.goto(portalData.url);
    await expect(page.getByText(email, { exact: false }).first()).toBeVisible();
  } finally {
    if (customerId) {
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'all',
        limit: 100,
      });
      for (const subscription of subscriptions.data)
        if (!['canceled', 'incomplete_expired'].includes(subscription.status))
          await stripe.subscriptions.cancel(subscription.id);
      await stripe.customers.del(customerId);
      // Keep fake local account/mapping and canceled state so webhook completion can be inspected.
    }
    await sql.end();
  }
});
