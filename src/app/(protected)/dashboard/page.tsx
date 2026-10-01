import { SubscriberArea } from '@/components/subscriber-area';
import Link from 'next/link';
import { requireUser } from '@/services/auth';
export default async function Dashboard() {
  const user = await requireUser();
  return (
    <>
      <p className="eyebrow">YOUR WORKSPACE</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-3 text-slate-600">Signed in as {user.email}.</p>
      <section className="mt-10 border-t border-slate-200 pt-8">
        <h2 className="text-xl font-semibold">Build from here</h2>
        <p className="mt-3 max-w-xl text-slate-600">
          Your account is ready. Add the product your customers need.
        </p>
        <Link href="/account" className="button-secondary mt-6">
          Manage account
        </Link>
      </section>
      <SubscriberArea userId={user.id} />
    </>
  );
}
