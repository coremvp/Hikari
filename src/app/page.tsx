import Image from 'next/image';
import Link from 'next/link';
import { Check, FileCode2, Folder, LockKeyhole, UserRound } from 'lucide-react';
import { SiteShell } from '@/components/site-shell';
import { Testimonials } from '@/components/testimonials';
import { BlogCard } from '@/components/blog-card';
import { SectionHeading } from '@/components/section-heading';
import { DashboardPreview } from '@/components/dashboard-preview';
import {
  ApplicationPreview,
  DocumentationPreview,
} from '@/components/application-preview';
import { getBlogPages } from '@/lib/blog-source';
import { publicMetadata } from '@/lib/public-metadata';

export const metadata = publicMetadata(
  'Hikari by CoreMVP',
  'An open-source Next.js application foundation with accounts, protected pages, subscription billing, Docs, and Blog.',
  '/',
);

const foundations = [
  {
    number: '01',
    title: 'Give users a home.',
    description:
      'Email and password signup opens a protected Dashboard. Supabase Auth handles sessions and recovery.',
    href: '/docs/features/authentication',
    link: 'Accounts and authentication',
  },
  {
    number: '02',
    title: 'Connect payments to access.',
    description:
      'Stripe Checkout, verified webhooks, and stored subscription state. Customer Portal handles subscription management.',
    href: '/docs/features/payments',
    link: 'Subscription billing',
  },
  {
    number: '03',
    title: 'Make it your application.',
    description:
      'Build your product in one Next.js runtime. Hono owns the API, and Drizzle owns database access.',
    href: '/docs/getting-started/project-structure',
    link: 'Explore the source',
  },
];

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
    <SiteShell>
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
            Individual accounts, subscriptions, and content. Connected in one
            open-source Next.js application you run and make your own.
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
      <section aria-labelledby="foundation-title" className="hikari-section">
        <div className="grid items-end gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <SectionHeading
            id="foundation-title"
            title="Start where your product begins."
            subtitle="Accounts and subscriptions, connected."
          />
          <p className="max-w-sm text-lg leading-7 text-neutral-600 lg:justify-self-end">
            Give the rest of your application your attention.
          </p>
        </div>
        <ol className="mt-10 grid overflow-hidden rounded-2xl border border-neutral-200 bg-white lg:grid-cols-3">
          {foundations.map((item) => (
            <li
              key={item.number}
              className="flex min-w-0 flex-col border-neutral-200 p-6 not-first:border-t sm:flex-row sm:items-center sm:p-8 lg:flex-col lg:items-stretch lg:not-first:border-l lg:not-first:border-t-0"
            >
              <div
                aria-hidden="true"
                className="flex h-48 w-full shrink-0 items-center justify-center rounded-xl bg-neutral-50 p-5 sm:w-2/5 lg:w-full"
              >
                {item.number === '01' ? (
                  <div className="w-full max-w-64 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-800">
                        <UserRound className="size-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium">Your account</p>
                        <p className="mt-1 text-xs text-neutral-500">
                          Supabase Auth
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 flex items-center gap-2 border-t border-neutral-100 pt-3 text-xs text-neutral-600">
                      <LockKeyhole className="size-3.5" /> Protected Dashboard
                    </div>
                  </div>
                ) : item.number === '02' ? (
                  <div className="w-full max-w-64 space-y-2 text-xs">
                    {[
                      'Stripe Checkout',
                      'Verified webhook',
                      'Stored subscription',
                    ].map((step, index) => (
                      <div
                        key={step}
                        className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3 shadow-sm"
                      >
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-800">
                          {index === 1 ? (
                            <Check className="size-3" />
                          ) : (
                            index + 1
                          )}
                        </span>
                        <span className="font-medium">{step}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full max-w-64 rounded-lg border border-neutral-200 bg-white p-4 font-mono text-xs shadow-sm">
                    <p className="flex items-center gap-2 font-medium">
                      <Folder className="size-4 text-neutral-500" /> src/
                    </p>
                    <div className="ml-2 mt-3 space-y-3 border-l border-neutral-200 pl-4 text-neutral-600">
                      {['app/', 'api/billing.ts', 'db/schema.ts'].map(
                        (path) => (
                          <p key={path} className="flex items-center gap-2">
                            <FileCode2 className="size-3.5 shrink-0 text-neutral-500" />
                            {path}
                          </p>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col sm:pl-8 lg:pl-0">
                <h3 className="mt-7 text-xl font-semibold tracking-tight sm:mt-0 lg:mt-7">
                  {item.title}
                </h3>
                <p className="mt-3 flex-1 leading-7 text-neutral-600">
                  {item.description}
                </p>
                <Link
                  href={item.href}
                  className="mt-6 inline-block text-sm font-medium underline underline-offset-4"
                >
                  {item.link} <span aria-hidden="true">→</span>
                </Link>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-10 border-t border-neutral-200 pt-8">
          <h3 className="text-xl font-semibold tracking-tight">
            When to consider CoreMVP
          </h3>
          <p className="mt-3 max-w-3xl leading-7 text-neutral-600">
            Hikari is free MIT source for individual accounts, recurring
            subscriptions, Docs and Blog. CoreMVP is a premium startup
            application foundation delivered as source code, adding shared
            Organizations with invitations and roles, persisted Projects, and
            lifetime payments with guest checkout. Choose it when those paths
            fit your product. You operate either application with your own
            providers.
          </p>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium">
            <a
              href="https://coremvp.com/en/products/nextjs"
              className="underline underline-offset-4"
            >
              Explore CoreMVP <span aria-hidden="true">→</span>
            </a>
            <a
              href="https://nextjs.coremvp.com"
              className="underline underline-offset-4"
            >
              Preview the CoreMVP demo <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>
      <Testimonials />
      <section aria-labelledby="content-title" className="hikari-section">
        <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading
              id="content-title"
              title="The docs belong with the code."
              subtitle="Publish from the same repository."
            />
            <p className="mt-5 max-w-lg text-lg leading-7 text-neutral-600">
              Local MDX, searchable documentation, and an engineering blog.
            </p>
            <div className="mt-7 flex flex-wrap gap-6 text-sm font-medium">
              <Link href="/docs" className="underline underline-offset-4">
                Explore the Docs <span aria-hidden="true">→</span>
              </Link>
              <Link href="/blog" className="underline underline-offset-4">
                Read the Blog <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <DocumentationPreview />
        </div>
        {posts.length > 0 && (
          <section aria-labelledby="news-title" className="mt-20">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                id="news-title"
                title="Latest notes."
                subtitle="From the source."
              />
              <Link href="/blog" className="text-sm font-medium">
                All posts <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2">
              {posts.map((post) => (
                <BlogCard
                  key={post.url}
                  href={post.url}
                  title={post.data.title}
                  date={post.data.date}
                  cover={post.data.cover}
                  heading="h3"
                />
              ))}
            </div>
          </section>
        )}
      </section>
      <section
        aria-labelledby="source-title"
        className="hikari-section grid items-center gap-10 border-t border-neutral-200 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"
      >
        <div>
          <p className="mb-5 font-mono text-xs uppercase tracking-widest text-neutral-600">
            Your next commit starts here
          </p>
          <SectionHeading
            id="source-title"
            title="Clone it."
            subtitle="Make it yours."
          />
          <p className="mt-5 max-w-md leading-7 text-neutral-600">
            Hikari is MIT licensed. Run it locally, connect your providers, and
            build your product on top.
          </p>
          <Link
            href="/docs/getting-started"
            className="button mt-7 rounded-lg px-6"
          >
            Follow the quickstart{' '}
            <span className="ml-2" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
        <div className="min-w-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
          <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-5 py-3 text-xs text-neutral-600">
            <span className="font-mono">Terminal</span>
            <span>Local quickstart</span>
          </div>
          <pre className="overflow-x-auto p-5 text-xs leading-8 text-neutral-800 sm:p-7 sm:text-sm">
            <code>
              {
                'git clone https://github.com/coremvp/hikari.git\ncd hikari\nbun install\nbunx supabase start\n./coremvp env sync\nbun run dev'
              }
            </code>
          </pre>
          <p className="border-t border-neutral-200 bg-white px-5 py-4 text-xs leading-5 text-neutral-600 sm:px-7">
            Requires Git, Bun 1.3.14, Node.js 20.19+, Bash, and running Docker.
            The quickstart covers installation and local signup before billing.
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
