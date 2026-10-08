import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  CreditCard,
  Database,
  FolderOpen,
  Link as LinkIcon,
  Mail,
  UsersRound,
} from 'lucide-react';
import { SectionHeading } from '@/components/section-heading';

function TeamScene() {
  return (
    <div
      aria-hidden="true"
      className="flex h-[250px] flex-col items-center justify-center"
    >
      <div className="w-full max-w-[320px] rounded-lg border border-neutral-200 bg-white shadow-[0_8px_24px_-12px_rgba(23,23,23,0.18)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 px-4 py-3 text-xs font-medium">
          <span className="flex items-center gap-2">
            <UsersRound className="size-4 text-neutral-500" />
            Your team
          </span>
          <span className="text-[11px] font-normal text-neutral-500">
            Organization
          </span>
        </div>
        <div className="py-1">
          {[
            { initial: 'Y', name: 'You', role: 'Owner' },
            { initial: 'A', name: 'Alex', role: 'Admin' },
            { initial: 'S', name: 'Sam', role: 'Member' },
          ].map(({ initial, name, role }) => (
            <div
              key={role}
              className="flex items-center gap-3 px-4 py-2.5 text-xs"
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-full border border-neutral-200 bg-neutral-50 text-[11px]">
                {initial}
              </span>
              <span>{name}</span>
              <span className="ml-auto text-[11px] text-neutral-600">
                {role}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="relative -mt-1 ml-5 flex -rotate-3 items-center gap-3 rounded-md border border-neutral-200 bg-white px-4 py-2.5 text-[11px] shadow-[0_8px_16px_-10px_rgba(23,23,23,0.18)]">
        <LinkIcon className="size-3.5 text-orange-700" />
        Invitation link
        <Copy className="size-3.5 text-orange-700" />
      </div>
    </div>
  );
}

function ProjectScene() {
  return (
    <div
      aria-hidden="true"
      className="flex h-[250px] flex-col items-center justify-center"
    >
      <div className="w-full max-w-[320px] rotate-2 rounded-lg border border-neutral-200 bg-white p-4 shadow-[0_8px_24px_-12px_rgba(23,23,23,0.18)] sm:p-5">
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <FolderOpen className="size-5 shrink-0 text-orange-700" />
          <span>Projects</span>
          <span className="ml-auto text-neutral-500">Workspace-owned</span>
        </div>
        <p className="mt-5 text-xl font-medium leading-tight tracking-tight">
          Your next product
        </p>
        <p className="mt-2 text-[11px] leading-relaxed text-neutral-500">
          Your team’s work, in one place.
        </p>
        <div className="mt-5 flex flex-wrap gap-1.5 text-[11px] text-neutral-600">
          {['Create', 'Rename', 'Archive', 'Restore'].map((action) => (
            <span
              key={action}
              className="rounded border border-neutral-100 bg-neutral-50 px-2 py-1"
            >
              {action}
            </span>
          ))}
        </div>
      </div>
      <p className="mt-4 flex items-center gap-2 text-[11px] text-neutral-600">
        <Database className="size-3.5 shrink-0" />
        Persisted application data
      </p>
    </div>
  );
}

function PurchaseScene() {
  return (
    <div
      aria-hidden="true"
      className="grid items-center justify-items-center gap-3 py-4 md:min-h-[175px] md:grid-cols-[minmax(0,1fr)_24px_minmax(0,0.88fr)_24px_minmax(0,1fr)] md:gap-4 md:py-0"
    >
      <div className="w-full max-w-[280px] -rotate-2 rounded-lg border border-neutral-200 bg-white px-4 py-5 shadow-[0_8px_24px_-12px_rgba(23,23,23,0.18)]">
        <p className="flex items-center gap-2 text-xs font-medium">
          <CreditCard className="size-4 shrink-0" />
          One-time checkout
        </p>
        <p className="mt-4 rounded border border-neutral-200 px-2 py-2 text-[11px] wrap-anywhere">
          you@example.com
        </p>
        <p className="mt-2.5 text-[11px] leading-relaxed text-neutral-500">
          No account required to start
        </p>
      </div>
      <span className="text-neutral-400">
        <ArrowDown className="size-4 md:hidden" />
        <ArrowRight className="hidden size-4 md:block" />
      </span>
      <div className="flex w-full max-w-[280px] flex-col items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-5 text-center shadow-[0_8px_24px_-12px_rgba(23,23,23,0.18)]">
        <span className="grid size-7 place-items-center rounded-full border border-orange-200 bg-orange-50 text-orange-800">
          <Check className="size-3.5" />
        </span>
        <p className="text-xs font-medium leading-relaxed">Purchase verified</p>
        <p className="text-[11px] text-neutral-500">Access recorded</p>
      </div>
      <span className="text-neutral-400">
        <ArrowDown className="size-4 md:hidden" />
        <ArrowRight className="hidden size-4 md:block" />
      </span>
      <div className="flex w-full max-w-[280px] rotate-2 flex-col gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-5 shadow-[0_8px_24px_-12px_rgba(23,23,23,0.18)]">
        <p className="flex items-center gap-2 text-xs font-medium">
          <Mail className="size-4 shrink-0" />
          Welcome aboard
        </p>
        <p className="text-sm font-medium">Create your account</p>
        <p className="text-[11px] leading-relaxed text-neutral-500">
          Continue from your setup email
        </p>
      </div>
    </div>
  );
}

export function CoreMVPSection() {
  return (
    <section
      id="coremvp"
      aria-labelledby="coremvp-title"
      className="hikari-section scroll-mt-8"
    >
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-7 flex flex-wrap items-center justify-center gap-2.5">
          <Image
            src="/blog/coremvp.svg"
            alt=""
            width={28}
            height={28}
            className="size-7"
          />
          <span className="text-lg font-semibold tracking-tight">CoreMVP</span>
          <span className="ml-1 border-l border-neutral-200 pl-3 text-[11px] text-neutral-500">
            Premium foundation
          </span>
        </div>
        <SectionHeading
          id="coremvp-title"
          title="From your first users."
          subtitle="To a product they share."
        />
        <p className="mt-6 text-base leading-7 text-neutral-600">
          Teams, Projects and guest checkout. Already connected.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a
            href="https://coremvp.com/en/products"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-orange-700 px-6 py-3 text-sm font-medium text-white hover:bg-orange-800"
          >
            Explore CoreMVP
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
          <a
            href="https://coremvp.com/en#pricing"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-neutral-200 px-6 py-3 text-sm font-medium hover:bg-neutral-50"
          >
            Get CoreMVP
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        </div>
      </div>

      <div className="mt-12 grid overflow-clip rounded-xl border border-neutral-200 md:grid-cols-2">
        <article className="border-b border-neutral-200 md:border-r">
          <a
            href="https://coremvp.com/en/docs/organizations"
            aria-labelledby="coremvp-team-title"
            className="group block h-full p-6 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-orange-700 sm:p-8"
          >
            <TeamScene />
            <h3
              id="coremvp-team-title"
              className="mt-5 text-xl font-medium leading-snug tracking-tight"
            >
              Make room for your team.
            </h3>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              Invitations, roles and shared workspaces.
            </p>
            <span className="mt-4 inline-flex min-h-11 items-center gap-1 text-sm font-medium underline-offset-4 group-hover:underline md:min-h-8">
              Teams and roles
              <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
            </span>
          </a>
        </article>
        <article className="border-b border-neutral-200">
          <a
            href="https://coremvp.com/en/docs/projects"
            aria-labelledby="coremvp-project-title"
            className="group block h-full p-6 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-orange-700 sm:p-8"
          >
            <ProjectScene />
            <h3
              id="coremvp-project-title"
              className="mt-5 text-xl font-medium leading-snug tracking-tight"
            >
              Give your product a home.
            </h3>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              Projects that belong to your workspace.
            </p>
            <span className="mt-4 inline-flex min-h-11 items-center gap-1 text-sm font-medium underline-offset-4 group-hover:underline md:min-h-8">
              Explore Projects
              <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
            </span>
          </a>
        </article>
        <article className="md:col-span-2">
          <a
            href="https://coremvp.com/en/docs/billing/lifetime/guest-checkout"
            aria-labelledby="coremvp-purchase-title"
            className="group block p-6 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-orange-700 sm:p-8"
          >
            <PurchaseScene />
            <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6">
              <div>
                <h3
                  id="coremvp-purchase-title"
                  className="text-xl font-medium leading-snug tracking-tight"
                >
                  Let the purchase come first.
                </h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  Guest checkout, verified access, then account setup.
                </p>
              </div>
              <span className="inline-flex min-h-11 shrink-0 items-center gap-1 text-sm font-medium underline-offset-4 group-hover:underline md:min-h-8">
                Guest checkout
                <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
              </span>
            </div>
          </a>
        </article>
      </div>
      <p className="mt-4 text-center text-xs leading-5 text-neutral-500">
        Illustrative scenes · Included capabilities
      </p>

      <div className="mt-9 flex flex-col items-center justify-center gap-x-6 gap-y-1 text-sm sm:flex-row sm:flex-wrap">
        <Link
          href="/docs/coremvp"
          className="inline-flex min-h-11 items-center gap-1 underline-offset-4 hover:underline"
        >
          From Hikari to CoreMVP
          <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
        </Link>
        <Link
          href="/blog/building-beyond-hikari"
          className="inline-flex min-h-11 items-center gap-1 underline-offset-4 hover:underline"
        >
          Building Beyond Hikari
          <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
        </Link>
        <a
          href="https://nextjs.coremvp.com/demo/dashboard/projects"
          className="inline-flex min-h-11 items-center gap-1 underline-offset-4 hover:underline"
        >
          Try the live demo
          <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
        </a>
      </div>
      <p className="mx-auto mt-5 max-w-3xl text-center text-xs leading-6 text-neutral-500">
        A separate source-code foundation you run with your own providers.
        <br />
        Hikari subscriptions don’t include CoreMVP source.
      </p>
    </section>
  );
}
