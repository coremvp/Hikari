import { redirect } from 'next/navigation';
import { currentUser } from '@/services/auth';
import { SiteShell } from '@/components/site-shell';
import { SubscriptionCheckout } from '@/components/subscription-checkout';
import { checkoutPath, planIdSchema } from '@/lib/subscription-plans';

export const metadata = {
  title: 'Test checkout',
  robots: { index: false, follow: false },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const parsed = planIdSchema.safeParse((await searchParams).plan);
  if (!parsed.success) redirect('/#pricing');
  const user = await currentUser();
  if (!user || user.is_anonymous)
    redirect('/signin?next=' + encodeURIComponent(checkoutPath(parsed.data)));
  return (
    <SiteShell>
      <SubscriptionCheckout key={parsed.data} plan={parsed.data} />
    </SiteShell>
  );
}
