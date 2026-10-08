import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { subscriptionPlans } from '@/lib/subscription-plans';
import { PricingPlans } from '@/components/pricing-plans';
import { SectionHeading } from '@/components/section-heading';

export function PricingSection() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="hikari-section scroll-mt-8"
    >
      <PricingPlans
        plans={subscriptionPlans}
        description={
          <p className="text-base leading-7 text-stone-600">
            Pick an example plan. Sign in to try Checkout.
          </p>
        }
      >
        <SectionHeading
          id="pricing-title"
          title="Try subscription billing."
          subtitle="Make it your own."
        />
      </PricingPlans>
      <div className="mt-7 flex flex-col items-center gap-3 text-center text-sm leading-6 text-stone-600">
        <p className="max-w-2xl">
          Three example plans, one feature set. Shape them around your product.{' '}
          <span className="font-medium text-stone-900">
            Hikari’s source is free under MIT.
          </span>
        </p>
        <Link
          href="/docs/features/payments"
          className="inline-flex w-fit shrink-0 items-center gap-1 font-medium text-stone-900 underline underline-offset-4"
        >
          Make billing your own
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </section>
  );
}
