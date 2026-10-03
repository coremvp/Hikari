import { cn } from '@/lib/utils';

export function SectionHeading({
  id,
  title,
  subtitle,
  className,
}: {
  id: string;
  title: string;
  subtitle: string;
  className?: string;
}) {
  return (
    <h2
      id={id}
      className={cn(
        'text-balance text-3xl font-medium leading-tight tracking-tight sm:text-4xl',
        className,
      )}
    >
      <span className="block">{title}</span>
      <span className="block text-neutral-500">{subtitle}</span>
    </h2>
  );
}
