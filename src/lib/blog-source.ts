import { loader } from 'fumadocs-core/source';
import { blog } from 'fumadocs-mdx:collections/server';
import { filterIndexableBlogPages } from '@/lib/blog-indexability';

export const blogSource = loader({
  baseUrl: '/blog',
  source: blog.toFumadocsSource(),
});
export function getBlogPages() {
  return filterIndexableBlogPages(blogSource.getPages()).sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  );
}
export function generateBlogParams() {
  return blogSource.generateParams().map(({ slug }) => {
    if (slug.length !== 1)
      throw new Error('Blog articles must use one URL segment.');
    return { slug: slug[0] };
  });
}
