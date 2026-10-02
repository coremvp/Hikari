import Image from 'next/image';
import Link from 'next/link';
import { SiteShell } from '@/components/site-shell';
import { BlogCard } from '@/components/blog-card';
import { getBlogPages } from '@/lib/blog-source';
import { publicMetadata } from '@/lib/public-metadata';

export const metadata = publicMetadata(
  'Hikari by CoreMVP',
  'An open-source Next.js application foundation with accounts, protected pages, subscription billing, Docs, and Blog.',
  '/',
);

export default function Home() {
  const posts = getBlogPages().slice(0, 2);
  return (
    <SiteShell variant="public">
      <section className="mx-auto flex max-w-4xl flex-col items-center py-20 text-center md:py-28">
        <p className="eyebrow">Open source · MIT licensed</p>
        <h1 className="mt-6 text-balance text-5xl font-normal leading-[1.06] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
          A brighter start for
          <br className="hidden sm:block" /> your next application.
        </h1>
        <p className="mt-7 max-w-2xl text-balance text-lg leading-8 text-neutral-600 sm:text-xl">
          Accounts, a protected dashboard, and subscription billing in one
          Next.js application. Build your product on Hikari.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            className="button rounded-full px-7"
            href="/docs/getting-started"
          >
            Start building{' '}
            <span className="ml-2" aria-hidden="true">
              →
            </span>
          </Link>
          <a
            className="button-secondary rounded-full px-7"
            href="https://github.com/coremvp/hikari"
          >
            View on GitHub
          </a>
        </div>
        <Link
          href="/signup"
          className="mt-6 text-sm text-neutral-600 underline underline-offset-4"
        >
          Create an account
        </Link>
      </section>

      <section
        aria-labelledby="included"
        className="grid grid-cols-1 gap-5 md:grid-cols-2"
      >
        <h2 id="included" className="sr-only">
          Build on a working application
        </h2>
        <div className="rounded-3xl border border-neutral-200 p-7 sm:p-10">
          <p className="eyebrow">Accounts</p>
          <h3 className="mt-4 text-3xl font-normal tracking-tight">
            A place for your users.
          </h3>
          <p className="mt-4 max-w-lg leading-7 text-neutral-600">
            Email and password signup, sign in, and recovery through Supabase
            Auth. Protected pages check the session on the server.
          </p>
          <div className="mt-8 rounded-xl bg-neutral-50 p-6">
            <div className="flex items-center gap-3">
              <Image src="/icon.svg" alt="" width={32} height={32} />
              <div>
                <p className="font-medium">Welcome to Hikari</p>
                <p className="mt-1 text-sm text-neutral-500">
                  Your account. Your application.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-sm">
              <span className="rounded-md border border-neutral-200 bg-white px-3 py-2">
                Dashboard
              </span>
              <span className="rounded-md border border-neutral-200 bg-white px-3 py-2">
                Account
              </span>
            </div>
          </div>
          <Link
            className="mt-7 inline-block text-sm font-medium underline underline-offset-4"
            href="/signup"
          >
            Explore signup
          </Link>
        </div>
        <div className="rounded-3xl border border-neutral-200 p-7 sm:p-10">
          <p className="eyebrow">Subscriptions</p>
          <h3 className="mt-4 text-3xl font-normal tracking-tight">
            Payments connected to access.
          </h3>
          <p className="mt-4 max-w-lg leading-7 text-neutral-600">
            Stripe Checkout, verified webhooks, and persisted subscription
            state. Your users manage their subscription in Customer Portal.
          </p>
          <ol
            className="mt-8 grid gap-3 rounded-xl bg-neutral-50 p-6 text-sm sm:grid-cols-3"
            aria-label="Subscription flow"
          >
            {['Checkout', 'Webhook', 'Access'].map((step, index) => (
              <li
                key={step}
                className={`rounded-lg border px-4 py-5 ${index === 2 ? 'border-orange-200 bg-orange-50 text-orange-950' : 'border-neutral-200 bg-white'}`}
              >
                <span className="block text-xs text-neutral-500">
                  0{index + 1}
                </span>
                <span className="mt-2 block font-medium">{step}</span>
              </li>
            ))}
          </ol>
          <Link
            className="mt-7 inline-block text-sm font-medium underline underline-offset-4"
            href="/docs/features/payments"
          >
            Connect your Stripe account
          </Link>
        </div>
        <div className="rounded-3xl border border-neutral-200 p-7 sm:p-10">
          <p className="eyebrow">Content</p>
          <h3 className="mt-4 text-3xl font-normal tracking-tight">
            Explain what you build.
          </h3>
          <p className="mt-4 max-w-lg leading-7 text-neutral-600">
            Publish documentation and articles from local MDX. Navigation,
            search, code blocks, and page metadata are part of the application.
          </p>
          <div className="mt-8 grid gap-3 rounded-xl bg-neutral-50 p-6 text-sm sm:grid-cols-2">
            <Link
              href="/docs"
              className="rounded-lg border border-neutral-200 bg-white p-4 font-medium"
            >
              Documentation
              <span className="mt-2 block font-normal text-neutral-500">
                From first run to deployment.
              </span>
            </Link>
            <Link
              href="/blog"
              className="rounded-lg border border-neutral-200 bg-white p-4 font-medium"
            >
              Engineering notes
              <span className="mt-2 block font-normal text-neutral-500">
                Decisions behind the source.
              </span>
            </Link>
          </div>
          <Link
            className="mt-7 inline-block text-sm font-medium underline underline-offset-4"
            href="/docs/features/documentation"
          >
            Make the content your own
          </Link>
        </div>
        <div className="rounded-3xl border border-neutral-200 p-7 sm:p-10">
          <p className="eyebrow">Your code</p>
          <h3 className="mt-4 text-3xl font-normal tracking-tight">
            Clone it. Make it yours.
          </h3>
          <p className="mt-4 max-w-lg leading-7 text-neutral-600">
            One repository and one deployable Next.js runtime. Hono handles the
            API, Drizzle handles persistence, and you own the product.
          </p>
          <div className="mt-8 overflow-x-auto rounded-xl bg-neutral-50 p-6">
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-neutral-500">
              Run locally
            </p>
            <pre className="text-sm leading-7">
              <code>
                {
                  'git clone https://github.com/coremvp/hikari.git\ncd hikari\nbun install\nbunx supabase start\n./coremvp env sync\nbun run dev'
                }
              </code>
            </pre>
          </div>
          <Link
            className="mt-7 inline-block text-sm font-medium underline underline-offset-4"
            href="/docs/getting-started"
          >
            Follow the quickstart
          </Link>
        </div>
      </section>

      {posts.length > 0 && (
        <section
          aria-labelledby="latest-posts"
          className="mx-auto max-w-4xl py-20 md:py-28"
        >
          <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">From the source</p>
              <h2
                id="latest-posts"
                className="mt-4 text-3xl font-normal tracking-tight sm:text-4xl"
              >
                Notes for your next build.
              </h2>
            </div>
            <Link href="/blog" className="text-sm underline underline-offset-4">
              View all articles
            </Link>
          </div>
          <div className="grid gap-10 sm:grid-cols-2">
            {posts.map((post) => (
              <BlogCard
                key={post.url}
                href={post.url}
                title={post.data.title}
                description={post.data.description}
                date={post.data.date}
              />
            ))}
          </div>
        </section>
      )}
    </SiteShell>
  );
}
