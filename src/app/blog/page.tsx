import Link from 'next/link';
import { BlogCard } from '@/components/blog-card';
import { getBlogPages } from '@/lib/blog-source';
import { publicMetadata } from '@/lib/public-metadata';

export const metadata = publicMetadata(
  'Blog',
  'Engineering decisions behind Hikari’s open-source application foundation.',
  '/blog',
);
export default function Page() {
  const posts = getBlogPages();
  return (
    <div className="py-16 md:py-24">
      <header className="mx-auto max-w-3xl text-center">
        <p className="eyebrow">From Hikari</p>
        <h1 className="mt-4 text-4xl font-medium tracking-tight sm:text-5xl">
          Engineering notes.
        </h1>
        <p className="mt-5 text-lg leading-8 text-neutral-600">
          The decisions behind the application, the boundaries that matter, and
          what you can build on top.
        </p>
        <p className="mt-4 text-sm text-neutral-600">
          For setup and configuration, start with the{' '}
          <Link className="underline underline-offset-4" href="/docs">
            documentation
          </Link>
          .
        </p>
      </header>
      <section
        aria-label="Blog posts"
        className="mx-auto mt-12 grid max-w-4xl gap-10 sm:grid-cols-2"
      >
        {posts.map((post) => (
          <BlogCard
            key={post.url}
            href={post.url}
            title={post.data.title}
            description={post.data.description}
            date={post.data.date}
          />
        ))}
        {posts.length === 0 && (
          <p className="text-center text-neutral-600 sm:col-span-2">
            No articles have been published yet.
          </p>
        )}
      </section>
    </div>
  );
}
