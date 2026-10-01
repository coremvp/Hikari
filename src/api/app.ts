import { billingRoutes } from '@/api/billing';
import { Hono } from 'hono';
import { bodyLimit } from 'hono/body-limit';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { appUrl } from '@/lib/config';
import { AppError } from '@/lib/errors';
import * as auth from '@/services/auth';
const credentials = z
  .object({ email: z.email().max(254), password: z.string().min(8).max(128) })
  .strict();
export const api = new Hono().basePath('/api');
api.use('*', bodyLimit({ maxSize: 1024 * 1024 }));
api.use('*', async (c, next) => {
  c.header('Cache-Control', 'private, no-store');
  if (
    !['GET', 'HEAD', 'OPTIONS'].includes(c.req.method) &&
    c.req.path !== '/api/webhooks/stripe' &&
    c.req.header('origin') !== appUrl()
  )
    return c.json({ error: 'Request origin is not allowed.' }, 403);
  await next();
});
api.onError((error, c) => {
  if (error instanceof AppError)
    return c.json({ error: error.message }, error.status);
  console.error('Application request failed', {
    path: c.req.path,
    type: error.name,
  });
  return c.json({ error: 'The service is temporarily unavailable.' }, 503);
});
api.get('/health', (c) => c.json({ status: 'ok' }));
api.post('/auth/signup', zValidator('json', credentials), async (c) => {
  const { email, password } = c.req.valid('json');
  return c.json(await auth.signUp(email, password));
});
api.post('/auth/signin', zValidator('json', credentials), async (c) => {
  const { email, password } = c.req.valid('json');
  await auth.signIn(email, password);
  return c.json({ ok: true });
});
api.post('/auth/logout', async (c) => {
  await auth.signOut();
  return c.json({ ok: true });
});
api.post(
  '/auth/recovery',
  zValidator('json', z.object({ email: z.email().max(254) }).strict()),
  async (c) => {
    await auth.recover(c.req.valid('json').email);
    return c.json({ ok: true });
  },
);
api.post(
  '/auth/password',
  zValidator(
    'json',
    z.object({ password: z.string().min(8).max(128) }).strict(),
  ),
  async (c) => {
    await auth.changePassword(c.req.valid('json').password);
    return c.json({ ok: true });
  },
);
api.get('/account', async (c) => c.json(await auth.requireUser()));

api.route('/', billingRoutes);
