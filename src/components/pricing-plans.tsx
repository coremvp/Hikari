'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import {
  checkoutPath,
  formatRecurringPrice,
  billingIntervals,
  type BillingInterval,
  type PricingPlan,
} from '@/lib/subscription-plans';
export function PricingPlans({ plans }: { plans: PricingPlan[] }) {
  const [interval, setInterval] = useState<BillingInterval>('monthly');
  return (
    <>
      <fieldset className="mt-8 flex w-fit gap-1 rounded-full border border-neutral-200 bg-neutral-50 p-1">
        <legend className="sr-only">Billing interval</legend>
        {billingIntervals.map((value) => (
          <label key={value} className="cursor-pointer">
            <input
              type="radio"
              name="billing-interval"
              value={value}
              checked={interval === value}
              onChange={() => setInterval(value)}
              className="peer sr-only"
            />
            <span className="block rounded-full px-5 py-2 text-sm font-medium text-neutral-600 peer-checked:bg-white peer-checked:text-neutral-950 peer-checked:shadow-sm peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-orange-600">
              {value === 'monthly' ? 'Monthly' : 'Yearly'}
            </span>
          </label>
        ))}
      </fieldset>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const price = plan.prices[interval];
          const formatted = price ? formatRecurringPrice(price) : null;
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
              {price ? (
                <Link
                  href={checkoutPath(plan.id, interval)}
                  prefetch={false}
                  className="button mt-auto rounded-lg px-4 py-3 text-center text-sm font-medium"
                  aria-label={
                    'Try ' + plan.name + ' ' + interval + ' test checkout'
                  }
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
                {price
                  ? 'Sign-in required · Stripe test mode'
                  : 'Connect the ' + interval + ' price to try Checkout.'}
              </p>
            </article>
          );
        })}
      </div>
    </>
  );
}
