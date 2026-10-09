import { z } from 'zod';
import { subscriptionTiers } from '@/config/pricing.config';

export const planIdSchema = z.enum(['starter', 'pro', 'business']);
export type PlanId = z.infer<typeof planIdSchema>;
export const billingIntervalSchema = z.enum(['monthly', 'yearly']);
export type BillingInterval = z.infer<typeof billingIntervalSchema>;
export const billingIntervals = billingIntervalSchema.options;
export type PlanPrices = Partial<
  Record<PlanId, Partial<Record<BillingInterval, string>>>
>;
const descriptions: Record<PlanId, string> = {
  starter: 'A starting point for your next idea.',
  pro: 'A plan to shape around your growing product.',
  business: 'Room to explore your next stage.',
};
export const subscriptionPlans = subscriptionTiers.map((tier) => {
  const id = planIdSchema.parse(tier.id.replace(/^tier-/, ''));
  return { ...tier, id, description: descriptions[id] };
});
export const configuredSubscriptionPrices: PlanPrices = Object.fromEntries(
  subscriptionPlans.map((plan) => [
    plan.id,
    { monthly: plan.priceIdMonthly, yearly: plan.priceIdYearly },
  ]),
);

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
