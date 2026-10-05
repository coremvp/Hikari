import { BillingPanel } from '@/components/billing-panel';
import { requireUser } from '@/services/auth';
import { Logout } from '@/components/logout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
export default async function Account() {
  const user = await requireUser();
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Account</h1>
        <p className="text-muted-foreground">
          Manage your profile and subscription.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle role="heading" aria-level={2}>
            Profile
          </CardTitle>
          <CardDescription>Your signed-in account.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">Email address</p>
            <p className="break-all font-medium">{user.email}</p>
          </div>
          <Logout />
        </CardContent>
      </Card>
      <BillingPanel />
    </>
  );
}
