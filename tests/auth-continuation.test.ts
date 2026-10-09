import { afterAll, expect, mock, test } from 'bun:test';
import { NextRequest } from 'next/server';
import {
  authDestination,
  checkoutNext,
  checkoutPath,
  billingIntervals,
} from '@/lib/subscription-plans';

let failure = false;
let signupRedirect = '';
mock.module('@/providers/supabase', () => ({
  authClient: async () => ({
    auth: {
      exchangeCodeForSession: async () => ({
        error: failure ? new Error('Invalid code') : null,
      }),
      verifyOtp: async () => ({
        error: failure ? new Error('Invalid token') : null,
      }),
      signUp: async (input: { options: { emailRedirectTo: string } }) => {
        signupRedirect = input.options.emailRedirectTo;
        return { data: { session: null }, error: null };
      },
    },
  }),
}));
const { GET: callback } = await import('@/app/auth/callback/route');
const { GET: confirm } = await import('@/app/auth/confirm/route');
const { signUp } = await import('@/services/auth');
const oldOrigin = process.env.APP_URL;
process.env.APP_URL = 'http://localhost:3000';
afterAll(() => {
  if (oldOrigin === undefined) delete process.env.APP_URL;
  else process.env.APP_URL = oldOrigin;
});
const request = (route: string, params: Record<string, string>) => {
  const url = new URL(route, 'http://localhost:3000');
  for (const [key, value] of Object.entries(params))
    url.searchParams.set(key, value);
  return new NextRequest(url);
};

for (const plan of ['starter', 'pro', 'business'] as const)
  for (const interval of billingIntervals) {
    test(
      plan +
        ' ' +
        interval +
        ' keeps its checkout destination through signup and verified confirmation',
      async () => {
        failure = false;
        const next = checkoutPath(plan, interval);
        expect(checkoutNext(next)).toBe(next);
        expect(authDestination(next)).toBe(next);
        await signUp('fixture@example.test', 'Fixture-password', next);
        expect(new URL(signupRedirect).searchParams.get('next')).toBe(next);
        for (const response of [
          await callback(
            request('/auth/callback', { code: 'fixture_code', next }),
          ),
          await confirm(
            request('/auth/confirm', {
              token_hash: 'fixture_hash',
              type: 'signup',
              next,
            }),
          ),
        ]) {
          expect(response.headers.get('location')).toBe(
            'http://localhost:3000' + next,
          );
          expect(response.headers.get('cache-control')).toBe(
            'private, no-store',
          );
          expect(response.headers.get('referrer-policy')).toBe('no-referrer');
        }
      },
    );
  }

test('untrusted return paths never escape the application or trigger checkout', async () => {
  failure = false;
  for (const next of [
    'https://other.example/checkout',
    '//other.example',
    '/checkout?plan=pro&url=https://other.example',
    '/checkout?plan=enterprise',
    '/checkout?plan=pro&interval=weekly',
    '/checkout?plan=pro&interval=yearly&url=https://other.example',
    '/account',
  ]) {
    expect(checkoutNext(next)).toBeNull();
    expect(authDestination(next)).toBe('/dashboard');
    expect(
      (
        await callback(
          request('/auth/callback', { code: 'fixture_code', next }),
        )
      ).headers.get('location'),
    ).toBe('http://localhost:3000/dashboard');
    await signUp('fixture@example.test', 'Fixture-password', next);
    expect(signupRedirect).toBe('http://localhost:3000/auth/callback');
  }
});

test('failed and missing confirmation preserve sign-in intent without granting a session', async () => {
  failure = true;
  const next = checkoutPath('business');
  for (const response of [
    await callback(request('/auth/callback', { code: 'fixture_code', next })),
    await callback(request('/auth/callback', { next })),
    await confirm(
      request('/auth/confirm', {
        token_hash: 'fixture_hash',
        type: 'signup',
        next,
      }),
    ),
  ]) {
    const destination = new URL(response.headers.get('location')!);
    expect(destination.pathname).toBe('/signin');
    expect(destination.searchParams.get('error')).toBe('confirmation');
    expect(destination.searchParams.get('next')).toBe(next);
  }
});

test('successful ordinary signup and password recovery keep their existing destinations', async () => {
  failure = false;
  expect(
    (
      await callback(request('/auth/callback', { code: 'fixture_code' }))
    ).headers.get('location'),
  ).toBe('http://localhost:3000/dashboard');
  expect(
    (
      await callback(
        request('/auth/callback', {
          code: 'fixture_code',
          next: '/reset-password',
        }),
      )
    ).headers.get('location'),
  ).toBe('http://localhost:3000/reset-password');
  expect(
    (
      await confirm(
        request('/auth/confirm', {
          token_hash: 'fixture_hash',
          type: 'recovery',
          next: checkoutPath('pro'),
        }),
      )
    ).headers.get('location'),
  ).toBe('http://localhost:3000/reset-password');
});
