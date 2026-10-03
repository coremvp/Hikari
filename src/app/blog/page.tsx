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
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-medium tracking-tight sm:text-5xl">
            Blog
          </h1>
          <p className="mt-4 text-lg leading-7 text-neutral-600">
            The decisions behind the application, the boundaries that matter,
            and what you can build on top.
          </p>
        </div>
        <Link
          className="text-sm font-medium underline underline-offset-4"
          href="/docs"
        >
          Read the Docs
        </Link>
      </header>
      <section
        aria-label="Blog posts"
        className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2"
      >
        {posts.map((post) => (
          <BlogCard
            key={post.url}
            href={post.url}
            title={post.data.title}
            cover={post.data.cover}
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
