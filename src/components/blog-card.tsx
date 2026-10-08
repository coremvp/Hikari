import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

type Props = {
  href: string;
  title: string;
  date: string;
  cover?: string;
  heading?: 'h2' | 'h3' | 'h4';
  variant?: 'default' | 'featured' | 'compact';
};
export function BlogCard({
  href,
  title,
  date,
  cover,
  heading: Heading = 'h2',
  variant = 'default',
}: Props) {
  if (variant !== 'default') {
    const compact = variant === 'compact';
    return (
      <article
        className={
          'min-w-0 ' + (compact ? 'border-t border-neutral-200 pt-6' : '')
        }
      >
        <Link
          href={href}
          className={
            'group rounded-md ' +
            (compact
              ? 'grid items-center gap-4 min-[360px]:grid-cols-[100px_minmax(0,1fr)]'
              : 'block')
          }
        >
          <Image
            src={cover ?? '/sun.svg'}
            alt=""
            width={1000}
            height={525}
            sizes={compact ? '100px' : '(max-width: 1023px) 100vw, 45vw'}
            className={
              'h-auto rounded-lg border border-neutral-200 object-contain ' +
              (compact ? 'w-[100px]' : 'w-full')
            }
          />
          <div>
            <p
              className={
                (compact ? 'mb-2' : 'mt-4 mb-2') +
                ' flex items-center justify-between gap-3 text-xs text-neutral-500'
              }
            >
              <time dateTime={date}>
                {new Intl.DateTimeFormat('en', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  timeZone: 'UTC',
                }).format(new Date(date))}
              </time>
              {!compact && (
                <ChevronRight aria-hidden="true" className="size-4" />
              )}
            </p>
            <Heading
              className={
                'text-balance font-medium leading-snug tracking-tight group-hover:underline underline-offset-4 ' +
                (compact ? 'text-base' : 'text-xl sm:text-2xl')
              }
            >
              {title}
            </Heading>
            {compact && (
              <p className="mt-3 flex items-center gap-1 text-xs font-medium">
                Read article{' '}
                <ChevronRight aria-hidden="true" className="size-3.5" />
              </p>
            )}
          </div>
        </Link>
      </article>
    );
  }

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
