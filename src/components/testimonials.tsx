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

export function Testimonials() {
  return (
    <section aria-labelledby="testimonials-title" className="hikari-section">
      <div className="mx-auto max-w-5xl text-center">
        <SectionHeading
          id="testimonials-title"
          title="What people are saying on Twitter."
          subtitle="Feedback from Hikari’s first launch in 2024."
        />
      </div>
      <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
        {testimonials.map((testimonial) => (
          <figure
            key={testimonial.name}
            className="mb-5 break-inside-avoid rounded-2xl border border-neutral-200 bg-white p-5"
          >
            <figcaption className="flex items-center gap-3">
              <Image
                src={`/testimonials/${testimonial.avatar}`}
                alt=""
                width={48}
                height={48}
                sizes="48px"
                className="size-12 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="break-words text-base font-semibold leading-6">
                  {testimonial.name}
                </p>
                <p className="mt-0.5 break-words text-sm text-neutral-500">
                  @{testimonial.name}
                </p>
              </div>
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="size-5 shrink-0 self-start text-neutral-500"
              >
                <path d="M22 5.92a8.38 8.38 0 0 1-2.4.66 4.2 4.2 0 0 0 1.84-2.32 8.4 8.4 0 0 1-2.66 1.02 4.2 4.2 0 0 0-7.15 3.83 11.92 11.92 0 0 1-8.66-4.39 4.2 4.2 0 0 0 1.3 5.6 4.16 4.16 0 0 1-1.9-.52v.05a4.2 4.2 0 0 0 3.36 4.12 4.2 4.2 0 0 1-1.9.07 4.2 4.2 0 0 0 3.92 2.91A8.42 8.42 0 0 1 2 18.67a11.88 11.88 0 0 0 6.44 1.89c7.73 0 11.96-6.4 11.96-11.96l-.01-.54A8.54 8.54 0 0 0 22 5.92Z" />
              </svg>
            </figcaption>
            <blockquote className="mt-5 text-base leading-7 text-neutral-800">
              <p>{testimonial.text}</p>
            </blockquote>
          </figure>
        ))}
      </div>
      <div className="mt-6 text-center">
        <a
          href="https://x.com/antoineross__/status/1812493114948600317"
          className="text-sm font-medium underline underline-offset-4"
        >
          See the original launch <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
