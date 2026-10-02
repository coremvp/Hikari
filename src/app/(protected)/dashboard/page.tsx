import { SubscriberArea } from '@/components/subscriber-area';
import { DashboardProjects } from '@/components/dashboard-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { requireUser } from '@/services/auth';
export default async function Dashboard() {
  const user = await requireUser();
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Your workspace
        </h1>
        <p className="text-muted-foreground">
          Your account is ready. Build from here.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <CardTitle role="heading" aria-level={2}>
              Account
            </CardTitle>
            <Badge variant="secondary">Signed in</Badge>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="break-all text-sm text-muted-foreground">
              {user.email}
            </p>
            <Button asChild variant="outline" size="sm" className="self-start">
              <Link href="/account">Manage account</Link>
            </Button>
          </CardContent>
        </Card>
        <SubscriberArea userId={user.id} />
      </div>
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
