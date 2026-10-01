import { billing } from '@/services/billing';
export async function SubscriberArea({ userId }: { userId: string }) {
  let access: boolean;
  try {
    access = (await billing.view(userId)).access;
  } catch {
    return (
      <p role="alert" className="mt-8 text-red-700">
        Subscription status is temporarily unavailable. Please try again.
      </p>
    );
  }
  return (
    <section className="mt-8 border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-semibold">Subscriber workspace</h2>
      <p className="mt-3 text-slate-600">
        {access
          ? 'Your subscription is active. You can use the subscriber workspace.'
          : 'An active subscription is required to use the subscriber workspace.'}
      </p>
      {access && (
        <p className="mt-4 font-medium text-emerald-700">
          Subscription access granted
        </p>
      )}
    </section>
  );
}
