import 'server-only';
import Stripe from 'stripe';
import { z } from 'zod';
import { AppError } from '@/lib/errors';
import {
  subscriptionStatus,
  type SubscriptionState,
} from '@/lib/billing-contract';
export interface BillingProvider {
  createCustomer(userId: string, email: string): Promise<string>;
  currentSubscriptions(customerId: string): Promise<SubscriptionState[]>;
  currentSubscription(id: string): Promise<SubscriptionState>;
  recurringPrice(id: string): Promise<void>;
  openCheckout(customerId: string, priceId: string): Promise<string | null>;
  checkout(
    customerId: string,
    priceId: string,
    origin: string,
  ): Promise<string>;
  portal(customerId: string, origin: string): Promise<string>;
  verify(
    raw: string,
    signature: string,
  ): Promise<{ id: string; type: string; subscriptionId: string | null }>;
}
export function mapSubscription(
  subscription: Stripe.Subscription,
): SubscriptionState {
  const item = subscription.items.data[0];
  const validItem =
    !subscription.items.has_more &&
    subscription.items.data.length === 1 &&
    item?.price.type === 'recurring';
  return {
    id: subscription.id,
    customerId:
      typeof subscription.customer === 'string'
        ? subscription.customer
        : subscription.customer.id,
    status: subscriptionStatus.parse(subscription.status),
    priceId: validItem ? item.price.id : null,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    currentPeriodEnd:
      validItem && item.current_period_end
        ? new Date(item.current_period_end * 1000)
        : null,
  };
}
export class StripeProvider implements BillingProvider {
  constructor(private clientFactory?: () => Stripe) {}
  private get client() {
    if (this.clientFactory) return this.clientFactory();
    return new Stripe(
      z
        .string()
        .regex(/^(sk|rk)_(test|live)_/)
        .parse(process.env.STRIPE_SECRET_KEY),
      { timeout: 10000, maxNetworkRetries: 0 },
    );
  }
  async createCustomer(userId: string, email: string) {
    return (
      await this.client.customers.create(
        { email, metadata: { hikari_user_id: userId } },
        { idempotencyKey: 'hikari:customer:' + userId },
      )
    ).id;
  }
  async currentSubscriptions(customerId: string) {
    const result = await this.client.subscriptions.list({
      customer: customerId,
      status: 'all',
      limit: 100,
    });
    if (result.has_more)
      throw new AppError(
        503,
        'Subscription history needs attention before another checkout.',
      );
    return result.data.map(mapSubscription);
  }
  async currentSubscription(id: string) {
    return mapSubscription(await this.client.subscriptions.retrieve(id));
  }
  async recurringPrice(id: string) {
    const price = await this.client.prices.retrieve(id);
    if (
      !price.active ||
      price.type !== 'recurring' ||
      !price.recurring ||
      price.billing_scheme !== 'per_unit' ||
      price.unit_amount === null
    )
      throw new AppError(
        503,
        'The subscription plan is not configured correctly.',
      );
  }
  async openCheckout(customerId: string, priceId: string) {
    const result = await this.client.checkout.sessions.list({
      customer: customerId,
      status: 'open',
      limit: 100,
    });
    if (result.has_more)
      throw new AppError(503, 'Checkout history needs attention.');
    return (
      result.data.find(
        (session) =>
          session.mode === 'subscription' &&
          session.metadata?.hikari_price_id === priceId &&
          session.url,
      )?.url ?? null
    );
  }
  async checkout(customerId: string, priceId: string, origin: string) {
    const history = await this.client.checkout.sessions.list({
      customer: customerId,
      limit: 100,
    });
    if (history.has_more)
      throw new AppError(503, 'Checkout history needs attention.');
    const previous = history.data.find(
      (session) =>
        session.mode === 'subscription' &&
        session.metadata?.hikari_price_id === priceId,
    );
    if (previous?.status === 'open' && previous.url) return previous.url;
    const session = await this.client.checkout.sessions.create(
      {
        mode: 'subscription',
        customer: customerId,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: origin + '/account?checkout=returned',
        cancel_url: origin + '/account',
        metadata: { hikari_price_id: priceId },
      },
      {
        idempotencyKey:
          'hikari:checkout:' +
          customerId +
          ':' +
          priceId +
          ':' +
          (previous?.id ?? 'first'),
      },
    );
    if (!session.url)
      throw new AppError(503, 'Checkout is temporarily unavailable.');
    return session.url;
  }
  async portal(customerId: string, origin: string) {
    return (
      await this.client.billingPortal.sessions.create({
        customer: customerId,
        return_url: origin + '/account',
      })
    ).url;
  }
  async verify(raw: string, signature: string) {
    const secret = z.string().min(1).parse(process.env.STRIPE_WEBHOOK_SECRET);
    let event: Stripe.Event;
    try {
      event = await this.client.webhooks.constructEventAsync(
        raw,
        signature,
        secret,
      );
    } catch {
      throw new AppError(400, 'Invalid webhook signature.');
    }
    const live = process.env.STRIPE_SECRET_KEY?.includes('_live_');
    if (event.livemode !== live)
      throw new AppError(400, 'Webhook mode does not match this application.');
    const object = event.data.object;
    return {
      id: event.id,
      type: event.type,
      subscriptionId: object.object === 'subscription' ? object.id : null,
    };
  }
}
