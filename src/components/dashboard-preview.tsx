import { Box } from 'lucide-react';
import { DashboardOverview } from '@/components/dashboard-overview';
import { DashboardShell } from '@/components/dashboard-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DashboardPreview() {
  return (
    <section
      id="dashboard-preview"
      aria-labelledby="dashboard-preview-title"
      aria-describedby="dashboard-preview-description"
      className="mt-8"
    >
      <div className="mb-4 flex flex-col gap-2">
        <h2
          id="dashboard-preview-title"
          className="text-xl font-semibold tracking-tight"
        >
          Try the Dashboard
        </h2>
        <p
          id="dashboard-preview-description"
          className="text-sm leading-6 text-neutral-600"
        >
          Explore chart values and switch example workspaces and projects. No
          account needed. This preview uses sample data; nothing is saved.
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
    </section>
  );
}
