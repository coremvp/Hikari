import 'server-only';
import { eq, sql } from 'drizzle-orm';
import { db } from '@/db/client';
import { AppError } from '@/lib/errors';
import { customers, subscriptions } from '@/db/schema';
import type { SubscriptionState } from '@/lib/billing-contract';
export type Customer = { userId: string; stripeCustomerId: string };
export interface BillingStore {
  withLock<T>(
    key: string,
    work: (store: BillingStore) => Promise<T>,
  ): Promise<T>;
  customerForUser(userId: string): Promise<Customer | null>;
  customerForStripe(id: string): Promise<Customer | null>;
  saveCustomer(customer: Customer): Promise<void>;
  subscriptions(customerId: string): Promise<SubscriptionState[]>;
  saveSubscription(state: SubscriptionState): Promise<void>;
}
type Connection = Pick<ReturnType<typeof db>, 'select' | 'insert' | 'execute'>;
export class BillingRepository implements BillingStore {
  constructor(private connection?: Connection) {}
  private get query() {
    return this.connection ?? db();
  }
  async withLock<T>(
    key: string,
    work: (store: BillingStore) => Promise<T>,
  ): Promise<T> {
    return db().transaction(async (tx) => {
      await tx.execute(
        sql`select pg_advisory_xact_lock(hashtextextended(${key}, 0))`,
      );
      return work(new BillingRepository(tx));
    });
  }
  async customerForUser(userId: string) {
    return (
      (
        await this.query
          .select()
          .from(customers)
          .where(eq(customers.userId, userId))
          .limit(1)
      )[0] ?? null
    );
  }
  async customerForStripe(id: string) {
    return (
      (
        await this.query
          .select()
          .from(customers)
          .where(eq(customers.stripeCustomerId, id))
          .limit(1)
      )[0] ?? null
    );
  }
  async saveCustomer(customer: Customer) {
    await this.query
      .insert(customers)
      .values(customer)
      .onConflictDoNothing({ target: customers.userId });
  }
  async subscriptions(customerId: string) {
    const rows = await this.query
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.customerId, customerId))
      .limit(101);
    if (rows.length > 100)
      throw new AppError(503, 'Subscription history needs attention.');
    return rows;
  }
  async saveSubscription(state: SubscriptionState) {
    await this.query
      .insert(subscriptions)
      .values(state)
      .onConflictDoUpdate({ target: subscriptions.id, set: state });
  }
}
