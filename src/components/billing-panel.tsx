'use client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { request } from '@/lib/client';
import { billingViewSchema } from '@/lib/billing-contract';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
    <Card id="subscription" className="scroll-mt-6">
      <CardHeader>
        <CardTitle role="heading" aria-level={2}>
          Subscription
        </CardTitle>
        <CardDescription>Manage your subscription with Stripe.</CardDescription>
      </CardHeader>
      <CardContent>
        {query.isPending ? (
          <p role="status" className="text-sm text-muted-foreground">
            Loading subscription…
          </p>
        ) : query.isError ? (
          <div>
            <p role="alert" className="text-destructive">
              {query.error.message}
            </p>
            <Button
              variant="outline"
              className="mt-3"
              onClick={() => query.refetch()}
            >
              Try again
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {query.data.access
                ? 'Your subscription access is active.'
                : 'No active subscription access. Payment return pages do not activate access; subscription updates appear after processing.'}
            </p>
            {query.data.subscriptions.map((s, i) => (
              <p key={i} className="mt-2 text-sm text-muted-foreground">
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
              <Button
                disabled={mutation.isPending}
                onClick={() => mutation.mutate('checkout')}
              >
                {mutation.isPending
                  ? 'Opening Stripe…'
                  : query.data.subscriptions.some(
                        (s) =>
                          !['canceled', 'incomplete_expired'].includes(
                            s.status,
                          ),
                      )
                    ? 'Manage subscription'
                    : 'Start subscription'}
              </Button>
              {query.data.canManage && (
                <Button
                  variant="outline"
                  disabled={mutation.isPending}
                  onClick={() => mutation.mutate('portal')}
                >
                  Billing portal
                </Button>
              )}
              <Button
                variant="outline"
                disabled={query.isFetching}
                onClick={() => query.refetch()}
              >
                Refresh subscription
              </Button>
            </div>
          </>
        )}
        {mutation.error && (
          <p role="alert" className="mt-3 text-sm text-destructive">
            {mutation.error.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
