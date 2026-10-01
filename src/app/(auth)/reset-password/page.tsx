import { redirect } from 'next/navigation';
import { currentUser } from '@/services/auth';
import { AuthForm } from '@/components/auth-form';
export default async function Page() {
  if (!(await currentUser())) redirect('/signin');
  return <AuthForm mode="password" />;
}
