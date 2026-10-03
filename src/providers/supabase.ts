import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { appUrl, supabaseConfig } from '@/lib/config';
export async function authClient() {
  const store = await cookies();
  const config = supabaseConfig();
  return createServerClient(config.url, config.key, {
    cookieOptions: {
      httpOnly: true,
      sameSite: 'lax',
      secure: appUrl().startsWith('https://'),
    },
    global: {
      fetch: Object.assign(
        (
          input: Parameters<typeof fetch>[0],
          init?: Parameters<typeof fetch>[1],
        ) => fetch(input, { ...init, signal: AbortSignal.timeout(10000) }),
        { preconnect: fetch.preconnect },
      ),
    },
    cookies: {
      getAll: () => store.getAll(),
      setAll: (values) => {
        // Server Components cannot write cookies. Proxy refreshes their session.
        try {
          for (const { name, value, options } of values)
            store.set(name, value, options);
        } catch {}
      },
    },
  });
}
