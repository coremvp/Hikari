import type { Metadata } from 'next';
import { appUrl } from '@/lib/config';

export function publicMetadata(
  title: string,
  description: string,
  path: string,
  type: 'website' | 'article' = 'website',
): Metadata {
  const url = new URL(path, appUrl()).href;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Hikari by CoreMVP',
      type,
    },
    robots: { index: true, follow: true },
  };
}
