import { NextResponse, type NextRequest } from 'next/server';
import { authClient } from '@/providers/supabase';
import { appUrl } from '@/lib/config';
import { authDestination, checkoutNext } from '@/lib/subscription-plans';
export async function GET(request: NextRequest) {
  const hash = request.nextUrl.searchParams.get('token_hash');
  const type = request.nextUrl.searchParams.get('type');
  const continuation = checkoutNext(request.nextUrl.searchParams.get('next'));
  let target =
    '/signin?error=confirmation' +
    (continuation ? '&next=' + encodeURIComponent(continuation) : '');
  if (hash && (type === 'signup' || type === 'recovery')) {
    const { error } = await (
      await authClient()
    ).auth.verifyOtp({ token_hash: hash, type });
    if (!error)
      target =
        type === 'recovery' ? '/reset-password' : authDestination(continuation);
  }
  const response = NextResponse.redirect(appUrl() + target);
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('Referrer-Policy', 'no-referrer');
  return response;
}
