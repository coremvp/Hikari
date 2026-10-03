import { billing } from '@/services/billing';
import Link from 'next/link';
import { Box } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
export async function SubscriberArea({ userId }: { userId: string }) {
  let access: boolean;
  try {
    access = (await billing.view(userId)).access;
  } catch {
    return (
      <p role="alert" className="text-sm text-destructive">
        Subscription status is temporarily unavailable. Please try again.
      </p>
    );
  }
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle role="heading" aria-level={2}>
          Subscription
        </CardTitle>
        <Box className="size-4 text-muted-foreground" aria-hidden="true" />
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <p className="text-2xl font-semibold tracking-tight">
          {access ? 'Active' : 'No access'}
        </p>
        <p className="text-sm text-muted-foreground">
          {access
            ? 'Subscription access granted'
            : 'An active subscription is required.'}
        </p>
        <Link
          href="/account#subscription"
          className="mt-2 text-sm underline underline-offset-4"
        >
          Manage subscription
        </Link>
      </CardContent>
    </Card>
  );
}
