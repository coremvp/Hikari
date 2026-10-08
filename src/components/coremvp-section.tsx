import Link from 'next/link';
import {
  ArrowUpRight,
  FolderKanban,
  ReceiptText,
  UsersRound,
} from 'lucide-react';
import { SectionHeading } from '@/components/section-heading';

const outcomes = [
  {
    icon: UsersRound,
    title: 'Build for people working together.',
    description:
      'Shared Organizations, invitations and member roles. Bring people into a workspace with permissions checked on the server.',
    href: 'https://coremvp.com/en/docs/organizations',
    link: 'Explore Organizations',
  },
  {
    icon: FolderKanban,
    title: 'Start with real product data.',
    description:
      'Create, rename, archive and restore persisted Projects. Organization ownership and member access are already connected.',
    href: 'https://coremvp.com/en/docs/projects',
    link: 'Explore Projects',
  },
  {
    icon: ReceiptText,
    title: 'Let a purchase start the account.',
    description:
      'One-time payments with guest checkout. Verified payment connects to account onboarding and stored access.',
    href: 'https://coremvp.com/en/docs/billing/lifetime/guest-checkout',
    link: 'Explore guest checkout',
  },
];

export function CoreMVPSection() {
  return (
    <section
      id="coremvp"
      aria-labelledby="coremvp-title"
      className="hikari-section scroll-mt-8"
    >
      <div className="mx-auto max-w-3xl text-center">
        <SectionHeading
          id="coremvp-title"
          title="Build further with CoreMVP."
          subtitle="Start with more already connected."
        />
        <p className="mt-6 text-base leading-7 text-neutral-600">
          Hikari gives your individual-account application a place to begin.
          When your product needs shared workspaces, persisted Projects or
          one-time onboarding, build on CoreMVP’s premium startup application
          foundation.
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {outcomes.map(({ icon: Icon, title, description, href, link }) => (
          <article
            key={title}
            className="flex flex-col rounded-xl border border-neutral-200 p-6 sm:p-8 md:p-6 xl:p-8"
          >
            <Icon aria-hidden="true" className="size-7 text-orange-700" />
            <h3 className="mt-6 text-xl font-medium leading-snug tracking-tight">
              {title}
            </h3>
            <p className="mt-4 flex-1 text-sm leading-7 text-neutral-600">
              {description}
            </p>
            <a
              href={href}
              className="mt-6 inline-flex items-center gap-1 text-sm font-medium underline underline-offset-4"
            >
              {link}
              <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
            </a>
          </article>
        ))}
      </div>
      <div className="mx-auto mt-10 max-w-3xl text-center">
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="https://coremvp.com/en/products/nextjs"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-700 px-6 py-3 text-sm font-medium text-white hover:bg-orange-800"
          >
            Explore CoreMVP
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
          <a
            href="https://nextjs.coremvp.com"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 px-6 py-3 text-sm font-medium hover:bg-neutral-50"
          >
            Try the CoreMVP demo
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        </div>
        <p className="mt-5 text-sm leading-6 text-neutral-600">
          A separate source-code foundation you run with your own providers.
          Hikari’s example subscriptions test your app’s billing; they do not
          include CoreMVP source. Visit{' '}
          <a
            href="https://coremvp.com/en#pricing"
            className="underline underline-offset-4"
          >
            CoreMVP
          </a>{' '}
          for source access and current commercial terms.
        </p>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <Link
          href="/docs/coremvp"
          className="group rounded-xl bg-neutral-50 p-6"
        >
          <p className="text-xs font-medium text-neutral-500">The next step</p>
          <h3 className="mt-3 text-lg font-medium tracking-tight underline-offset-4 group-hover:underline">
            From Hikari to CoreMVP <span aria-hidden="true">→</span>
          </h3>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Understand the separate foundation, start locally and plan where
            your existing work belongs.
          </p>
        </Link>
        <Link
          href="/blog/building-beyond-hikari"
          className="group rounded-xl bg-neutral-50 p-6"
        >
          <p className="text-xs font-medium text-neutral-500">
            The design behind it
          </p>
          <h3 className="mt-3 text-lg font-medium tracking-tight underline-offset-4 group-hover:underline">
            Building Beyond Hikari <span aria-hidden="true">→</span>
          </h3>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            See why shared work needs membership, permissions and real Project
            ownership.
          </p>
        </Link>
      </div>
    </section>
  );
}
