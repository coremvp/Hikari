/**
 * Pricing Configuration
 *
 * Product and price IDs from Stripe.
 * Follow the billing guides to create products and copy the generated IDs:
 * https://coremvp.com/en/docs/nextjs/billing/lifetime/tutorial
 * https://coremvp.com/en/docs/nextjs/billing/subscription/tutorial
 */

export type PricingFeature = {
  id: string;
  label: string;
  value?: string;
  href?: string;
};

export const getPricingFeatureLabel = (feature: PricingFeature) =>
  feature.value
    ? `${feature.value} ${feature.label.toLowerCase()}`
    : feature.label;

const includedApplicationFeatures = [
  {
    id: "workspaces",
    label: "Personal and team workspaces",
    href: "/demo/dashboard",
  },
  {
    id: "projects",
    label: "Project management",
    href: "/demo/dashboard/projects",
  },
  {
    id: "members",
    label: "Member roles and invitations",
    href: "/demo/dashboard/organizations",
  },
  {
    id: "premium-content",
    label: "Premium content access",
    href: "/docs/customization/gating",
  },
  { id: "docs", label: "Docs and guides", href: "/docs" },
] as const satisfies readonly PricingFeature[];

const includedSubscriptionFeatures = [
  ...includedApplicationFeatures,
  {
    id: "billing-portal",
    label: "Customer billing portal",
    href: "/docs/features/payments#customer-portal",
  },
] as const satisfies readonly PricingFeature[];

export const lifetimeTiers = [
  {
    name: "Individual",
    id: "tier-individual",
    price: "$299",
    billingLabel: "lifetime",
    priceId: "price_1TnAEgDYbRRn6ERGMy9knwfH",
    productId: "prod_UmjiXj8eOQzKWm",
    description: "For personal projects and your first shared workspace.",
    features: [
      { id: "support", label: "Support", value: "Email" },
      ...includedApplicationFeatures,
    ],
    featured: true,
  },
  {
    name: "Team",
    id: "tier-enterprise",
    price: "$799",
    billingLabel: "lifetime",
    priceId: "price_1TnAEhDYbRRn6ERG1Ch8RTiE",
    productId: "prod_UmjiSChp8Z6V5a",
    description: "For teams building and shipping projects together.",
    features: [
      { id: "support", label: "Support", value: "Priority" },
      ...includedApplicationFeatures,
    ],
    featured: false,
  },
] as const;

export const subscriptionTiers = [
  {
    name: "Starter",
    id: "tier-starter",
    priceMonthly: "$15",
    priceYearly: "$150",
    priceIdMonthly: "price_1SulpiDYbRRn6ERGjlm33C8R",
    priceIdYearly: "price_1SulpjDYbRRn6ERGao34x3X7",
    productId: "prod_TsWtkc6uWhlIxO",
    description: "For personal projects and your first shared workspace.",
    features: [
      { id: "credits", label: "Credits", value: "5,000" },
      { id: "support", label: "Support", value: "Email" },
      ...includedSubscriptionFeatures,
    ],
    featured: false,
  },
  {
    name: "Pro",
    id: "tier-pro",
    priceMonthly: "$65",
    priceYearly: "$650",
    priceIdMonthly: "price_1SulpkDYbRRn6ERGkoKPvQkI",
    priceIdYearly: "price_1SulpkDYbRRn6ERGqwmkZzDo",
    productId: "prod_TsWt7AuGmdtUL0",
    description: "More credits for teams building and shipping together.",
    features: [
      { id: "credits", label: "Credits", value: "100,000" },
      { id: "support", label: "Support", value: "Priority" },
      ...includedSubscriptionFeatures,
    ],
    featured: true,
  },
  {
    name: "Business",
    id: "tier-business",
    priceMonthly: "$285",
    priceYearly: "$2,850",
    priceIdMonthly: "price_1SulpmDYbRRn6ERGmAlXQpyD",
    priceIdYearly: "price_1SulpmDYbRRn6ERGE7XsvYLY",
    productId: "prod_TsWt0eRfb8VMgT",
    description: "Higher usage for teams running several projects.",
    features: [
      { id: "credits", label: "Credits", value: "500,000" },
      { id: "support", label: "Support", value: "Priority" },
      ...includedSubscriptionFeatures,
    ],
    featured: false,
  },
] as const;

export const subscriptionBillingPeriods = {
  monthly: {
    label: "Monthly",
    interval: "/month",
    priceKey: "priceMonthly",
    priceIdKey: "priceIdMonthly",
  },
  yearly: {
    label: "Yearly",
    interval: "/year",
    priceKey: "priceYearly",
    priceIdKey: "priceIdYearly",
  },
} as const;

export type ApprovedCheckoutMode = "payment" | "subscription";

export const getApprovedCheckoutMode = (
  priceId: string,
): ApprovedCheckoutMode | null => {
  if (lifetimeTiers.some((tier) => tier.priceId === priceId)) {
    return "payment";
  }

  if (
    subscriptionTiers.some(
      (tier) =>
        tier.priceIdMonthly === priceId || tier.priceIdYearly === priceId,
    )
  ) {
    return "subscription";
  }

  return null;
};

export const isApprovedCheckoutPriceId = (priceId: string) =>
  getApprovedCheckoutMode(priceId) !== null;

export const formatPrice = (price: string) => {
  return price.startsWith("$") ? price : `$${price}`;
};

export type LifetimeTier = (typeof lifetimeTiers)[number];
export type SubscriptionTier = (typeof subscriptionTiers)[number];
export type SubscriptionBillingPeriod = keyof typeof subscriptionBillingPeriods;

export const getSubscriptionPrice = (
  tier: SubscriptionTier,
  billingPeriod: SubscriptionBillingPeriod,
) => {
  const period = subscriptionBillingPeriods[billingPeriod];

  return {
    amount: tier[period.priceKey],
    priceId: tier[period.priceIdKey],
    interval: period.interval,
  };
};

type SubscriptionPriceAmounts = {
  priceMonthly: string;
  priceYearly: string;
};

const priceAmount = (price: string) => Number(price.replace(/[$,]/g, ""));
const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const getSubscriptionPriceDisplay = (
  tier: SubscriptionPriceAmounts,
  billingPeriod: SubscriptionBillingPeriod,
) => ({
  amount:
    billingPeriod === "yearly"
      ? usd.format(priceAmount(tier.priceYearly) / 12)
      : tier.priceMonthly,
  interval: "/month",
  billingNote:
    billingPeriod === "yearly"
      ? `Billed ${tier.priceYearly} yearly.`
      : `Billed ${tier.priceMonthly} monthly.`,
});

export const getSubscriptionSavingsLabel = (
  tiers: readonly SubscriptionPriceAmounts[],
) => {
  if (tiers.length === 0) return null;
  const monthsSaved = Math.min(
    ...tiers.map(
      (tier) =>
        12 - priceAmount(tier.priceYearly) / priceAmount(tier.priceMonthly),
    ),
  );
  if (!Number.isFinite(monthsSaved) || monthsSaved <= 0) return null;
  if (Number.isInteger(monthsSaved)) {
    return `Save ${monthsSaved} ${monthsSaved === 1 ? "month" : "months"}`;
  }
  const percentSaved = Math.floor((monthsSaved / 12) * 100);
  return percentSaved > 0 ? `Save ${percentSaved}%` : null;
};
