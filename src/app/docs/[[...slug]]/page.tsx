import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '../../../../mdx-components';
import { source } from '@/lib/source';
import { publicMetadata } from '@/lib/public-metadata';

type Props = { params: Promise<{ slug?: string[] }> };
export default async function Page({ params }: Props) {
  const page = source.getPage((await params).slug);
  if (!page) notFound();
  const MDX = page.data.body;
  return (
    <DocsPage toc={page.data.toc} tableOfContent={{ style: 'clerk' }}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}
export function generateStaticParams() {
  return source.generateParams();
}
export async function generateMetadata({ params }: Props) {
  const page = source.getPage((await params).slug);
  if (!page) notFound();
  return publicMetadata(page.data.title, page.data.description ?? '', page.url);
}
