import { SiteShell } from '@/components/site-shell';
export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
