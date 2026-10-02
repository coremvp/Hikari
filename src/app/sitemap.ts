import type { MetadataRoute } from 'next';
import { appUrl } from '@/lib/config';
import { source } from '@/lib/source';
import { getBlogPages } from '@/lib/blog-source';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    '/',
    '/blog',
    ...source.getPages().map((page) => page.url),
    ...getBlogPages().map((page) => page.url),
  ].map((path) => ({ url: new URL(path, appUrl()).href }));
}
