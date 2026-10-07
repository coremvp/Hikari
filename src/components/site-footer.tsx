import Link from 'next/link';
import { Logo } from '@/components/logo';

export function SiteFooter() {
  return (
    <footer id="footer" className="relative isolate overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-6 pt-16 sm:pt-20">
        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <Link
              href="/docs/getting-started"
              className="group inline-flex items-center gap-4 text-3xl font-medium tracking-tight text-neutral-800 sm:text-4xl lg:text-5xl"
            >
              <span className="decoration-2 underline-offset-8 group-hover:underline">
                Start building
              </span>
              <span
                aria-hidden="true"
                className="text-orange-700 motion-safe:transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
            <p className="mt-5 text-sm leading-6 text-neutral-600">
              Free and open source. Make it yours.
            </p>
          </div>
          <nav
            aria-label="Footer navigation"
            className="grid grid-cols-2 gap-8 text-sm"
          >
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest">
                Build
              </h2>
              <ul className="mt-5 flex flex-col gap-3 text-neutral-600">
                <li>
                  <Link
                    className="hover:text-neutral-950"
                    href="/docs/getting-started"
                  >
                    Quickstart
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-neutral-950" href="/docs">
                    Docs
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-neutral-950" href="/blog">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest">
                Project
              </h2>
              <ul className="mt-5 flex flex-col gap-3 text-neutral-600">
                <li>
                  <a
                    className="hover:text-neutral-950"
                    href="https://github.com/coremvp/hikari"
                  >
                    Source on GitHub
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-neutral-950"
                    href="https://github.com/coremvp/hikari/blob/main/LICENSE"
                  >
                    MIT license
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-neutral-950"
                    href="https://coremvp.com/en/products/nextjs"
                  >
                    Paid CoreMVP product
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-neutral-950"
                    href="https://nextjs.coremvp.com"
                  >
                    Paid demo
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none relative isolate mt-16 overflow-hidden px-6 pb-10 pt-12 sm:mt-20 sm:pb-12"
      >
        <div className="absolute left-1/2 top-0 -z-10 aspect-square w-[min(900px,115vw)] -translate-x-1/2 rounded-full bg-[url('/sun.svg')] bg-cover md:w-[min(900px,85vw)]" />
        <div className="mx-auto max-w-7xl select-none text-center text-[clamp(6rem,28vw,24rem)] font-medium leading-[0.85] tracking-[-0.075em] text-neutral-950">
          hikari
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-8">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5 text-sm">
          <Link
            href="/"
            aria-label="Hikari home"
            className="inline-flex items-center gap-2 font-semibold"
          >
            <Logo />
          </Link>
          <p className="text-neutral-600">
            Open source under MIT · By{' '}
            <a
              href="https://coremvp.com"
              className="underline underline-offset-4"
            >
              CoreMVP
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
