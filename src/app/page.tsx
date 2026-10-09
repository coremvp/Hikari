import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  Check,
  Cloud,
  CreditCard,
  Database,
  FileCode2,
  Folder,
  KeyRound,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Terminal,
  UserRound,
} from 'lucide-react';
import { getSubscriptionPriceDisplay } from '@/config/pricing.config';
import { subscriptionPlans } from '@/lib/subscription-plans';
import { SiteShell } from '@/components/site-shell';
import { Testimonials } from '@/components/testimonials';
import { BlogCard } from '@/components/blog-card';
import { SectionHeading } from '@/components/section-heading';
import { DashboardPreview } from '@/components/dashboard-preview';
import { PricingSection } from '@/components/pricing-section';
import { CoreMVPSection } from '@/components/coremvp-section';
import {
  ApplicationPreview,
  DocumentationPreview,
} from '@/components/application-preview';
import { getBlogPages } from '@/lib/blog-source';
import { publicMetadata } from '@/lib/public-metadata';

export const revalidate = 300;

export const metadata = publicMetadata(
  'Hikari by CoreMVP',
  'An open-source Next.js application foundation with accounts, protected pages, subscription billing, Docs, and Blog.',
  '/',
);

const stack = [
  { name: 'Next.js', logo: 'nextjs.svg' },
  { name: 'Supabase', logo: 'supabase.svg' },
  { name: 'Stripe', logo: 'stripe.svg' },
  { name: 'Drizzle', logo: 'drizzle.png' },
  { name: 'Hono', logo: 'hono.svg' },
];

const communityAvatars = [
  'SuhailKakar.jpg',
  'yasmeen.jpg',
  'MPlegas.jpg',
  'said.jpg',
  'robdev.jpg',
];

export default function Home() {
  const posts = getBlogPages().slice(0, 2);
  return (
    <SiteShell home>
      <section className="hikari-canvas" aria-labelledby="hero-title">
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 pb-9 pt-12 text-center sm:pt-16">
          <p className="inline-flex items-center gap-2 text-xs font-medium tracking-wide text-neutral-600">
            <Image src="/icon.svg" alt="" width={16} height={16} /> Free and
            open source · MIT licensed
          </p>
          <h1
            id="hero-title"
            className="mt-5 text-balance text-[2.75rem] font-semibold leading-[1.07] tracking-[-0.045em] sm:text-6xl lg:text-[4rem]"
          >
            A brighter start for
            <span className="block text-neutral-500">
              your next application.
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-balance text-lg leading-7 text-neutral-600">
            Accounts, subscriptions, and content. Connected in one open-source
            Next.js application, ready for your ideas.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              className="button rounded-lg px-6"
              href="/docs/getting-started"
            >
              Start building{' '}
              <span className="ml-2" aria-hidden="true">
                →
              </span>
            </Link>
            <a
              className="button-secondary rounded-lg px-6"
              href="https://github.com/coremvp/hikari"
            >
              View on GitHub
            </a>
          </div>
          <a
            href="#testimonials-title"
            className="mt-7 inline-flex flex-wrap items-center justify-center gap-3 rounded-lg text-sm text-neutral-600"
          >
            <span aria-hidden="true" className="flex -space-x-3">
              {communityAvatars.map((avatar) => (
                <Image
                  key={avatar}
                  src={`/testimonials/${avatar}`}
                  alt=""
                  width={36}
                  height={36}
                  className="size-9 rounded-full border-2 border-white object-cover"
                />
              ))}
            </span>
            <span>
              Join{' '}
              <strong className="font-semibold text-neutral-950">400+</strong>{' '}
              developers
            </span>
          </a>
        </div>
        <div className="relative px-6 pb-10 sm:px-10 sm:pb-12">
          <ApplicationPreview />
        </div>
      </section>
      <section
        aria-label="Hikari technology stack"
        className="border-b border-neutral-200 py-10 sm:py-12"
      >
        <p className="text-center text-sm text-neutral-600">
          Built with the tools you already know.
        </p>
        <ul className="mx-auto mt-7 flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14 lg:justify-between">
          {stack.map((tool) => (
            <li
              key={tool.name}
              className="flex items-center gap-3 text-lg font-semibold tracking-tight text-neutral-800"
            >
              <Image
                src={`/stack/${tool.logo}`}
                alt=""
                width={28}
                height={28}
                className="size-7 rounded-sm object-contain"
              />
              {tool.name}
            </li>
          ))}
        </ul>
      </section>
      <DashboardPreview />
      <FoundationShowcase />
      <Testimonials />
      <PricingSection />
      <CoreMVPSection />
      <section aria-labelledby="content-title" className="hikari-section">
        <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <SectionHeading
            id="content-title"
            title="Docs with your code."
            subtitle="Publish as you build."
          />
          <p className="text-base leading-7 text-neutral-600">
            MDX, search and a Blog. In your repository.
          </p>
        </div>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4 text-sm">
              <h3 className="font-medium">Documentation</h3>
              <Link
                href="/docs"
                className="inline-flex min-h-11 items-center gap-2 font-medium hover:underline underline-offset-4"
              >
                Explore the Docs{' '}
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
            <DocumentationPreview variant="landing" />
            <div className="mt-5 divide-y divide-neutral-200">
              {[
                {
                  title: 'Run locally',
                  href: '/docs/getting-started',
                  icon: Terminal,
                },
                {
                  title: 'Connect billing',
                  href: '/docs/features/payments',
                  icon: CreditCard,
                },
                {
                  title: 'Deploy your app',
                  href: '/docs/deployment/vercel',
                  icon: Cloud,
                },
              ].map(({ title, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex min-h-12 items-center gap-3 py-3 text-sm hover:underline underline-offset-4"
                >
                  <Icon
                    aria-hidden="true"
                    className="size-4 text-neutral-500"
                  />
                  <span>{title}</span>
                  <ArrowUpRight aria-hidden="true" className="ml-auto size-4" />
                </Link>
              ))}
            </div>
          </div>
          <section aria-labelledby="news-title" className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4 text-sm">
              <h3 id="news-title" className="font-medium">
                From the source
              </h3>
              <Link
                href="/blog"
                className="inline-flex min-h-11 items-center gap-2 font-medium hover:underline underline-offset-4"
              >
                All posts <ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
            <div className="space-y-7">
              {posts.map((post, index) => (
                <BlogCard
                  key={post.url}
                  href={post.url}
                  title={post.data.title}
                  date={post.data.date}
                  cover={post.data.cover}
                  heading="h4"
                  variant={index === 0 ? 'featured' : 'compact'}
                />
              ))}
            </div>
          </section>
        </div>
      </section>
      <section
        aria-labelledby="source-title"
        className="hikari-section grid items-center gap-9 lg:grid-cols-[1.3fr_1fr] lg:gap-x-16"
      >
        <div className="min-w-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 max-lg:order-2">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 px-5 py-4 text-xs text-neutral-600 sm:px-7">
            <span className="flex items-center gap-2 font-mono text-neutral-900">
              <Terminal aria-hidden="true" className="size-4" />
              Terminal
            </span>
            <span>Local quickstart</span>
          </div>
          <pre className="p-5 font-mono text-xs leading-8 whitespace-pre-wrap wrap-anywhere text-neutral-800 sm:p-7 sm:text-sm">
            <code>
              {
                'git clone https://github.com/coremvp/hikari.git\ncd hikari\nbun install\nbunx supabase start\nbunx supabase migration up --local\n./coremvp env sync\nbun run dev'
              }
            </code>
          </pre>
          <p className="flex items-center gap-2 px-5 pb-5 font-mono text-xs text-neutral-600 sm:px-7">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-orange-700"
            />
            localhost:3000
          </p>
        </div>
        <div className="max-lg:order-1">
          <Image
            src="/icon.svg"
            alt=""
            width={28}
            height={28}
            className="mb-5"
          />
          <SectionHeading
            id="source-title"
            title="Clone it."
            subtitle="Make it yours."
          />
          <p className="mt-5 text-base leading-7 text-neutral-600">
            Run locally. Connect your providers. Build.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/docs/getting-started"
              className="button gap-2 rounded-lg px-6"
            >
              Start building{' '}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <a
              href="https://github.com/coremvp/hikari"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-medium hover:underline underline-offset-4"
            >
              View the source{' '}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </a>
          </div>
          <p className="mt-5 text-xs leading-6 text-neutral-600">
            Free source. MIT licensed.
            <br />
            Your hosting and providers.
          </p>
        </div>
        <p className="text-xs leading-6 text-neutral-600 max-lg:order-3 lg:col-span-2">
          Requires Git, Bun 1.3.14, Node.js 20.19+, Bash and running Docker. The
          quickstart covers installation and local signup before billing.
        </p>
      </section>
    </SiteShell>
  );
}

function FoundationShowcase() {
  const pro = subscriptionPlans.find((plan) => plan.id === 'pro')!;
  const price = getSubscriptionPriceDisplay(pro, 'monthly');
  const sceneClass =
    'relative order-2 flex min-h-[360px] items-center justify-center px-2 py-9 md:min-h-[390px] md:px-5';
  const planeClass =
    'relative min-w-0 rounded-xl border border-neutral-200 bg-white shadow-[0_12px_30px_-12px_rgba(23,23,23,0.15)] group-hover/feature:border-[#d7baa8] group-hover/feature:shadow-[0_20px_36px_-16px_rgba(23,23,23,0.22)] group-focus-within/feature:border-[#d7baa8] group-focus-within/feature:shadow-[0_20px_36px_-16px_rgba(23,23,23,0.22)] motion-safe:transition-[transform,box-shadow,border-color] motion-safe:duration-[240ms] motion-safe:ease-out';
  const mainMotion =
    ' motion-safe:group-hover/feature:-translate-y-1.5 motion-safe:group-focus-within/feature:-translate-y-1.5';
  const statusClass =
    'inline-flex items-center gap-1 text-[11px] font-medium text-orange-700';
  return (
    <section aria-labelledby="foundation-title" className="hikari-section">
      <div className="mb-9 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <SectionHeading
          id="foundation-title"
          title="Accounts included."
          subtitle="Subscriptions connected."
        />
        <p className="text-base leading-7 text-neutral-600 lg:max-w-[230px]">
          <span className="block">A home for your users.</span>
          <span className="block">A foundation for your product.</span>
        </p>
      </div>
      <div>
        <article className="group/feature grid min-w-0 items-center gap-2 pb-8 md:grid-cols-[1.2fr_0.8fr] md:gap-8">
          <div className={sceneClass + ' md:order-first'}>
            <div
              role="img"
              aria-label="Illustrative account with email, signed-in state, protected pages and recovery"
              className="w-full max-w-[420px]"
            >
              <div className={planeClass + mainMotion + ' overflow-hidden'}>
                <div className="flex items-center gap-1.5 border-b border-neutral-200 px-4 py-3 text-[11px] text-neutral-500">
                  <span className="size-1.5 rounded-full bg-neutral-300" />
                  <span className="size-1.5 rounded-full bg-neutral-300" />
                  <span className="size-1.5 rounded-full bg-neutral-300" />
                  <span className="ml-auto">Hikari · Account</span>
                </div>
                <div className="px-5 pt-6 pb-5">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-orange-50 text-orange-700">
                      <UserRound className="size-5" />
                    </span>
                    <div>
                      <p className="text-lg font-medium tracking-tight">
                        Your account
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        Your signed-in account.
                      </p>
                    </div>
                  </div>
                  <p className="mt-5 border-t border-neutral-200 py-3 text-sm wrap-anywhere">
                    builder@example.test
                  </p>
                  <span className={statusClass}>
                    <Check className="size-3.5" />
                    Signed in
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 border-t border-neutral-200 bg-neutral-50 px-4 py-3 text-[11px] text-neutral-600">
                  <LockKeyhole className="size-3.5" />
                  <span>Protected pages</span>
                  <code>/dashboard</code>
                  <code>/account</code>
                </div>
              </div>
              <div
                className={
                  planeClass +
                  ' z-10 -mt-2 ml-auto flex w-[92%] -rotate-3 items-center gap-3 px-4 py-3.5 motion-safe:group-hover/feature:-translate-y-2 motion-safe:group-hover/feature:-rotate-1 motion-safe:group-focus-within/feature:-translate-y-2 motion-safe:group-focus-within/feature:-rotate-1'
                }
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-orange-50 text-orange-700">
                  <Mail className="size-4" />
                </span>
                <div>
                  <p className="text-xs font-medium">Password recovery</p>
                  <p className="mt-0.5 text-[11px] text-neutral-500">
                    Back to your account.
                  </p>
                </div>
                <ArrowUpRight className="ml-auto size-4 shrink-0 text-neutral-500" />
              </div>
            </div>
            <p className="absolute inset-x-2 bottom-0 text-center text-[11px] text-neutral-500">
              Illustrative account interface
            </p>
          </div>
          <div className="max-w-sm py-5 md:py-6">
            <p className="mb-2 flex items-center gap-2 text-xs font-medium text-orange-700">
              <UserRound aria-hidden="true" className="size-4" />
              Accounts
            </p>
            <h3 className="text-[28px] font-medium leading-tight tracking-tight">
              Give users a home.
            </h3>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              Signup, recovery and protected pages.
            </p>
            <Link
              href="/docs/features/authentication"
              className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-700"
            >
              Explore authentication
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
            <ul className="mt-5 flex flex-col gap-3 text-xs text-neutral-600">
              {[
                { title: 'Email & password', icon: UserRound },
                { title: 'Recovery flow', icon: KeyRound },
                { title: 'Server checks', icon: ShieldCheck },
              ].map(({ title, icon: Icon }) => (
                <li key={title} className="flex items-center gap-2">
                  <Icon aria-hidden="true" className="size-4 text-orange-700" />
                  {title}
                </li>
              ))}
            </ul>
          </div>
        </article>
        <article className="group/feature grid min-w-0 items-center gap-2 py-8 md:grid-cols-[0.8fr_1.2fr] md:gap-8">
          <div className={sceneClass + ' md:order-last'}>
            <div
              role="img"
              aria-label="Illustrative Pro subscription with active status, customer portal and verified access"
              className="w-full max-w-[420px]"
            >
              <div className={planeClass + mainMotion}>
                <div className="flex items-center justify-between gap-3 px-5 pt-5">
                  <p className="text-base font-medium">
                    {pro.name} subscription
                  </p>
                  <span className={statusClass}>
                    <Check className="size-3.5" />
                    Active
                  </span>
                </div>
                <p className="flex items-baseline gap-1.5 px-5 pt-2 pb-5">
                  <span className="text-[56px] font-medium leading-tight tracking-[-0.05em]">
                    {price.amount}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {price.interval}
                  </span>
                </p>
                <div className="flex items-center justify-between gap-3 border-t border-neutral-200 px-5 py-3 text-xs">
                  <span className="text-neutral-600">Example plan</span>
                  <span>Monthly billing</span>
                </div>
              </div>
              <div
                className={
                  planeClass +
                  ' z-10 -mt-1 w-[90%] rotate-3 px-4 py-4 motion-safe:group-hover/feature:-translate-y-2 motion-safe:group-hover/feature:rotate-1 motion-safe:group-focus-within/feature:-translate-y-2 motion-safe:group-focus-within/feature:rotate-1'
                }
              >
                <p className="flex items-center gap-2 text-xs font-medium">
                  <CreditCard className="size-4 text-orange-700" />
                  Customer Portal
                  <ArrowUpRight className="ml-auto size-4 text-neutral-500" />
                </p>
                <p className="mt-2.5 flex flex-wrap gap-3 text-[11px] text-neutral-500">
                  <span>Invoices</span>
                  <span>Payment method</span>
                  <span>Cancellation</span>
                </p>
              </div>
              <ol className="mt-6 grid grid-cols-3 gap-2 text-[11px]">
                {[
                  { title: 'Checkout', icon: CreditCard },
                  { title: 'Verified event', icon: BadgeCheck },
                  { title: 'Access', icon: LockKeyhole },
                ].map(({ title, icon: Icon }, index) => (
                  <li
                    key={title}
                    className="relative flex flex-col items-center gap-1.5 sm:flex-row sm:justify-center"
                  >
                    {index > 0 && (
                      <ArrowRight className="absolute -left-2 top-0.5 size-3 text-neutral-400 sm:top-auto" />
                    )}
                    <Icon className="size-3.5 text-orange-700" />
                    <span>{title}</span>
                  </li>
                ))}
              </ol>
            </div>
            <p className="absolute inset-x-2 bottom-0 text-center text-[11px] text-neutral-500">
              Illustrative subscription interface
            </p>
          </div>
          <div className="max-w-sm py-5 md:py-6">
            <p className="mb-2 flex items-center gap-2 text-xs font-medium text-orange-700">
              <CreditCard aria-hidden="true" className="size-4" />
              Subscriptions
            </p>
            <h3 className="text-[28px] font-medium leading-tight tracking-tight">
              Connect payments to access.
            </h3>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              Checkout, webhooks and Customer Portal.
            </p>
            <Link
              href="/docs/features/payments"
              className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-700"
            >
              Explore subscription billing
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
            <ul className="mt-5 flex flex-col gap-3 text-xs text-neutral-600">
              {[
                { title: 'Monthly & yearly', icon: CalendarDays },
                { title: 'Stored status', icon: Database },
                { title: 'Billing portal', icon: CreditCard },
              ].map(({ title, icon: Icon }) => (
                <li key={title} className="flex items-center gap-2">
                  <Icon aria-hidden="true" className="size-4 text-orange-700" />
                  {title}
                </li>
              ))}
            </ul>
          </div>
        </article>
        <div className="mt-8 grid items-center gap-7 md:grid-cols-2 md:gap-10">
          <div>
            <p className="mb-2 text-xs font-medium text-orange-700">
              Your source
            </p>
            <h3 className="text-xl font-medium tracking-tight sm:text-2xl">
              Make it your application.
            </h3>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              Next.js pages, Hono APIs and Drizzle queries.
            </p>
            <Link
              href="/docs/getting-started/project-structure"
              className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
            >
              Explore the source
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
          <ul
            aria-label="Included source edit points"
            className="divide-y divide-neutral-200 text-xs"
          >
            {[
              { path: 'src/app/', name: 'Pages', icon: Folder },
              { path: 'src/api/billing.ts', name: 'API', icon: FileCode2 },
              { path: 'src/db/schema.ts', name: 'Data', icon: Database },
            ].map(({ path, name, icon: Icon }) => (
              <li key={path} className="flex flex-wrap items-center gap-3 py-3">
                <Icon aria-hidden="true" className="size-4 text-orange-700" />
                <code className="wrap-anywhere">{path}</code>
                <span className="ml-auto text-neutral-500">{name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
