'use client';
import { useActiveAnchor } from 'fumadocs-core/toc';
import type { TOCItemType } from 'fumadocs-core/toc';

export function BlogToc({ toc }: { toc: TOCItemType[] }) {
  const active = useActiveAnchor();
  return (
    <nav aria-label="On this page" className="space-y-4">
      <h2 className="text-sm font-medium">On this page</h2>
      <ul className="space-y-3 text-sm text-neutral-500">
        {toc.map((item) => (
          <li key={item.url}>
            <a
              href={item.url}
              aria-current={`#${active}` === item.url ? 'location' : undefined}
              className="hover:text-neutral-950 aria-[current=location]:text-orange-700"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
