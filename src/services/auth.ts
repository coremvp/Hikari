import 'server-only';
import { authClient } from '@/providers/supabase';
import { appUrl } from '@/lib/config';
import { AppError } from '@/lib/errors';
import { checkoutNext } from '@/lib/subscription-plans';
export async function currentUser() {
  const client = await authClient();
  const { data, error } = await client.auth.getUser();
  if (
    error &&
    (!['AuthSessionMissingError', 'AuthApiError'].includes(error.name) ||
      (error.status !== undefined && error.status >= 500))
  )
    throw new AppError(503, 'Authentication is temporarily unavailable.');
  return error ? null : data.user;
}
export async function requireUser() {
  const user = await currentUser();
  if (!user || user.is_anonymous)
    throw new AppError(401, 'Sign in to continue.');
  return { id: user.id, email: user.email ?? '' };
}
export async function signUp(email: string, password: string, next?: string) {
  const continuation = checkoutNext(next);
  const { data, error } = await (
    await authClient()
  ).auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        appUrl() +
        '/auth/callback' +
        (continuation ? '?next=' + encodeURIComponent(continuation) : ''),
    },
  });
  if (error)
    throw new AppError(
      400,
      'Could not create your account. Check your details and try again.',
    );
  return { confirmationRequired: !data.session };
}
export async function signIn(email: string, password: string) {
  const { error } = await (
    await authClient()
  ).auth.signInWithPassword({ email, password });
  if (error)
    throw new AppError(
      401,
      'Email or password is incorrect, or your email is not confirmed.',
    );
}
export async function signOut() {
  const { error } = await (await authClient()).auth.signOut();
  if (error) throw new AppError(503, 'Could not sign out. Please try again.');
}
export async function recover(email: string) {
  const { error } = await (
    await authClient()
  ).auth.resetPasswordForEmail(email, {
    redirectTo: appUrl() + '/auth/callback?next=/reset-password',
  });
  if (error)
    throw new AppError(
      503,
      'Could not send a recovery email. Please try again later.',
    );
}
export async function changePassword(password: string) {
  await requireUser();
  const { error } = await (await authClient()).auth.updateUser({ password });
  if (error)
    throw new AppError(
      400,
      'Could not change your password. Please request a new recovery link.',
    );
}
