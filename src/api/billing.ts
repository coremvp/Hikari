import { Hono } from 'hono';
import { requireUser } from '@/services/auth';
import { billing, type BillingService } from '@/services/billing';
import { zValidator } from '@hono/zod-validator';
import { checkoutInputSchema } from '@/lib/subscription-plans';
export function createBillingRoutes(
  service: BillingService = billing,
  user: typeof requireUser = requireUser,
) {
  return new Hono()
    .get('/billing/subscription', async (c) =>
      c.json(await service.view((await user()).id)),
    )
    .post(
      '/billing/checkout',
      zValidator('json', checkoutInputSchema),
      async (c) => {
        const { plan, demo } = c.req.valid('json');
        return c.json(await service.checkout(await user(), plan, demo));
      },
    )
    .post('/billing/portal', async (c) =>
      c.json(await service.portal((await user()).id)),
    )
    .get('/subscription/access', async (c) => {
      await service.requireAccess((await user()).id);
      return c.json({ access: true });
    })
    .post('/webhooks/stripe', async (c) =>
      c.json(
        await service.webhook(
          await c.req.text(),
          c.req.header('stripe-signature') ?? '',
        ),
      ),
    );
}
export const billingRoutes = createBillingRoutes();
