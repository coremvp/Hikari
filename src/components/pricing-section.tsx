import Link from 'next/link';
import { billing } from '@/services/billing';
import { PricingPlans } from '@/components/pricing-plans';

export async function PricingSection() {
  const plans = await billing.plans();
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="hikari-section scroll-mt-8"
    >
      <h2
        id="pricing-title"
        className="text-3xl font-medium leading-tight tracking-tight sm:text-4xl"
      >
        Try subscription billing.
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-600">
        Choose an example plan and explore Checkout, subscription access and
        Customer Portal. Sign in first; we’ll keep your selection.
      </p>
      <PricingPlans plans={plans} />
      <p className="mt-6 max-w-3xl text-sm leading-6 text-neutral-600">
        These are example subscriptions for testing your application’s billing
        flow. Hikari’s source is free under MIT.{' '}
        <Link
          href="/docs/features/payments"
          className="underline underline-offset-4"
        >
          Make billing your own
        </Link>
        .
      </p>
    </section>
  );
}
