import { SubscriberArea } from '@/components/subscriber-area';
import { DashboardOverview } from '@/components/dashboard-overview';
import { requireUser } from '@/services/auth';

export default async function Dashboard() {
  const user = await requireUser();
  return (
    <DashboardOverview
      email={user.email ?? ''}
      subscription={<SubscriberArea userId={user.id} />}
    />
  );
}
