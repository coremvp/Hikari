import { AnchorProvider } from 'fumadocs-core/toc';
import { DocsBody } from 'fumadocs-ui/page';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '../../../../mdx-components';
import { BlogToc } from '@/components/blog-toc';
import { blogSource, generateBlogParams } from '@/lib/blog-source';
import { publicMetadata } from '@/lib/public-metadata';

type Props = { params: Promise<{ slug: string }> };
export default async function Page({ params }: Props) {
  const page = blogSource.getPage([(await params).slug]);
  if (!page) notFound();
  const MDX = page.data.body;
  return (
    <AnchorProvider toc={page.data.toc}>
      <div className="mx-auto grid max-w-5xl gap-12 py-14 md:py-20 xl:grid-cols-[minmax(0,48rem)_12rem]">
        <article className="min-w-0">
          <Link
            href="/blog"
            className="text-sm text-neutral-600 underline underline-offset-4"
          >
            Back to Blog
          </Link>
          <header className="mt-8 mb-12">
            <h1 className="text-4xl font-medium tracking-tight sm:text-5xl">
              {page.data.title}
            </h1>
            <p className="mt-5 text-lg leading-8 text-neutral-600">
              {page.data.description}
            </p>
            <p className="mt-5 text-sm text-neutral-500">
              {page.data.author} ·{' '}
              <time dateTime={page.data.date}>
                {new Intl.DateTimeFormat('en', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  timeZone: 'UTC',
                }).format(new Date(page.data.date))}
              </time>
            </p>
          </header>
          <DocsBody>
            <MDX components={getMDXComponents()} />
          </DocsBody>
          <div className="mt-12 border-t border-neutral-200 pt-6 text-sm leading-7 text-neutral-600">
            <p>
              Building beyond individual accounts? Paid CoreMVP is a premium
              startup application foundation with shared Organizations,
              invitations and roles, persisted Projects, and lifetime payments
              with guest checkout. Explore the{' '}
              <a
                href="https://coremvp.com/en/products/nextjs"
                className="font-medium text-neutral-900 underline underline-offset-4"
              >
                CoreMVP Next.js product
              </a>{' '}
              and{' '}
              <a
                href="https://nextjs.coremvp.com"
                className="font-medium text-neutral-900 underline underline-offset-4"
              >
                paid demo
              </a>
              , or{' '}
              <Link
                href="/docs/getting-started"
                className="font-medium text-neutral-900 underline underline-offset-4"
              >
                start building with free Hikari
              </Link>
              .
            </p>
          </div>
        </article>
        <aside className="sticky top-8 hidden self-start xl:block">
          <BlogToc toc={page.data.toc} />
        </aside>
      </div>
    </AnchorProvider>
  );
}
export const generateStaticParams = generateBlogParams;
export async function generateMetadata({ params }: Props) {
  const page = blogSource.getPage([(await params).slug]);
  if (!page) notFound();
  if (!page.data.index)
    return {
      title: page.data.title,
      description: page.data.description,
      robots: { index: false, follow: false },
    };
  return publicMetadata(
    page.data.title,
    page.data.description,
    page.url,
    'article',
  );
}
