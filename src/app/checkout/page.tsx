import { redirect } from 'next/navigation';
import { currentUser } from '@/services/auth';
import { SiteShell } from '@/components/site-shell';
import { SubscriptionCheckout } from '@/components/subscription-checkout';
import {
  checkoutPath,
  planIdSchema,
  billingIntervalSchema,
} from '@/lib/subscription-plans';

export const metadata = {
  title: 'Test checkout',
  robots: { index: false, follow: false },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; interval?: string }>;
}) {
  const params = await searchParams;
  const parsed = planIdSchema.safeParse(params.plan);
  const interval = billingIntervalSchema
    .default('monthly')
    .safeParse(params.interval);
  if (!parsed.success || !interval.success) redirect('/#pricing');
  const user = await currentUser();
  if (!user || user.is_anonymous)
    redirect(
      '/signin?next=' +
        encodeURIComponent(checkoutPath(parsed.data, interval.data)),
    );
  return (
    <SiteShell>
      <SubscriptionCheckout
        key={parsed.data + interval.data}
        plan={parsed.data}
        interval={interval.data}
      />
    </SiteShell>
  );
}
