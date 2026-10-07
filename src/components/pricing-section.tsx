import Link from 'next/link';
import { Check } from 'lucide-react';
import { billing } from '@/services/billing';
import { checkoutPath, formatRecurringPrice } from '@/lib/subscription-plans';

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
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const formatted = plan.price
            ? formatRecurringPrice(plan.price)
            : null;
          return (
            <article
              key={plan.id}
              className={
                'flex flex-col rounded-2xl border p-7 sm:p-8 ' +
                (plan.id === 'pro'
                  ? 'border-orange-500 bg-orange-50/30'
                  : 'border-neutral-200 bg-white')
              }
            >
              <h3 className="text-xl font-medium tracking-tight">
                {plan.name}
              </h3>
              <div className="mt-6 min-h-20">
                {formatted ? (
                  <>
                    <p className="text-4xl font-medium tracking-tight">
                      {formatted.amount}
                    </p>
                    <p className="mt-2 text-sm text-neutral-600">
                      {formatted.interval}
                    </p>
                  </>
                ) : (
                  <p className="text-lg font-medium text-neutral-600">
                    Test plan unavailable
                  </p>
                )}
              </div>
              <p className="mt-5 text-sm leading-6 text-neutral-600">
                {plan.description}
              </p>
              <ul className="my-7 space-y-3 border-t border-neutral-200 pt-6 text-sm">
                {[
                  'Stripe Checkout',
                  'Saved subscription access',
                  'Customer billing portal',
                ].map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <Check
                      aria-hidden="true"
                      className="size-4 shrink-0 text-orange-600"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              {plan.price ? (
                <Link
                  href={checkoutPath(plan.id)}
                  prefetch={false}
                  className="button mt-auto rounded-lg px-4 py-3 text-center text-sm font-medium"
                  aria-label={'Try ' + plan.name + ' test checkout'}
                >
                  Try test checkout
                </Link>
              ) : (
                <Link
                  href="/docs/features/payments"
                  className="mt-auto rounded-lg border border-neutral-200 px-4 py-3 text-center text-sm font-medium"
                >
                  Set up test billing
                </Link>
              )}
              <p className="mt-3 text-center text-xs leading-5 text-neutral-600">
                {plan.price
                  ? 'Sign-in required · Stripe test mode'
                  : 'Connect this plan to try Checkout.'}
              </p>
            </article>
          );
        })}
      </div>
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
