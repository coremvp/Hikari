import Link from 'next/link';

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-5">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            Hikari{' '}
            <span className="text-xs font-normal text-slate-500">
              by CoreMVP
            </span>
          </Link>
          <nav aria-label="Main navigation" className="flex gap-5 text-sm">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/account">Account</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto min-h-[75vh] max-w-5xl px-6 py-10">
        {children}
      </main>
      <footer className="mx-auto max-w-5xl border-t border-slate-200 px-6 py-6 text-sm text-slate-500">
        Hikari by CoreMVP · Open source under MIT ·{' '}
        <a
          href="https://github.com/coremvp/hikari"
          className="underline underline-offset-4"
        >
          Source on GitHub
        </a>
      </footer>
    </>
  );
}
