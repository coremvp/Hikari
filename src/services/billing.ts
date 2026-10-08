import 'server-only';
import { BillingRepository, type BillingStore } from '@/repositories/billing';
import { StripeProvider, type BillingProvider } from '@/providers/stripe';
import {
  hasSubscriptionAccess,
  needsManagement,
  type BillingView,
} from '@/lib/billing-contract';
import { appUrl } from '@/lib/config';
import { AppError } from '@/lib/errors';
import {
  subscriptionPlans,
  configuredSubscriptionPrices,
  billingIntervals,
  type PlanId,
  type PlanPrices,
  type BillingInterval,
  type PricingPlan,
} from '@/lib/subscription-plans';
const lifecycleEvents = new Set([
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'customer.subscription.paused',
  'customer.subscription.resumed',
]);
export class BillingService {
  constructor(
    private store: BillingStore,
    private provider: BillingProvider,
    private prices: () => PlanPrices,
    private origin: () => string,
  ) {}
  async view(userId: string): Promise<BillingView> {
    const customer = await this.store.customerForUser(userId);
    const states = customer
      ? await this.store.subscriptions(customer.stripeCustomerId)
      : [];
    return {
      access: hasSubscriptionAccess(
        states,
        Object.values(this.prices()).flatMap((prices) => Object.values(prices)),
      ),
      canManage: !!customer,
      subscriptions: states.map((s) => ({
        status: s.status,
        cancelAtPeriodEnd: s.cancelAtPeriodEnd,
        currentPeriodEnd: s.currentPeriodEnd?.toISOString() ?? null,
      })),
    };
  }
  async requireAccess(userId: string) {
    if (!(await this.view(userId)).access)
      throw new AppError(403, 'An active subscription is required.');
  }
  private async quote(priceId: string, interval: BillingInterval) {
    const price = await this.provider.recurringPrice(priceId);
    if (
      price.interval !== (interval === 'monthly' ? 'month' : 'year') ||
      price.intervalCount !== 1
    )
      throw new AppError(
        503,
        'The subscription price does not match the selected billing interval.',
      );
    return price;
  }
  async plans(): Promise<PricingPlan[]> {
    const configured = this.prices();
    return Promise.all(
      subscriptionPlans.map(async (plan) => {
        const prices = await Promise.all(
          billingIntervals.map(async (interval) => {
            const priceId = configured[plan.id]?.[interval];
            if (!priceId) return null;
            try {
              const price = await this.quote(priceId, interval);
              return price.livemode ? null : price;
            } catch {
              return null;
            }
          }),
        );
        return {
          id: plan.id,
          name: plan.name,
          description: plan.description,
          prices: { monthly: prices[0], yearly: prices[1] },
        };
      }),
    );
  }
  async checkout(
    user: { id: string; email: string },
    plan: PlanId = 'starter',
    demo = false,
    interval: BillingInterval = 'monthly',
  ) {
    return this.store.withLock('hikari:checkout:' + user.id, async (store) => {
      const approvedPrice = this.prices()[plan]?.[interval];
      if (!approvedPrice)
        throw new AppError(
          503,
          'This subscription plan is not configured yet.',
        );
      // Read fresh provider truth before any mutation, even if the pricing card is cached.
      if (demo) {
        const price = await this.quote(approvedPrice, interval);
        if (price.livemode)
          throw new AppError(
            409,
            'Test checkout is unavailable. No subscription was created.',
          );
      }
      let customer = await store.customerForUser(user.id);
      if (!customer) {
        const stripeCustomerId = await this.provider.createCustomer(
          user.id,
          user.email,
        );
        customer = { userId: user.id, stripeCustomerId };
        await store.saveCustomer(customer);
      }
      const local = await store.subscriptions(customer.stripeCustomerId);
      if (
        needsManagement(local) ||
        needsManagement(
          await this.provider.currentSubscriptions(customer.stripeCustomerId),
        )
      )
        return {
          url: await this.provider.portal(
            customer.stripeCustomerId,
            this.origin(),
          ),
          destination: 'portal' as const,
        };
      if (!demo) await this.quote(approvedPrice, interval);
      const url =
        (await this.provider.openCheckout(
          customer.stripeCustomerId,
          approvedPrice,
        )) ??
        (await this.provider.checkout(
          customer.stripeCustomerId,
          approvedPrice,
          this.origin(),
        ));
      return { url, destination: 'checkout' as const };
    });
  }
  async portal(userId: string) {
    const customer = await this.store.customerForUser(userId);
    if (!customer)
      throw new AppError(
        409,
        'Start a subscription before opening billing management.',
      );
    return {
      url: await this.provider.portal(customer.stripeCustomerId, this.origin()),
    };
  }
  async webhook(raw: string, signature: string) {
    const event = await this.provider.verify(raw, signature);
    if (!lifecycleEvents.has(event.type))
      return { received: true, outcome: 'ignored' as const };
    if (!event.subscriptionId)
      throw new AppError(400, 'Invalid subscription event.');
    try {
      return await this.store.withLock(
        'hikari:subscription:' + event.subscriptionId,
        async (store) => {
          const state = await this.provider.currentSubscription(
            event.subscriptionId!,
          );
          if (!(await store.customerForStripe(state.customerId)))
            return { received: true, outcome: 'ignored' as const };
          await store.saveSubscription(state);
          return { received: true, outcome: 'synced' as const };
        },
      );
    } catch (error) {
      console.error('Subscription synchronization failed', {
        eventId: event.id,
        subscriptionId: event.subscriptionId,
        type: error instanceof Error ? error.name : 'unknown',
      });
      throw new AppError(
        503,
        'Subscription synchronization failed. Retry delivery.',
      );
    }
  }
}
export const billing = new BillingService(
  new BillingRepository(),
  new StripeProvider(),
  () => configuredSubscriptionPrices,
  appUrl,
);
