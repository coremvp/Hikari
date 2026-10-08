import Image from 'next/image';
import { SectionHeading } from '@/components/section-heading';

const testimonials = [
  {
    name: 'dcodesdev',
    avatar: 'dcodes.png',
    text: "That's beautiful bro!",
  },
  {
    name: 'SuhailKakar',
    avatar: 'SuhailKakar.jpg',
    text: "If you've built this a few months ago, it would have saved me hours :D",
  },
  {
    name: 'SaidAitmbarek',
    avatar: 'said.jpg',
    text: 'So cool, looks really clean. Any plan to open source it? \u{263A}\u{FE0F} Wanna play with it!',
  },
  {
    name: 'magicuidesign',
    avatar: 'magicui.jpg',
    text: 'Clean \u{1F90C}',
  },
  {
    name: 'YasmeenRoumie',
    avatar: 'yasmeen.jpg',
    text: 'Ooh would love to try this out',
  },
  {
    name: 'shadcn',
    avatar: 'shadcn.jpg',
    text: '\u{1F440}',
  },
  {
    name: 'bzagrodzki',
    avatar: 'bzrag.jpg',
    text: 'Nice one! But I would prefer some more "sans" font \u{1F609}',
  },
  {
    name: 'MPlegas',
    avatar: 'MPlegas.jpg',
    text: 'Exceptional!',
  },
  {
    name: 'kvncyf_',
    avatar: 'kvn.jpg',
    text: 'Nice move.',
  },
  {
    name: '0xRaduan',
    avatar: '0xraduan.jpg',
    text: 'This looks fire',
  },
  {
    name: 'Luax0',
    avatar: 'luax0.jpg',
    text: "Can't wait to see more \u{1F440}",
  },
  {
    name: 'ausrobdev',
    avatar: 'robdev.jpg',
    text: "Let me know when its ready, I'll add it to buildatlightspeed.com - we need more high quality open source boilerplates",
  },
];

function LaunchQuote({
  testimonial,
  featured = false,
}: {
  testimonial: (typeof testimonials)[number];
  featured?: boolean;
}) {
  return (
    <figure
      className={
        featured
          ? 'flex min-h-80 flex-col justify-between border-l-2 border-orange-700 bg-neutral-50 p-7 sm:p-9'
          : 'rounded-lg border border-neutral-200 bg-white p-5'
      }
    >
      <blockquote
        className={
          featured
            ? 'max-w-lg text-2xl font-medium leading-relaxed tracking-tight sm:text-[28px]'
            : 'text-sm leading-6 text-neutral-800'
        }
      >
        <p>{testimonial.text}</p>
      </blockquote>
      <figcaption
        className={'flex items-center gap-3 ' + (featured ? 'mt-10' : 'mt-5')}
      >
        <Image
          src={`/testimonials/${testimonial.avatar}`}
          alt=""
          width={featured ? 40 : 32}
          height={featured ? 40 : 32}
          sizes={featured ? '40px' : '32px'}
          className={
            (featured ? 'size-10' : 'size-8') +
            ' shrink-0 rounded-full object-cover'
          }
        />
        <div className="min-w-0">
          {featured && (
            <p className="text-sm font-medium text-neutral-900">
              {testimonial.name}
            </p>
          )}
          <p className="wrap-anywhere text-xs leading-5 text-neutral-500">
            @{testimonial.name}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const supporting = [0, 7, 11, 8, 9];
  const remaining = testimonials.filter(
    (_, index) => index !== 1 && !supporting.includes(index),
  );
  return (
    <section aria-labelledby="testimonials-title" className="hikari-section">
      <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <SectionHeading
            id="testimonials-title"
            title="Loved from the start."
            subtitle="Built in the open."
          />
          <p className="mt-5 text-base leading-7 text-neutral-600">
            Feedback from Hikari’s first launch in 2024.
          </p>
        </div>
        <a
          href="https://x.com/antoineross__/status/1812493114948600317"
          className="inline-flex min-h-11 w-fit items-center gap-2 text-sm font-medium hover:underline underline-offset-4"
        >
          See the original launch <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className="grid gap-7 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <LaunchQuote testimonial={testimonials[1]} featured />
        <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2">
          {supporting.map((index) => (
            <div
              key={testimonials[index].name}
              className={index === 11 ? 'min-[360px]:col-span-2' : ''}
            >
              <LaunchQuote testimonial={testimonials[index]} />
            </div>
          ))}
        </div>
      </div>
      <details className="mt-7 text-sm text-neutral-600">
        <summary className="w-fit cursor-pointer py-3 font-medium">
          More launch feedback
        </summary>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {remaining.map((testimonial) => (
            <LaunchQuote key={testimonial.name} testimonial={testimonial} />
          ))}
        </div>
      </details>
    </section>
  );
}
