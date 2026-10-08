import { Box } from 'lucide-react';
import Link from 'next/link';
import { DashboardOverview } from '@/components/dashboard-overview';
import { DashboardShell } from '@/components/dashboard-shell';
import { SectionHeading } from '@/components/section-heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DashboardPreview() {
  return (
    <section
      id="dashboard-preview"
      aria-labelledby="dashboard-preview-title"
      aria-describedby="dashboard-preview-description"
      className="hikari-section"
    >
      <div className="mx-auto mb-10 flex max-w-5xl flex-col gap-4 text-center">
        <SectionHeading
          id="dashboard-preview-title"
          title="Try the Dashboard."
          subtitle="No account needed."
        />
        <p
          id="dashboard-preview-description"
          className="mx-auto max-w-3xl text-base leading-7 text-neutral-600"
        >
          Explore chart values and switch example workspaces and projects. This
          preview uses sample data; nothing is saved.
        </p>
      </div>
      <div className="relative isolate h-[40rem] overflow-hidden rounded-xl border border-neutral-200 text-left">
        <DashboardShell email="builder@example.test" preview>
          <DashboardOverview
            email="builder@example.test"
            preview
            subscription={
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-3">
                  <CardTitle role="heading" aria-level={3}>
                    Subscription
                  </CardTitle>
                  <Box
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                </CardHeader>
                <CardContent className="flex flex-col gap-1">
                  <p className="text-2xl font-semibold tracking-tight">
                    No access
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Example state · no subscription connected.
                  </p>
                </CardContent>
              </Card>
            }
          />
        </DashboardShell>
      </div>
      <div className="mt-6 grid gap-5 text-sm leading-6 text-neutral-600 sm:grid-cols-3">
        <p>
          <strong className="font-medium text-neutral-900">
            Your account.
          </strong>{' '}
          Signup opens Dashboard. Signed-in account summaries use your real
          account state.
        </p>
        <p>
          <strong className="font-medium text-neutral-900">
            Your subscription.
          </strong>{' '}
          Account holds Checkout and Portal controls once Stripe is configured.
          Access comes from persisted subscription state.
        </p>
        <p>
          <strong className="font-medium text-neutral-900">
            Your product.
          </strong>{' '}
          Charts and Organization/Project selectors are illustrative. See{' '}
          <Link
            href="/docs/getting-started/project-structure"
            className="underline underline-offset-4"
          >
            Project structure
          </Link>{' '}
          for the features and authorization you add.
        </p>
      </div>
    </section>
  );
}
