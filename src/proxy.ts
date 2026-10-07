import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { appUrl, supabaseConfig } from '@/lib/config';
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const config = supabaseConfig();
  const client = createServerClient(config.url, config.key, {
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
      getAll: () => request.cookies.getAll(),
      setAll: (values) => {
        for (const { name, value } of values) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of values)
          response.cookies.set(name, value, options);
      },
    },
  });
  await client.auth.getUser();
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/account/:path*',
    '/checkout',
    '/reset-password',
  ],
};
