import Link from 'next/link';
import { Logo } from '@/components/logo';
import { SiteFooter } from '@/components/site-footer';

export function SiteShell({
  children,
  home = false,
}: {
  children: React.ReactNode;
  home?: boolean;
}) {
  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <Link
            href="/"
            aria-label="Hikari home"
            className="inline-flex items-center gap-2 text-xl font-semibold tracking-tight"
          >
            <Logo />
          </Link>
          <nav
            aria-label="Main navigation"
            className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm"
          >
            {home ? (
              <a href="#pricing">Pricing</a>
            ) : (
              <Link href="/#pricing">Pricing</Link>
            )}
            <Link href="/docs">Docs</Link>
            <Link href="/blog">Blog</Link>
            <a href="https://github.com/coremvp/hikari">GitHub</a>
            <Link href="/signin">Sign in</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto min-h-[75vh] max-w-7xl px-6">{children}</main>
      <SiteFooter />
    </>
  );
}
