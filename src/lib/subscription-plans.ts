import { z } from 'zod';

export const planIdSchema = z.enum(['starter', 'pro', 'business']);
export type PlanId = z.infer<typeof planIdSchema>;
export const billingIntervalSchema = z.enum(['monthly', 'yearly']);
export type BillingInterval = z.infer<typeof billingIntervalSchema>;
export const billingIntervals = billingIntervalSchema.options;
export type PlanPrices = Partial<
  Record<PlanId, Partial<Record<BillingInterval, string>>>
>;
export const subscriptionPlans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'A starting point for your next idea.',
    env: { monthly: 'STRIPE_PRICE_ID', yearly: 'STRIPE_YEARLY_PRICE_ID' },
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'A plan to shape around your growing product.',
    env: {
      monthly: 'STRIPE_PRO_PRICE_ID',
      yearly: 'STRIPE_PRO_YEARLY_PRICE_ID',
    },
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Room to explore your next stage.',
    env: {
      monthly: 'STRIPE_BUSINESS_PRICE_ID',
      yearly: 'STRIPE_BUSINESS_YEARLY_PRICE_ID',
    },
  },
] as const;

export function checkoutPath(
  plan: PlanId,
  interval: BillingInterval = 'monthly',
) {
  return (
    '/checkout?plan=' + plan + (interval === 'yearly' ? '&interval=yearly' : '')
  );
}

export const checkoutNextSchema = z.enum([
  '/checkout?plan=starter',
  '/checkout?plan=pro',
  '/checkout?plan=business',
  '/checkout?plan=starter&interval=yearly',
  '/checkout?plan=pro&interval=yearly',
  '/checkout?plan=business&interval=yearly',
]);

export function checkoutNext(value: unknown): string | null {
  const result = checkoutNextSchema.safeParse(value);
  return result.success ? result.data : null;
}

export function authDestination(value: unknown) {
  return checkoutNext(value) ?? '/dashboard';
}

export const checkoutInputSchema = z
  .object({
    plan: planIdSchema.default('starter'),
    interval: billingIntervalSchema.default('monthly'),
    demo: z.boolean().default(false),
  })
  .strict();

export type RecurringPrice = {
  currency: string;
  amount: number;
  interval: 'day' | 'week' | 'month' | 'year';
  intervalCount: number;
  livemode: boolean;
};
export type PricingPlan = Pick<
  (typeof subscriptionPlans)[number],
  'id' | 'name' | 'description'
> & {
  prices: Record<BillingInterval, RecurringPrice | null>;
};

export function yearlyDiscount(
  plans: PricingPlan[],
  examplePercentage?: number,
) {
  const discounts = plans.flatMap(({ prices: { monthly, yearly } }) => {
    if (
      !monthly ||
      !yearly ||
      monthly.livemode ||
      yearly.livemode ||
      monthly.currency.toLowerCase() !== yearly.currency.toLowerCase() ||
      monthly.interval !== 'month' ||
      yearly.interval !== 'year' ||
      monthly.intervalCount !== 1 ||
      yearly.intervalCount !== 1 ||
      !Number.isSafeInteger(monthly.amount * 12) ||
      !Number.isSafeInteger(yearly.amount) ||
      monthly.amount <= 0 ||
      yearly.amount < 0
    )
      return [];
    const annualMonthlyTotal = monthly.amount * 12;
    // Round down so the badge never promises more than the quoted saving.
    return [
      Math.max(
        0,
        Math.floor(
          ((annualMonthlyTotal - yearly.amount) / annualMonthlyTotal) * 100,
        ),
      ),
    ];
  });
  if (!discounts.length)
    return examplePercentage !== undefined &&
      Number.isInteger(examplePercentage) &&
      examplePercentage > 0 &&
      examplePercentage <= 100 &&
      plans.length > 0 &&
      plans.every((plan) => !plan.prices.yearly)
      ? { percentage: examplePercentage, upTo: false }
      : null;
  const percentage = Math.max(...discounts);
  return {
    percentage,
    upTo:
      discounts.length !== plans.length ||
      discounts.some((discount) => discount !== percentage),
  };
}

// Stripe charge amounts use these currencies without decimal minor units.
const zeroDecimalCurrencies = new Set([
  'bif',
  'clp',
  'djf',
  'gnf',
  'jpy',
  'kmf',
  'krw',
  'mga',
  'pyg',
  'rwf',
  'vnd',
  'vuv',
  'xaf',
  'xof',
  'xpf',
]);

export function formatRecurringPrice(price: RecurringPrice) {
  return {
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currency.toUpperCase(),
    }).format(
      price.amount /
        (zeroDecimalCurrencies.has(price.currency.toLowerCase()) ? 1 : 100),
    ),
    interval:
      price.intervalCount === 1
        ? 'per ' + price.interval
        : 'every ' + price.intervalCount + ' ' + price.interval + 's',
  };
}
