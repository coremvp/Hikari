'use client';
import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import {
  getSubscriptionPriceDisplay,
  getSubscriptionSavingsLabel,
} from '@/config/pricing.config';
import {
  checkoutPath,
  billingIntervals,
  type BillingInterval,
  type subscriptionPlans,
} from '@/lib/subscription-plans';
export function PricingPlans({
  plans,
  children,
  description,
}: {
  plans: typeof subscriptionPlans;
  children: ReactNode;
  description: ReactNode;
}) {
  const [interval, setInterval] = useState<BillingInterval>('yearly');
  const savingsLabel = getSubscriptionSavingsLabel(plans);
  return (
    <>
      <div className="mx-auto max-w-3xl text-center">
        {children}
        <div className="mx-auto mt-5 max-w-2xl">{description}</div>
      </div>
      <div className="relative mt-10 flex justify-center sm:mt-12">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-1/2 h-px bg-stone-200"
        />
        <fieldset className="relative flex w-fit gap-1 rounded-full border border-stone-200 bg-stone-100 p-1 shadow-sm">
          <legend className="sr-only">Billing interval</legend>
          {billingIntervals.map((value) => (
            <label key={value} className="cursor-pointer">
              <input
                type="radio"
                name="billing-interval"
                value={value}
                aria-label={value === 'monthly' ? 'Monthly' : 'Yearly'}
                aria-describedby={
                  value === 'yearly' && savingsLabel
                    ? 'yearly-discount'
                    : undefined
                }
                checked={interval === value}
                onChange={() => setInterval(value)}
                className="peer sr-only"
              />
              <span className="flex items-center gap-2 rounded-full px-3 py-2.5 text-sm font-medium text-stone-600 peer-checked:bg-white peer-checked:text-neutral-950 peer-checked:shadow-sm peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-orange-700 sm:px-5">
                {value === 'monthly' ? 'Monthly' : 'Yearly'}
                {value === 'yearly' && savingsLabel && (
                  <span
                    id="yearly-discount"
                    title="Compared with twelve monthly payments."
                    className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-orange-800"
                  >
                    {savingsLabel}
                  </span>
                )}
              </span>
            </label>
          ))}
        </fieldset>
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-3 lg:items-start lg:gap-6">
        {plans.map((plan) => {
          const formatted = getSubscriptionPriceDisplay(plan, interval);
          const featured = plan.featured;
          return (
            <article
              key={plan.id}
              className={
                'min-w-0 overflow-hidden rounded-2xl border ' +
                (featured
                  ? 'border-orange-200 bg-white shadow-[0_12px_28px_-16px_rgba(28,25,23,0.2)]'
                  : 'border-stone-200 bg-stone-100/70')
              }
            >
              <div className="px-6 pt-7 pb-6 sm:px-8 lg:px-6 xl:px-8">
                <div className="flex min-h-8 flex-wrap items-center gap-3">
                  <h3 className="text-xl font-medium tracking-tight text-neutral-950">
                    {plan.name}
                  </h3>
                  {featured && (
                    <span className="rounded-full border border-orange-600 bg-orange-700 px-3 py-1 text-sm font-medium leading-5 text-white shadow-sm">
                      Popular
                    </span>
                  )}
                </div>
                <div className="mt-7 min-h-20">
                  <p className="mb-2 text-xs font-medium text-stone-500">
                    Monthly price
                  </p>
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-2">
                    <p className="max-w-full text-5xl font-semibold tracking-[-0.04em] text-neutral-950 wrap-anywhere">
                      {formatted.amount}
                    </p>
                    <p className="text-sm text-stone-600">
                      {formatted.interval}
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-5 text-stone-600">
                    {formatted.billingNote}
                  </p>
                </div>
                <p className="mt-5 text-base leading-6 text-stone-600 lg:min-h-12">
                  {plan.description}
                </p>
                <div className="mt-7">
                  <Link
                    href={checkoutPath(plan.id, interval)}
                    prefetch={false}
                    className={
                      'flex min-h-12 w-full items-center justify-center rounded-full px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 ' +
                      (featured
                        ? 'bg-orange-700 text-white shadow-sm hover:bg-orange-800'
                        : plan.id === 'business'
                          ? 'bg-neutral-900 text-white shadow-sm hover:bg-neutral-800'
                          : 'border border-stone-200 bg-white text-neutral-950 shadow-sm hover:bg-stone-50')
                    }
                    aria-label={
                      'Try ' + plan.name + ' ' + interval + ' test checkout'
                    }
                  >
                    {'Try ' + plan.name}
                  </Link>
                  <p className="mt-3 text-center text-xs leading-5 text-stone-600">
                    Sign-in required · Stripe test mode
                  </p>
                </div>
              </div>
              <div className="border-t border-stone-200 px-6 py-6 sm:px-8 lg:px-6 xl:px-8">
                <p className="text-sm font-medium text-neutral-950">
                  Included with every example plan
                </p>
                <ul className="mt-5 flex flex-col gap-4 text-sm leading-5 text-stone-700">
                  {[
                    'Stripe test Checkout',
                    'Monthly and yearly billing',
                    'Subscription status in Account',
                    'Access synced by webhooks',
                    'Customer billing portal',
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span
                        className={
                          'flex size-5 shrink-0 items-center justify-center rounded-full ' +
                          (featured
                            ? 'bg-orange-100 text-orange-800'
                            : 'border border-stone-300 text-stone-600')
                        }
                      >
                        <Check aria-hidden="true" className="size-3" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
