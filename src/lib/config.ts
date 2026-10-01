import 'server-only';
import { z } from 'zod';
export function appUrl() {
  const url = new URL(z.url().parse(process.env.APP_URL));
  if (
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  )
    throw new Error('APP_URL must be an origin');
  if (
    url.protocol !== 'https:' &&
    !(
      url.protocol === 'http:' &&
      ['localhost', '127.0.0.1'].includes(url.hostname)
    )
  )
    throw new Error('APP_URL requires HTTPS');
  return url.origin;
}
export function supabaseConfig() {
  return {
    url: z.url().parse(process.env.NEXT_PUBLIC_SUPABASE_URL),
    key: z
      .string()
      .min(1)
      .parse(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
  };
}
