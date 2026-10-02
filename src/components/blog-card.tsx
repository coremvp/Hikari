import Image from 'next/image';
import Link from 'next/link';

type Props = { href: string; title: string; description: string; date: string };
export function BlogCard({ href, title, description, date }: Props) {
  return (
    <article className="group flex min-w-0 flex-col gap-5">
      <Link
        href={href}
        className="relative flex aspect-[4/3] flex-col justify-between rounded-2xl bg-orange-50 p-7 transition-colors group-hover:bg-orange-100"
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          <Image src="/icon.svg" alt="" width={24} height={24} />
          Hikari
        </span>
        <span className="max-w-xs text-3xl font-medium tracking-tight text-orange-950">
          {title}
        </span>
        <span className="text-xs font-medium uppercase tracking-widest text-orange-800">
          Engineering notes
        </span>
      </Link>
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          <Link href={href}>{title}</Link>
        </h2>
        <p className="mt-2 text-sm leading-6 text-neutral-600">{description}</p>
        <time dateTime={date} className="mt-3 block text-sm text-neutral-500">
          {new Intl.DateTimeFormat('en', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            timeZone: 'UTC',
          }).format(new Date(date))}
        </time>
      </div>
    </article>
  );
}
