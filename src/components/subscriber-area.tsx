import { billing } from '@/services/billing';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
        <Badge variant={access ? 'default' : 'secondary'}>
          {access ? 'Access active' : 'No access'}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          {access
            ? 'Your subscription is active. You can use the subscriber workspace.'
            : 'An active subscription is required to use the subscriber workspace.'}
        </p>
        {access && (
          <p className="text-sm font-medium">Subscription access granted</p>
        )}
        <Button asChild variant="outline" size="sm" className="self-start">
          <Link href="/account#subscription">Manage subscription</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
