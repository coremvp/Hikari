import { expect, test } from 'bun:test';
import {
  subscriptionPlans,
  yearlyDiscount,
  type PricingPlan,
  type RecurringPrice,
} from '@/lib/subscription-plans';

const price = (
  amount: number,
  interval: 'month' | 'year',
  overrides: Partial<RecurringPrice> = {},
): RecurringPrice => ({
  amount,
  currency: 'usd',
  interval,
  intervalCount: 1,
  livemode: false,
  ...overrides,
});

const plans = (): PricingPlan[] =>
  subscriptionPlans.map(({ id, name, description }) => ({
    id,
    name,
    description,
    prices: { monthly: price(1000, 'month'), yearly: price(9600, 'year') },
  }));

test('a shared yearly discount compares the annual charge with twelve monthly payments', () => {
  expect(yearlyDiscount(plans())).toEqual({ percentage: 20, upTo: false });
});

test('different or missing savings use an up-to claim instead of promising every plan the same discount', () => {
  const configured = plans();
  configured[0].prices.yearly = price(10800, 'year');
  expect(yearlyDiscount(configured)).toEqual({ percentage: 20, upTo: true });
  configured[0].prices.yearly = null;
  expect(yearlyDiscount(configured)).toEqual({ percentage: 20, upTo: true });
});

test('fractional savings round down instead of overstating the discount', () => {
  const configured = plans();
  for (const plan of configured) plan.prices.yearly = price(10000, 'year');
  expect(yearlyDiscount(configured)).toEqual({ percentage: 16, upTo: false });
});

test('equal or higher annual costs do not advertise savings', () => {
  const configured = plans();
  for (const plan of configured) plan.prices.yearly = price(12000, 'year');
  expect(yearlyDiscount(configured)?.percentage).toBe(0);
  for (const plan of configured) plan.prices.yearly = price(13000, 'year');
  expect(yearlyDiscount(configured)?.percentage).toBe(0);
});

test('unconnected prices do not become a numeric discount', () => {
  const unconnected = plans();
  for (const plan of unconnected) plan.prices.yearly = null;
  expect(yearlyDiscount(unconnected)).toBeNull();
  expect(yearlyDiscount([])).toBeNull();
});

test('different currencies or recurring periods cannot produce false savings', () => {
  const configured = plans();
  for (const plan of configured)
    plan.prices.yearly = price(9600, 'year', { currency: 'eur' });
  expect(yearlyDiscount(configured)).toBeNull();
  for (const plan of configured)
    plan.prices.yearly = price(9600, 'year', { intervalCount: 2 });
  expect(yearlyDiscount(configured)).toBeNull();
  for (const plan of configured) plan.prices.yearly = price(9600, 'month');
  expect(yearlyDiscount(configured)).toBeNull();
});

test('live, invalid or zero-baseline quotes do not create a test-pricing discount', () => {
  const configured = plans();
  for (const plan of configured)
    plan.prices.yearly = price(9600, 'year', { livemode: true });
  expect(yearlyDiscount(configured)).toBeNull();
  for (const plan of configured) plan.prices.yearly = price(-1, 'year');
  expect(yearlyDiscount(configured)).toBeNull();
  for (const plan of configured) plan.prices.yearly = price(NaN, 'year');
  expect(yearlyDiscount(configured)).toBeNull();
  for (const plan of configured) {
    plan.prices.monthly = price(0, 'month');
    plan.prices.yearly = price(0, 'year');
  }
  expect(yearlyDiscount(configured)).toBeNull();
});
