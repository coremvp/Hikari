import { AuthForm } from '@/components/auth-form';
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <>
      {error && (
        <p role="alert" className="text-center text-red-700">
          This confirmation link is invalid or expired. Request a new email.
        </p>
      )}
      <AuthForm mode="signin" />
    </>
  );
}
