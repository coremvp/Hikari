import { NextResponse, type NextRequest } from 'next/server';
import { authClient } from '@/providers/supabase';
import { appUrl } from '@/lib/config';
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  let target = '/signin?error=confirmation';
  if (code) {
    const { error } = await (
      await authClient()
    ).auth.exchangeCodeForSession(code);
    if (!error)
      target =
        request.nextUrl.searchParams.get('next') === '/reset-password'
          ? '/reset-password'
          : '/dashboard';
  }
  const response = NextResponse.redirect(appUrl() + target);
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('Referrer-Policy', 'no-referrer');
  return response;
}
