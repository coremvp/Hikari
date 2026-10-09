import { AuthForm } from '@/components/auth-form';
import { checkoutNext } from '@/lib/subscription-plans';
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;
  return (
    <AuthForm
      mode="signin"
      confirmationFailed={Boolean(error)}
      next={checkoutNext(next)}
    />
  );
}
