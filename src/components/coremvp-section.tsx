import Image from 'next/image';
import Link from 'next/link';
import {
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

const planeClass =
  'relative min-w-0 rounded-xl border border-neutral-200 bg-white shadow-[0_12px_30px_-12px_rgba(23,23,23,0.15)] group-hover/feature:border-[#d7baa8] group-hover/feature:shadow-[0_20px_36px_-16px_rgba(23,23,23,0.22)] group-focus-within/feature:border-[#d7baa8] group-focus-within/feature:shadow-[0_20px_36px_-16px_rgba(23,23,23,0.22)] motion-safe:transition-[transform,box-shadow,border-color] motion-safe:duration-[240ms] motion-safe:ease-out';
const mainMotion =
  ' motion-safe:group-hover/feature:-translate-y-1.5 motion-safe:group-focus-within/feature:-translate-y-1.5';
const offsetMotion =
  ' motion-safe:group-hover/feature:-translate-y-2 motion-safe:group-hover/feature:-rotate-1 motion-safe:group-focus-within/feature:-translate-y-2 motion-safe:group-focus-within/feature:-rotate-1';
const figureClass = 'mx-auto w-full max-w-[450px] py-6';

function TeamScene() {
  return (
    <div
      role="img"
      aria-label="Illustrative CoreMVP team with Owner, Admin and Member roles and an invitation link"
      className={figureClass}
    >
      <div aria-hidden="true">
        <div className={planeClass + mainMotion + ' px-5 py-5'}>
          <p className="mb-4 flex items-center gap-2 text-base font-medium">
            <Image src="/blog/coremvp.svg" alt="" width={20} height={20} />
            Your workspace
            <span className="ml-auto text-[11px] font-normal text-neutral-500">
              Team
            </span>
          </p>
          {[
            { initial: 'AK', name: 'Alex Kim', role: 'Owner' },
            { initial: 'JL', name: 'Jamie Lee', role: 'Admin' },
            { initial: 'SW', name: 'Sam Wilson', role: 'Member' },
          ].map(({ initial, name, role }) => (
            <div
              key={role}
              className="flex items-center gap-3 border-t border-neutral-200 py-3.5 text-sm"
            >
              <span
                className={
                  'grid size-8 shrink-0 place-items-center rounded-full text-[10px] ' +
                  (role === 'Owner'
                    ? 'bg-orange-50 text-orange-700'
                    : 'bg-neutral-100 text-neutral-600')
                }
              >
                {initial}
              </span>
              <span>{name}</span>
              <span className="ml-auto text-[11px] text-neutral-500">
                {role}
              </span>
            </div>
          ))}
        </div>
        <div
          className={
            planeClass +
            offsetMotion +
            ' z-10 -mt-1 ml-auto flex w-[92%] -rotate-2 flex-wrap items-center gap-2.5 px-4 py-3.5 text-xs'
          }
        >
          <LinkIcon className="size-4 shrink-0 text-orange-700" />
          Invite your teammate
          <Copy className="size-3.5 text-orange-700" />
          <span className="ml-auto text-[11px] text-neutral-500">
            Join workspace ↗
          </span>
        </div>
      </div>
    </div>
  );
}

function ProjectScene() {
  return (
    <div
      role="img"
      aria-label="Illustrative CoreMVP workspace-owned project with create, rename, archive and restore actions"
      className={figureClass}
    >
      <div
        aria-hidden="true"
        className={planeClass + mainMotion + ' p-5 sm:p-6'}
      >
        <div className="flex items-center justify-between gap-3 border-b border-neutral-200 pb-5">
          <FolderOpen className="size-8 text-orange-700" />
          <span className="text-[11px] text-neutral-500">Workspace-owned</span>
        </div>
        <p className="mt-5 text-xl font-medium leading-tight tracking-tight">
          Your next product
        </p>
        <p className="mt-2 text-xs leading-6 text-neutral-500">
          Your team’s work, in one place.
        </p>
        <div className="mt-6 flex flex-wrap gap-2 text-[11px] text-neutral-600">
          {['Create', 'Rename', 'Archive', 'Restore'].map((action) => (
            <span
              key={action}
              className="rounded border border-neutral-200 bg-neutral-50 px-2.5 py-1.5"
            >
              {action}
            </span>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-neutral-200 pt-4 text-[11px] text-neutral-500">
          <span className="flex items-center gap-1.5">
            <Database className="size-3.5" />
            Persisted data
          </span>
          <span className="flex items-center gap-1.5">
            <UsersRound className="size-3.5" />
            Shared workspace
          </span>
        </div>
      </div>
    </div>
  );
}

function PurchaseScene() {
  return (
    <div
      role="img"
      aria-label="Illustrative one-time guest Checkout followed by verified purchase access and account setup"
      className={figureClass}
    >
      <div aria-hidden="true">
        <div className={planeClass + mainMotion + ' px-5 py-5'}>
          <p className="flex items-center gap-2 text-base font-medium">
            <CreditCard className="size-4 text-orange-700" />
            One-time checkout
          </p>
          <p className="mt-5 rounded-md border border-neutral-200 px-3 py-3 text-sm wrap-anywhere">
            you@example.com
          </p>
          <p className="mt-3 text-xs text-neutral-500">
            No account required to start
          </p>
          <div className="mt-5 rounded-md bg-neutral-900 px-4 py-3 text-center text-xs font-medium text-white">
            Continue to Checkout
          </div>
        </div>
        <div
          className={
            planeClass +
            offsetMotion +
            ' z-10 -mt-1 ml-auto flex w-[92%] -rotate-2 items-center gap-3 px-4 py-4'
          }
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-orange-50 text-orange-700">
            <Check className="size-4" />
          </span>
          <div>
            <p className="text-xs font-medium">Purchase verified</p>
            <p className="mt-1 text-[11px] text-neutral-500">Access recorded</p>
          </div>
        </div>
        <p className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-neutral-600">
          <Mail className="size-4 text-orange-700" />
          Setup email
          <ArrowRight className="size-3.5 text-neutral-400" />
          <span>Create your account</span>
        </p>
      </div>
    </div>
  );
}

const capabilities = [
  {
    id: 'team',
    label: 'Teams and roles',
    title: 'Make room for your team.',
    description: 'Invitations, roles and shared workspaces.',
    points: [
      'Owner, Admin and Member',
      'Invitations and join flow',
      'Shared workspace context',
    ],
    href: 'https://coremvp.com/en/docs/organizations',
    action: 'Explore teams and roles',
    icon: UsersRound,
    scene: <TeamScene />,
  },
  {
    id: 'project',
    label: 'Projects',
    title: 'Give your product a home.',
    description: 'Projects that belong to your workspace.',
    points: [
      'Create and rename',
      'Archive and restore',
      'Persisted application data',
    ],
    href: 'https://coremvp.com/en/docs/projects',
    action: 'Explore Projects',
    icon: FolderOpen,
    scene: <ProjectScene />,
  },
  {
    id: 'purchase',
    label: 'Guest checkout',
    title: 'Let the purchase come first.',
    description: 'Guest checkout, verified access, then account setup.',
    points: [
      'One-time checkout',
      'Verified purchase access',
      'Account setup after purchase',
    ],
    href: 'https://coremvp.com/en/docs/billing/lifetime/guest-checkout',
    action: 'Explore guest checkout',
    icon: CreditCard,
    scene: <PurchaseScene />,
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
          title="Build further with CoreMVP."
          subtitle="Start with more already connected."
        />
        <p className="mt-5 text-base leading-7 text-neutral-600">
          Teams, Projects and guest checkout.
        </p>
      </div>
      <div className="mt-9">
        {capabilities.map(
          (
            {
              id,
              label,
              title,
              description,
              points,
              href,
              action,
              icon: Icon,
              scene,
            },
            index,
          ) => (
            <article
              key={id}
              aria-labelledby={'coremvp-' + id + '-title'}
              className={
                'group/feature grid min-w-0 items-center gap-6 py-8 md:gap-12 md:py-10 ' +
                (index === 1
                  ? 'md:grid-cols-[1.14fr_0.86fr]'
                  : 'md:grid-cols-[0.86fr_1.14fr]')
              }
            >
              <div className="max-w-sm py-2">
                <p className="mb-2 flex items-center gap-2 text-xs font-medium text-orange-700">
                  <Icon aria-hidden="true" className="size-4" />
                  {label}
                </p>
                <h3
                  id={'coremvp-' + id + '-title'}
                  className="text-[28px] font-medium leading-tight tracking-tight"
                >
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  {description}
                </p>
                <ul className="mt-5 flex flex-col gap-3 text-xs">
                  {points.map((point) => (
                    <li key={point} className="flex items-center gap-2">
                      <Check
                        aria-hidden="true"
                        className="size-4 shrink-0 text-orange-700"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
                <a
                  href={href}
                  className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-700"
                >
                  {action}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 shrink-0"
                  />
                </a>
              </div>
              <div
                className={
                  'min-w-0 px-2 md:px-5 ' +
                  (index === 1 ? 'md:order-first' : '')
                }
              >
                {scene}
              </div>
            </article>
          ),
        )}
      </div>
      <p className="mt-3 text-center text-xs leading-5 text-neutral-500">
        Illustrative scenes · Included capabilities
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
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
      <div className="mt-5 flex flex-col items-center justify-center gap-x-6 gap-y-1 text-sm sm:flex-row sm:flex-wrap">
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
