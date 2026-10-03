import { test, expect } from '@playwright/test';
import { localEmailLink } from './mail';
test('email account, session, logout and recovery enforce the protected boundary', async ({
  page,
  request,
}) => {
  expect((await request.get('/api/account')).status()).toBe(401);
  expect((await request.get('/api/subscription/access')).status()).toBe(401);
  expect(
    (
      await request.post('/api/billing/checkout', {
        headers: { Origin: 'https://untrusted.example' },
        data: {},
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post('/api/billing/checkout', {
        headers: { Origin: process.env.APP_URL || 'http://localhost:3000' },
        data: {},
      })
    ).status(),
  ).toBe(401);
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/signin/);
  const email = 'hikari-auth-' + crypto.randomUUID() + '@example.test';
  const password = 'Hikari-test-' + crypto.randomUUID();
  await page.goto('/signup');
  await page.getByLabel('Email', { exact: true }).fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page
    .getByRole('button', { name: 'Create account', exact: true })
    .click();
  await expect(page).toHaveURL(/\/dashboard/);
  expect((await page.request.get('/api/account')).status()).toBe(200);
  await page.goto('/account');
  await expect(
    page.getByRole('main').getByText(email, { exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await expect(page).toHaveURL(/\/signin/);
  expect((await page.request.get('/api/account')).status()).toBe(401);
  await page.getByLabel('Email', { exact: true }).fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await page.goto('/account');
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await expect(page).toHaveURL(/\/signin/);
  await page.goto('/forgot-password');
  await page.getByLabel('Email', { exact: true }).fill(email);
  await page.getByRole('button', { name: 'Send recovery email' }).click();
  await expect(page.getByRole('status')).toBeVisible();
  await page.goto(await localEmailLink(email));
  await expect(page).toHaveURL(/\/reset-password/);
  const updated = 'Hikari-updated-' + crypto.randomUUID();
  await page.getByLabel('Password', { exact: true }).fill(updated);
  await page.getByRole('button', { name: 'Update password' }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await page.goto('/account');
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await expect(page).toHaveURL(/\/signin/);
  await page.getByLabel('Email', { exact: true }).fill(email);
  await page.getByLabel('Password', { exact: true }).fill(updated);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard/);
});

test('native form submission keeps credentials out of the URL before hydration', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    await page.goto(
      (process.env.APP_URL || 'http://localhost:3000') + '/signin',
    );
    await page
      .getByLabel('Email', { exact: true })
      .fill('native-form@example.test');
    await page
      .getByLabel('Password', { exact: true })
      .fill('Native-form-fixture');
    const [request] = await Promise.all([
      page.waitForRequest((request) => request.method() === 'POST'),
      page
        .locator('form')
        .evaluate((form) => (form as HTMLFormElement).submit()),
    ]);
    expect(new URL(request.url()).search).toBe('');
    expect(request.postData()).toContain('password=');
  } finally {
    await context.close();
  }
});
