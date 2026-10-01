'use client';
import { useState, useSyncExternalStore, type FormEvent } from 'react';
import Link from 'next/link';
import { request } from '@/lib/client';
export type AuthMode = 'signin' | 'signup' | 'recovery' | 'password';
const subscribe = () => () => {};
export function AuthForm({ mode }: { mode: AuthMode }) {
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
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
    <div className="mx-auto max-w-md py-12">
      <p className="eyebrow">YOUR ACCOUNT</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 text-slate-600">
        {mode === 'signup'
          ? 'Start building with Hikari.'
          : 'Continue to your application.'}
      </p>
      <form method="post" onSubmit={submit} className="mt-8 space-y-5">
        {mode !== 'password' && (
          <label className="block text-sm font-medium">
            Email
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              className="field mt-2"
            />
          </label>
        )}
        {mode !== 'recovery' && (
          <div className="text-sm font-medium">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              aria-describedby="password-help"
              name="password"
              type="password"
              autoComplete={
                mode === 'signin' ? 'current-password' : 'new-password'
              }
              required
              minLength={8}
              maxLength={128}
              className="field mt-2"
            />
            <span
              id="password-help"
              className="mt-1 block text-xs text-slate-500"
            >
              At least 8 characters.
            </span>
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
        <button disabled={busy || !hydrated} className="button w-full">
          {busy
            ? 'Please wait…'
            : {
                signin: 'Sign in',
                signup: 'Create account',
                recovery: 'Send recovery email',
                password: 'Update password',
              }[mode]}
        </button>
      </form>
      <div className="mt-6 flex flex-wrap justify-between gap-4 text-sm text-slate-600">
        <Link href={mode === 'signin' ? '/signup' : '/signin'}>
          {mode === 'signin' ? 'Create an account' : 'Back to sign in'}
        </Link>
        {mode === 'signin' && (
          <Link href="/forgot-password">Forgot password?</Link>
        )}
      </div>
    </div>
  );
}
