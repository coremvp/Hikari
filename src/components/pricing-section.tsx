import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
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
      <div className="-mx-6 bg-stone-100 px-6 py-10 sm:mx-0 sm:rounded-3xl sm:p-8 xl:p-12">
        <PricingPlans
          plans={plans}
          description={
            <p className="text-base leading-7 text-stone-600">
              Choose an example plan and explore Checkout, subscription access
              and Customer Portal. Sign in first; we’ll keep your selection.
            </p>
          }
        >
          <p className="mb-4 text-xs font-semibold tracking-[0.15em] text-orange-700 uppercase">
            Subscriptions
          </p>
          <h2
            id="pricing-title"
            className="max-w-lg text-4xl font-medium leading-[1.05] tracking-[-0.04em] text-neutral-950 sm:text-5xl xl:text-6xl"
          >
            Try subscription billing.
          </h2>
        </PricingPlans>
        <div className="mt-6 flex flex-col gap-4 text-sm leading-6 text-stone-600 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <p className="max-w-3xl">
            These are example subscriptions for testing your application’s
            billing flow.{' '}
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
      </div>
    </section>
  );
}
