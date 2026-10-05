import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

type Props = {
  href: string;
  title: string;
  date: string;
  cover?: string;
  heading?: 'h2' | 'h3';
};
export function BlogCard({
  href,
  title,
  date,
  cover,
  heading: Heading = 'h2',
}: Props) {
  return (
    <article className="min-w-0">
      <Link href={href} className="group block rounded-md">
        <div className="overflow-hidden rounded-md bg-neutral-950">
          <Image
            src={cover ?? '/sun.svg'}
            alt=""
            width={1000}
            height={525}
            className="aspect-[1000/525] w-full object-cover transition-opacity group-hover:opacity-90"
          />
        </div>
        <p className="mt-5 flex flex-wrap items-center gap-2 text-sm text-neutral-600">
          <span>Engineering</span>
          <span aria-hidden="true" className="text-neutral-400">
            ·
          </span>
          <time dateTime={date}>
            {new Intl.DateTimeFormat('en', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              timeZone: 'UTC',
            }).format(new Date(date))}
          </time>
        </p>
        <Heading className="mt-3 text-balance text-xl font-medium leading-snug tracking-tight sm:text-2xl">
          {title}{' '}
          <ChevronRight
            className="inline size-4 align-baseline transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Heading>
      </Link>
    </article>
  );
}
