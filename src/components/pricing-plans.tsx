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
  description,
}: {
  plans: PricingPlan[];
  children: ReactNode;
  description: ReactNode;
}) {
  const [interval, setInterval] = useState<BillingInterval>('monthly');
  return (
    <>
      <div className="mb-9 grid gap-6 sm:mb-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-12">
        <div className="min-w-0 max-w-xl">{children}</div>
        <div className="max-w-lg">
          {description}
          <fieldset className="mt-6 flex w-fit gap-1 rounded-full border border-stone-300/70 bg-stone-200/60 p-1">
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
                <span className="block rounded-full px-5 py-2 text-sm font-medium text-stone-600 peer-checked:bg-white peer-checked:text-neutral-950 peer-checked:shadow-sm peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-orange-700">
                  {value === 'monthly' ? 'Monthly' : 'Yearly'}
                </span>
              </label>
            ))}
          </fieldset>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_12px_32px_-20px_rgba(28,25,23,0.18)]">
        <div className="grid md:grid-cols-3">
          {plans.map((plan, index) => {
            const price = plan.prices[interval];
            const formatted = price ? formatRecurringPrice(price) : null;
            return (
              <article
                key={plan.id}
                className={
                  'flex min-w-0 flex-col p-6 sm:p-7 xl:p-8 ' +
                  (index > 0
                    ? 'border-t border-stone-200 md:border-l md:border-t-0'
                    : '')
                }
              >
                <h3 className="text-2xl font-semibold tracking-tight text-neutral-950">
                  {plan.name}
                </h3>
                <p className="mt-3 text-sm leading-6 text-stone-600 md:min-h-12">
                  {plan.description}
                </p>
                <div className="mt-7 min-h-20">
                  <p className="mb-3 text-[11px] font-medium tracking-[0.12em] text-stone-500 uppercase">
                    {interval === 'monthly' ? 'Monthly price' : 'Annual price'}
                  </p>
                  {formatted ? (
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-2">
                      <p className="max-w-full text-4xl font-medium tracking-tight text-neutral-950 wrap-anywhere lg:text-5xl">
                        {formatted.amount}
                      </p>
                      <p className="text-sm text-stone-600">
                        {formatted.interval}
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-2xl font-medium tracking-tight text-stone-600">
                        Not connected
                      </p>
                      <p className="mt-2 text-sm leading-6 text-stone-600">
                        Connect the {interval} price to try Checkout.
                      </p>
                    </>
                  )}
                </div>
                <div className="mt-auto pt-7">
                  <Link
                    href={
                      price
                        ? checkoutPath(plan.id, interval)
                        : '/docs/features/payments'
                    }
                    prefetch={price ? false : undefined}
                    className="flex w-full items-center justify-between gap-3 rounded-lg bg-orange-700 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
                    aria-label={
                      price
                        ? 'Try ' + plan.name + ' ' + interval + ' test checkout'
                        : undefined
                    }
                  >
                    {price ? 'Try ' + plan.name : 'Set up test billing'}
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 shrink-0"
                    />
                  </Link>
                  <p className="mt-3 text-center text-xs leading-5 text-stone-600">
                    {price
                      ? 'Sign-in required · Stripe test mode'
                      : 'Stripe setup guide'}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
        <div className="border-t border-stone-200 bg-stone-50 px-6 py-5 sm:px-7 xl:px-8 lg:flex lg:items-center lg:gap-8">
          <p className="shrink-0 text-xs font-medium text-stone-700">
            Included with every example plan
          </p>
          <ul className="mt-3 flex flex-col gap-3 text-sm text-stone-700 sm:flex-row sm:flex-wrap sm:gap-x-6 lg:mt-0">
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
