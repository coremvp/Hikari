import {
  pgTable,
  pgEnum,
  text,
  uuid,
  boolean,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
export const status = pgEnum('subscription_status', [
  'trialing',
  'active',
  'canceled',
  'incomplete',
  'incomplete_expired',
  'past_due',
  'unpaid',
  'paused',
]);
export const customers = pgTable('customers', {
  userId: uuid('user_id').primaryKey(),
  stripeCustomerId: text('stripe_customer_id').notNull().unique(),
});
export const subscriptions = pgTable(
  'subscriptions',
  {
    id: text('id').primaryKey(),
    customerId: text('customer_id')
      .notNull()
      .references(() => customers.stripeCustomerId),
    status: status('status').notNull(),
    priceId: text('price_id'),
    cancelAtPeriodEnd: boolean('cancel_at_period_end').notNull(),
    currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }),
  },
  (table) => [index('subscriptions_customer_id_idx').on(table.customerId)],
);
