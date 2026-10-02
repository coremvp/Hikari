import Link from 'next/link';
import { SiteShell } from '@/components/site-shell';
export default function Home() {
  return (
    <SiteShell>
      <section className="py-12 md:py-24">
        <p className="eyebrow">HIKARI BY COREMVP</p>
        <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-tight tracking-tight md:text-6xl">
          A foundation for your
          <br className="hidden md:block" /> next application.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
          CoreMVP’s open-source Next.js application foundation. Start with an
          individual account, a protected dashboard, and subscription billing.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="button" href="/signup">
            Create an account
          </Link>
          <Link className="button-secondary" href="/signin">
            Sign in
          </Link>
        </div>
        <div className="mt-20 grid gap-8 border-t border-slate-200 pt-8 md:grid-cols-3">
          {[
            [
              'Your account',
              'Email and password authentication with account recovery.',
            ],
            [
              'Your application',
              'A protected workspace ready for your product.',
            ],
            [
              'Your subscription',
              'Checkout and subscription management through Stripe.',
            ],
          ].map(([title, text]) => (
            <div key={title}>
              <h2 className="text-base font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
