import { AuthForm } from '@/components/auth-form';
import { checkoutNext } from '@/lib/subscription-plans';
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  return (
    <AuthForm mode="signup" next={checkoutNext((await searchParams).next)} />
  );
}
