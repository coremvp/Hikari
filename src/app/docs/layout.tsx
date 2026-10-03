import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { DocsProvider } from '@/components/docs-provider';
import { Logo } from '@/components/logo';
import { source } from '@/lib/source';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DocsProvider>
      <DocsLayout
        tree={source.pageTree}
        nav={{
          title: (
            <span className="inline-flex items-center gap-2 text-xl tracking-tight">
              <Logo />
            </span>
          ),
        }}
        links={[
          { text: 'Blog', url: '/blog' },
          {
            text: 'GitHub',
            url: 'https://github.com/coremvp/hikari',
            external: true,
          },
        ]}
        themeSwitch={{ enabled: false }}
        sidebar={{ tabs: false, defaultOpenLevel: 1 }}
      >
        {children}
      </DocsLayout>
    </DocsProvider>
  );
}
