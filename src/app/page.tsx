import Image from 'next/image';
import Link from 'next/link';
import { SiteShell } from '@/components/site-shell';
import { Testimonials } from '@/components/testimonials';
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
            <br className="hidden sm:block" /> your next application.
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
        </div>
        <div className="relative px-6 pb-10 sm:px-10 sm:pb-12">
          <ApplicationPreview />
        </div>
      </section>
      <section aria-labelledby="foundation-title" className="hikari-section">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">A working foundation</p>
          <h2
            id="foundation-title"
            className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Start where your product begins.
          </h2>
          <p className="mt-5 text-lg leading-7 text-neutral-600">
            The account-to-subscription path is already connected. Give the rest
            of your application your attention.
          </p>
        </div>
        <ol className="mt-12 grid gap-8 md:grid-cols-3 md:gap-0">
          {foundations.map((item) => (
            <li key={item.number} className="hikari-foundation">
              <span className="inline-flex size-9 items-center justify-center rounded-full border border-orange-200 bg-orange-50 font-mono text-xs text-orange-800">
                {item.number}
              </span>
              <h3 className="mt-5 text-xl font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="mt-3 leading-7 text-neutral-600">
                {item.description}
              </p>
              <Link
                href={item.href}
                className="mt-5 inline-block text-sm font-medium underline underline-offset-4"
              >
                {item.link} <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
      <Testimonials />
      <section aria-labelledby="content-title" className="hikari-section">
        <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="eyebrow">Your application, explained</p>
            <h2
              id="content-title"
              className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              The docs belong
              <br className="hidden lg:block" /> with the code.
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-7 text-neutral-600">
              Local MDX, searchable documentation, and an engineering blog.
              Publish what you build from the same repository.
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
          <div className="mt-14 border-t border-neutral-200 pt-8">
            <p className="eyebrow">From the source</p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {posts.map((post) => (
                <Link
                  key={post.url}
                  href={post.url}
                  className="group rounded-xl border border-neutral-200 bg-white p-6 transition-colors hover:border-orange-300"
                >
                  <h3 className="text-xl font-semibold tracking-tight group-hover:text-orange-800">
                    {post.data.title} <span aria-hidden="true">↗</span>
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">
                    {post.data.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
      <section
        aria-labelledby="source-title"
        className="hikari-source mb-12 grid items-center gap-10 rounded-2xl p-7 sm:p-10 lg:grid-cols-2 lg:p-12"
      >
        <div>
          <Image src="/icon.svg" alt="" width={40} height={40} />
          <p className="eyebrow mt-6">Your source code</p>
          <h2
            id="source-title"
            className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Clone it.
            <br />
            Make it yours.
          </h2>
          <p className="mt-5 max-w-md leading-7 text-neutral-600">
            Hikari is MIT licensed. Run it locally, connect your providers, and
            build your product on top.
          </p>
          <Link
            href="/docs/getting-started"
            className="button mt-7 rounded-full px-7"
          >
            Follow the quickstart{' '}
            <span className="ml-2" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
        <div className="min-w-0 rounded-xl border border-neutral-800 bg-neutral-950 text-neutral-100 shadow-xl">
          <p className="border-b border-neutral-800 px-5 py-3 font-mono text-xs text-neutral-400">
            hikari / run locally
          </p>
          <pre className="overflow-x-auto p-5 text-xs leading-7 sm:text-sm">
            <code>
              {
                'git clone https://github.com/coremvp/hikari.git\ncd hikari\nbun install\nbunx supabase start\n./coremvp env sync\nbun run dev'
              }
            </code>
          </pre>
          <p className="border-t border-neutral-800 px-5 py-3 text-xs leading-5 text-neutral-400">
            Requires Bun, Node.js 20.19+, and Docker. The quickstart covers
            local setup and provider configuration.
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
