'use client';
import { useState, useSyncExternalStore, type FormEvent } from 'react';
import Link from 'next/link';
import { request } from '@/lib/client';
export type AuthMode = 'signin' | 'signup' | 'recovery' | 'password';
const subscribe = () => () => {};
export function AuthForm({
  mode,
  confirmationFailed = false,
}: {
  mode: AuthMode;
  confirmationFailed?: boolean;
}) {
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(
    confirmationFailed
      ? 'This confirmation link is invalid or expired. Request a new email.'
      : '',
  );
  const title = {
    signin: 'Welcome back',
    signup: 'Create your account',
    recovery: 'Reset your password',
    password: 'Choose a new password',
  }[mode];
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    const form = new FormData(event.currentTarget);
    const body = {
      ...(mode !== 'password' ? { email: form.get('email') } : {}),
      ...(mode !== 'recovery' ? { password: form.get('password') } : {}),
    };
    try {
      const data = await request('/auth/' + mode, body);
      if (mode === 'recovery')
        setMessage(
          'If an account exists, a password reset email is on its way.',
        );
      else if (
        mode === 'signup' &&
        typeof data === 'object' &&
        data &&
        'confirmationRequired' in data &&
        data.confirmationRequired
      )
        setMessage('Check your email to confirm your account.');
      else
        window.location.assign(
          new URL('/dashboard', window.location.origin).href,
        );
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Please try again.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="flex min-h-svh flex-col p-6 md:p-10">
      <Link
        href="/"
        aria-label="Hikari home"
        className="w-fit text-xl font-semibold tracking-tight"
      >
        Hikari{' '}
        <span className="text-xs font-normal text-neutral-500">by CoreMVP</span>
      </Link>
      <div className="flex flex-1 items-center justify-center py-10">
        <form
          method="post"
          onSubmit={submit}
          className="flex w-full max-w-sm flex-col gap-7"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-balance text-neutral-500">
              {mode === 'signup'
                ? 'Start building with Hikari.'
                : mode === 'recovery'
                  ? 'Enter your email to reset your password.'
                  : mode === 'password'
                    ? 'Set a new password for your account.'
                    : 'Sign in to your account'}
            </p>
          </div>
          {mode !== 'password' && (
            <label className="flex flex-col gap-3 text-sm font-medium">
              Email
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="m@example.com"
                required
                maxLength={254}
                className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 text-base font-normal shadow-xs placeholder:text-neutral-500 md:text-sm"
              />
            </label>
          )}
          {mode !== 'recovery' && (
            <div className="flex flex-col gap-3 text-sm font-medium">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label htmlFor="password">Password</label>
                {mode === 'signin' && (
                  <Link
                    href="/forgot-password"
                    className="text-xs font-normal text-neutral-600 underline underline-offset-4"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <input
                id="password"
                aria-describedby={
                  mode === 'signin' ? undefined : 'password-help'
                }
                name="password"
                type="password"
                autoComplete={
                  mode === 'signin' ? 'current-password' : 'new-password'
                }
                required
                minLength={8}
                maxLength={128}
                className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 text-base font-normal shadow-xs md:text-sm"
              />
              {mode !== 'signin' && (
                <span
                  id="password-help"
                  className="text-sm font-normal text-neutral-500"
                >
                  At least 8 characters.
                </span>
              )}
            </div>
          )}
          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}
          {message && (
            <p role="status" className="text-sm text-emerald-700">
              {message}
            </p>
          )}
          <button
            disabled={busy || !hydrated}
            className="button h-9 w-full rounded-lg py-2 font-medium"
          >
            {busy
              ? 'Please wait…'
              : {
                  signin: 'Sign in',
                  signup: 'Create account',
                  recovery: 'Send recovery email',
                  password: 'Update password',
                }[mode]}
          </button>
          <p className="text-center text-sm text-neutral-500">
            {mode === 'signin'
              ? "Don't have an account? "
              : mode === 'signup'
                ? 'Already have an account? '
                : ''}
            <Link
              href={mode === 'signin' ? '/signup' : '/signin'}
              className="underline underline-offset-4"
            >
              {mode === 'signin'
                ? 'Sign up'
                : mode === 'signup'
                  ? 'Sign in'
                  : 'Back to sign in'}
            </Link>
          </p>
        </form>
      </div>
      <p className="mx-auto max-w-sm text-center text-sm text-neutral-500">
        Hikari is open source under MIT.{' '}
        <a
          href="https://github.com/coremvp/hikari"
          className="underline underline-offset-4"
        >
          Source on GitHub
        </a>
      </p>
    </div>
  );
}
