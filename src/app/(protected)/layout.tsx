import { redirect } from 'next/navigation';
import { currentUser } from '@/services/auth';
import { SiteShell } from '@/components/site-shell';
export const metadata = { robots: { index: false, follow: false } };
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user || user.is_anonymous) redirect('/signin');
  return <SiteShell>{children}</SiteShell>;
}
