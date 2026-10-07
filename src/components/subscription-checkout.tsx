'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { request } from '@/lib/client';
import type { PlanId } from '@/lib/subscription-plans';

export function SubscriptionCheckout({ plan }: { plan: PlanId }) {
  const started = useRef(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(true);
  const openCheckout = useCallback(async () => {
    setBusy(true);
    setError('');
    try {
      const { url } = z
        .object({ url: z.url() })
        .parse(await request('/billing/checkout', { plan, demo: true }));
      window.location.replace(url);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Could not open test checkout.',
      );
      setBusy(false);
    }
  }, [plan]);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void openCheckout();
  }, [openCheckout]);
  return (
    <div className="mx-auto max-w-md py-24">
      <h1 className="text-3xl font-medium tracking-tight">
        Your test subscription
      </h1>
      {busy ? (
        <p role="status" className="mt-5 text-neutral-600">
          Opening Stripe…
        </p>
      ) : (
        <>
          <p role="alert" className="mt-5 text-neutral-600">
            {error}
          </p>
          <button
            className="button mt-6 rounded-lg px-5 py-3"
            onClick={() => void openCheckout()}
          >
            Try again
          </button>
        </>
      )}
      <Link
        href="/#pricing"
        className="mt-6 block text-sm underline underline-offset-4"
      >
        Back to pricing
      </Link>
    </div>
  );
}
