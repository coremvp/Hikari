import { BillingPanel } from '@/components/billing-panel';
import { requireUser } from '@/services/auth';
import { Logout } from '@/components/logout';
export default async function Account() {
  const user = await requireUser();
  return (
    <>
      <p className="eyebrow">YOUR PROFILE</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Account</h1>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-6 border-y border-slate-200 py-6">
        <div>
          <p className="text-sm text-slate-500">Email address</p>
          <p className="mt-1 break-all font-medium">{user.email}</p>
        </div>
        <Logout />
      </div>
      <BillingPanel />
    </>
  );
}
