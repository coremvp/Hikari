'use client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { request } from '@/lib/client';
import { billingViewSchema } from '@/lib/billing-contract';
export function BillingPanel() {
  const query = useQuery({
    queryKey: ['billing', 'subscription'],
    queryFn: async () =>
      billingViewSchema.parse(await request('/billing/subscription')),
    refetchOnWindowFocus: true,
  });
  const mutation = useMutation({
    mutationFn: async (action: 'checkout' | 'portal') =>
      z.object({ url: z.url() }).parse(await request('/billing/' + action, {})),
    onSuccess: (data) => {
      window.location.assign(data.url);
    },
  });
  return (
    <section className="mt-10 border-t border-slate-200 pt-8">
      <h2 className="text-xl font-semibold">Subscription</h2>
      {query.isPending ? (
        <p role="status" className="mt-3 text-slate-600">
          Loading subscription…
        </p>
      ) : query.isError ? (
        <div className="mt-3">
          <p role="alert" className="text-red-700">
            {query.error.message}
          </p>
          <button
            className="button-secondary mt-3"
            onClick={() => query.refetch()}
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          <p className="mt-3 text-slate-600">
            {query.data.access
              ? 'Your subscription access is active.'
              : 'No active subscription access. Payment return pages do not activate access; subscription updates appear after processing.'}
          </p>
          {query.data.subscriptions.map((s, i) => (
            <p key={i} className="mt-2 text-sm text-slate-600">
              Status: {s.status.replaceAll('_', ' ')}
              {s.cancelAtPeriodEnd
                ? ' · Cancels at the end of the billing period'
                : ''}
              {s.currentPeriodEnd
                ? ' · Current period ends ' +
                  new Date(s.currentPeriodEnd).toLocaleDateString()
                : ''}
            </p>
          ))}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              className="button"
              disabled={mutation.isPending}
              onClick={() => mutation.mutate('checkout')}
            >
              {mutation.isPending
                ? 'Opening Stripe…'
                : query.data.subscriptions.some(
                      (s) =>
                        !['canceled', 'incomplete_expired'].includes(s.status),
                    )
                  ? 'Manage subscription'
                  : 'Start subscription'}
            </button>
            {query.data.canManage && (
              <button
                className="button-secondary"
                disabled={mutation.isPending}
                onClick={() => mutation.mutate('portal')}
              >
                Billing portal
              </button>
            )}
            <button
              className="button-secondary"
              disabled={query.isFetching}
              onClick={() => query.refetch()}
            >
              Refresh subscription
            </button>
          </div>
        </>
      )}
      {mutation.error && (
        <p role="alert" className="mt-3 text-red-700">
          {mutation.error.message}
        </p>
      )}
    </section>
  );
}
