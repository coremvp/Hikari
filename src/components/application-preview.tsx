import Image from 'next/image';
import Link from 'next/link';
import { source } from '@/lib/source';
import { DashboardPreview } from '@/components/dashboard-preview';

export function DocumentationPreview() {
  const overview = source.getPage([]);
  const guides = [
    source.getPage(['getting-started']),
    source.getPage(['features', 'payments']),
    source.getPage(['deployment', 'vercel']),
  ].filter((page) => page !== undefined);

  return (
    <div className="hikari-docs-preview">
      <div className="hikari-window-bar">
        <Image src="/icon.svg" alt="" width={18} height={18} />
        <span className="font-semibold text-neutral-900">Hikari</span>
        <span className="ml-auto text-xs text-neutral-600">Documentation</span>
      </div>
      <div className="hikari-docs-layout">
        <div className="hikari-docs-nav" aria-hidden="true">
          <p className="mb-6 rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-600">
            Search documentation
          </p>
          <p className="font-medium text-neutral-900">Getting started</p>
          <p>Run locally</p>
          <p>Project structure</p>
          <p className="mt-5 font-medium text-neutral-900">
            Build your application
          </p>
          <p>Authentication</p>
          <p>Subscriptions</p>
          <p>Docs and Blog</p>
        </div>
        <div className="hikari-docs-body">
          <p className="text-xs font-medium text-orange-800">Start building</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">
            {overview?.data.title}
          </h3>
          <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-600">
            {overview?.data.description}
          </p>
          <div className="hikari-docs-guides">
            {guides.map((page) => (
              <Link
                key={page.url}
                href={page.url}
                className="group flex items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3 hover:border-orange-300"
              >
                <span className="text-sm font-medium">{page.data.title}</span>
                <span
                  className="text-neutral-600 group-hover:text-orange-800"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ApplicationPreview() {
  return (
    <div className="mx-auto max-w-6xl">
      <h2 className="sr-only">Explore the included interfaces</h2>
      <div className="hikari-product-stage">
        <div className="hikari-sun-shape" aria-hidden="true" />
        <div className="hikari-stage-docs">
          <DocumentationPreview />
        </div>
        <section
          aria-label="Signup interface preview"
          className="hikari-signup-preview"
        >
          <div className="mb-7 flex items-center gap-2 text-sm font-semibold">
            <Image src="/icon.svg" alt="" width={22} height={22} /> Hikari
          </div>
          <h3 className="text-xl font-semibold tracking-tight">
            Create your account
          </h3>
          <p className="mt-2 text-sm text-neutral-600">
            Start building with Hikari.
          </p>
          <dl className="mt-6 space-y-4 text-sm">
            <div>
              <dt className="mb-2 font-medium">Email</dt>
              <dd className="hikari-preview-field">builder@example.test</dd>
            </div>
            <div>
              <dt className="mb-2 font-medium">Password</dt>
              <dd
                className="hikari-preview-field tracking-widest"
                aria-label="Example password, masked"
              >
                ••••••••
              </dd>
            </div>
          </dl>
          <Link
            href="/signup"
            className="button mt-5 h-9 w-full rounded-lg py-2 font-medium"
          >
            Create account
          </Link>
          <p className="mt-4 text-center text-xs text-neutral-600">
            Already have an account?{' '}
            <Link
              href="/signin"
              className="text-neutral-900 underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </section>
        <section
          aria-label="Subscription interface preview"
          className="hikari-billing-preview"
        >
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-semibold">Subscription</h3>
            <span className="rounded-md bg-neutral-100 px-2 py-1 text-xs text-neutral-600">
              Account
            </span>
          </div>
          <p className="mt-5 flex items-center gap-2 text-sm text-neutral-600">
            <span
              className="size-1.5 rounded-full bg-neutral-400"
              aria-hidden="true"
            />{' '}
            No active subscription
          </p>
          <Link href="/account" className="button mt-5 rounded-lg py-2">
            Explore billing · sign in required{' '}
            <span className="ml-3" aria-hidden="true">
              →
            </span>
          </Link>
          <p className="mt-3 text-xs text-neutral-600">
            Checkout · Webhooks · Customer Portal
          </p>
        </section>
      </div>
      <div className="hikari-preview-caption">
        <p>Included interfaces · static examples</p>
        <Link
          href="/dashboard"
          className="font-medium text-neutral-900 underline underline-offset-4"
        >
          Open Dashboard · sign in required <span aria-hidden="true">→</span>
        </Link>
      </div>
      <DashboardPreview />
      <div className="mt-6 grid gap-5 text-sm leading-6 text-neutral-600 sm:grid-cols-3">
        <p>
          <strong className="font-medium text-neutral-900">
            Your account.
          </strong>{' '}
          Signup opens Dashboard. Signed-in account summaries use your real
          account state.
        </p>
        <p>
          <strong className="font-medium text-neutral-900">
            Your subscription.
          </strong>{' '}
          Account holds Checkout and Portal controls once Stripe is configured.
          Access comes from persisted subscription state.
        </p>
        <p>
          <strong className="font-medium text-neutral-900">
            Your product.
          </strong>{' '}
          Charts and Organization/Project selectors are illustrative. See{' '}
          <Link
            href="/docs/getting-started/project-structure"
            className="underline underline-offset-4"
          >
            Project structure
          </Link>{' '}
          for the features and authorization you add.
        </p>
      </div>
    </div>
  );
}
