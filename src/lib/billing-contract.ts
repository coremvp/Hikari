import { z } from 'zod';
export const subscriptionStatus = z.enum([
  'active',
  'trialing',
  'incomplete',
  'incomplete_expired',
  'past_due',
  'unpaid',
  'paused',
  'canceled',
]);
export type SubscriptionStatus = z.infer<typeof subscriptionStatus>;
export type SubscriptionState = {
  id: string;
  customerId: string;
  status: SubscriptionStatus;
  priceId: string | null;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: Date | null;
};
export function hasSubscriptionAccess(
  subscriptions: SubscriptionState[],
  approvedPrice: string,
) {
  return (
    !!approvedPrice &&
    subscriptions.some(
      (s) =>
        ['active', 'trialing'].includes(s.status) &&
        s.priceId === approvedPrice,
    )
  );
}
export function needsManagement(
  subscriptions: { status: SubscriptionStatus }[],
) {
  return subscriptions.some(
    (s) => !['canceled', 'incomplete_expired'].includes(s.status),
  );
}
export const billingViewSchema = z.object({
  access: z.boolean(),
  canManage: z.boolean(),
  subscriptions: z.array(
    z.object({
      status: subscriptionStatus,
      cancelAtPeriodEnd: z.boolean(),
      currentPeriodEnd: z.string().nullable(),
    }),
  ),
});
export type BillingView = z.infer<typeof billingViewSchema>;
