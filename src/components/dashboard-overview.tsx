import type { ReactNode } from 'react';
import { DashboardProjects } from '@/components/dashboard-shell';
import { DashboardAnalytics } from '@/components/dashboard-analytics';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, Code2, CreditCard, UserRound } from 'lucide-react';
import Link from 'next/link';
export function DashboardOverview({
  email,
  subscription,
  preview = false,
}: {
  email: string;
  subscription: ReactNode;
  preview?: boolean;
}) {
  const Heading = preview ? 'h3' : 'h1';
  return (
    <>
      <div className="flex flex-col gap-2">
        <Heading
          id={preview ? 'dashboard-preview-overview' : undefined}
          className="text-3xl font-semibold tracking-tight"
        >
          Welcome back
        </Heading>
        <p className="text-muted-foreground">
          Your account, subscriptions, and application at a glance.
        </p>
      </div>
      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold">Your access</h2>
              <Badge variant="secondary">Individual account</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Manage your account and subscription in one place.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="self-start sm:self-auto"
          >
            <Link href="/account">
              {preview ? 'Manage account · sign in required' : 'Manage account'}
            </Link>
          </Button>
        </CardContent>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <CardTitle role="heading" aria-level={2}>
              Account
            </CardTitle>
            <UserRound
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <p className="text-2xl font-semibold tracking-tight">
              {preview ? 'Example account' : 'Active'}
            </p>
            <p className="break-all text-sm text-muted-foreground">{email}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <CardTitle role="heading" aria-level={2}>
              Source code
            </CardTitle>
            <Code2
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <p className="text-2xl font-semibold tracking-tight">
              MIT licensed
            </p>
            <p className="text-sm text-muted-foreground">
              Free and open source
            </p>
          </CardContent>
        </Card>
        {subscription}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <CardTitle role="heading" aria-level={2}>
              Billing
            </CardTitle>
            <CreditCard
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <p className="text-2xl font-semibold tracking-tight">Stripe</p>
            <p className="text-sm text-muted-foreground">
              Checkout and Customer Portal
            </p>
          </CardContent>
        </Card>
      </div>
      <DashboardAnalytics />
      <DashboardProjects />
      <section aria-labelledby="build-title" className="flex flex-col gap-3">
        <h2 id="build-title" className="text-lg font-semibold">
          Keep building
        </h2>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/docs/getting-started/project-structure">
              Explore the code <ArrowUpRight data-icon="inline-end" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/docs/features/payments">
              Set up payments <ArrowUpRight data-icon="inline-end" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/docs/deployment/vercel">
              Deploy your app <ArrowUpRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
