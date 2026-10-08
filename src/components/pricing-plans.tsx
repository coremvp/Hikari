'use client';
import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import {
  checkoutPath,
  formatRecurringPrice,
  billingIntervals,
  type BillingInterval,
  type PricingPlan,
} from '@/lib/subscription-plans';
export function PricingPlans({
  plans,
  children,
}: {
  plans: PricingPlan[];
  children: ReactNode;
}) {
  const [interval, setInterval] = useState<BillingInterval>('monthly');
  return (
    <>
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 max-w-2xl">{children}</div>
        <fieldset className="flex w-fit shrink-0 gap-1 rounded-full border border-neutral-200 bg-neutral-50 p-1">
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
      </div>
      <div className="overflow-hidden rounded-xl border border-neutral-200">
        <div className="grid bg-stone-50/70 md:grid-cols-3">
          {plans.map((plan, index) => {
            const price = plan.prices[interval];
            const formatted = price ? formatRecurringPrice(price) : null;
            return (
              <article
                key={plan.id}
                className={
                  'flex min-w-0 flex-col p-6 sm:p-8 ' +
                  (index > 0
                    ? 'border-t border-neutral-200 md:border-l md:border-t-0'
                    : '')
                }
              >
                <h3 className="text-xl font-medium tracking-tight">
                  {plan.name}
                </h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600 md:min-h-12">
                  {plan.description}
                </p>
                <div className="mt-6 min-h-16">
                  {formatted ? (
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <p className="max-w-full text-4xl font-medium tracking-tight wrap-anywhere">
                        {formatted.amount}
                      </p>
                      <p className="text-sm text-neutral-600">
                        {formatted.interval}
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-lg font-medium">
                        Test plan unavailable
                      </p>
                      <p className="mt-2 text-sm leading-6 text-neutral-600">
                        Connect the {interval} price to try Checkout.
                      </p>
                    </>
                  )}
                </div>
                <div className="mt-auto pt-6">
                  {price ? (
                    <Link
                      href={checkoutPath(plan.id, interval)}
                      prefetch={false}
                      className="button flex w-full items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm font-medium"
                      aria-label={
                        'Try ' + plan.name + ' ' + interval + ' test checkout'
                      }
                    >
                      Try {plan.name}
                      <ArrowRight
                        aria-hidden="true"
                        className="size-4 shrink-0"
                      />
                    </Link>
                  ) : (
                    <Link
                      href="/docs/features/payments"
                      className="flex w-full items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm font-medium transition-colors hover:border-neutral-300 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                    >
                      Set up test billing
                      <ArrowRight
                        aria-hidden="true"
                        className="size-4 shrink-0"
                      />
                    </Link>
                  )}
                  <p className="mt-2 text-center text-xs leading-5 text-neutral-600">
                    {price
                      ? 'Sign-in required · Stripe test mode'
                      : 'Stripe setup guide'}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
        <div className="border-t border-neutral-200 bg-white p-6 sm:px-8">
          <p className="text-xs text-neutral-600">
            Included with every example plan
          </p>
          <ul className="mt-3 flex flex-col gap-3 text-sm sm:flex-row sm:flex-wrap sm:gap-x-8">
            {[
              'Stripe Checkout',
              'Saved subscription access',
              'Customer billing portal',
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <Check
                  aria-hidden="true"
                  className="size-4 shrink-0 text-orange-600"
                />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
