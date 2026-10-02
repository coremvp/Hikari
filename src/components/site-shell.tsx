import Link from 'next/link';
import { Logo } from '@/components/logo';
import { SiteFooter } from '@/components/site-footer';

export function SiteShell({
  children,
  variant = 'app',
}: {
  children: React.ReactNode;
  variant?: 'app' | 'public';
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
            <Link href="/docs">Docs</Link>
            <Link href="/blog">Blog</Link>
            {variant === 'app' ? (
              <>
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/account">Account</Link>
              </>
            ) : (
              <>
                <a href="https://github.com/coremvp/hikari">GitHub</a>
                <Link href="/signin">Sign in</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main
        className={`mx-auto min-h-[75vh] px-6 ${variant === 'public' ? 'max-w-7xl' : 'max-w-5xl py-10'}`}
      >
        {children}
      </main>
      {variant === 'public' ? (
        <SiteFooter />
      ) : (
        <footer className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-neutral-200 px-6 py-8 text-sm text-neutral-500">
          <p>
            Hikari by{' '}
            <a
              href="https://coremvp.com"
              className="underline underline-offset-4"
            >
              CoreMVP
            </a>{' '}
            · Open source under MIT
          </p>
          <nav aria-label="Footer navigation" className="flex gap-5">
            <Link href="/docs">Docs</Link>
            <Link href="/blog">Blog</Link>
            <a href="https://github.com/coremvp/hikari">Source on GitHub</a>
          </nav>
        </footer>
      )}
    </>
  );
}
