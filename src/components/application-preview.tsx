'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, type KeyboardEvent } from 'react';

const views = [
  {
    name: 'Dashboard',
    image: '/previews/dashboard.jpg',
    route: '/dashboard',
    description: 'A protected workspace, ready for your product.',
    alt: 'Hikari Dashboard with a signed-in demonstration account, a Manage account link, and a subscriber workspace requiring an active subscription.',
    link: 'Try the dashboard',
  },
  {
    name: 'Billing',
    image: '/previews/billing.jpg',
    route: '/account',
    description: 'Account and subscription controls in one place.',
    alt: 'Hikari Account showing a demonstration email, Sign out, no active subscription access, Start subscription, and Refresh subscription.',
    link: 'Explore your account',
  },
  {
    name: 'Docs',
    image: '/previews/docs.jpg',
    route: '/docs',
    description: 'Searchable documentation, published from local MDX.',
    alt: 'Hikari Documentation with navigation for getting started, authentication, subscriptions, content, deployment, and verification.',
    link: 'Read the documentation',
  },
];

export function ApplicationPreview() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const view = views[selected];
  function move(event: KeyboardEvent<HTMLButtonElement>) {
    const next =
      event.key === 'ArrowRight'
        ? (selected + 1) % views.length
        : event.key === 'ArrowLeft'
          ? (selected + views.length - 1) % views.length
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? views.length - 1
              : undefined;
    if (next === undefined) return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  }
  return (
    <div className="relative mx-auto max-w-5xl">
      <div
        className="mb-5 flex justify-center"
        role="tablist"
        aria-label="Application previews"
      >
        <div className="flex rounded-full border border-orange-900/10 bg-white p-1 shadow-sm">
          {views.map((item, index) => (
            <button
              key={item.name}
              ref={(element) => {
                tabs.current[index] = element;
              }}
              id={`preview-tab-${index}`}
              role="tab"
              aria-selected={selected === index}
              aria-controls={`preview-panel-${index}`}
              tabIndex={selected === index ? 0 : -1}
              onClick={() => setSelected(index)}
              onKeyDown={move}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors sm:px-6 ${selected === index ? 'bg-orange-100 text-orange-950' : 'text-neutral-600 hover:bg-neutral-50'}`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
      {views.map((item, index) => (
        <div
          key={item.name}
          id={`preview-panel-${index}`}
          role="tabpanel"
          aria-labelledby={`preview-tab-${index}`}
          hidden={selected !== index}
        >
          <div className="hikari-preview-frame">
            <div className="flex items-center gap-3 border-b border-neutral-200 bg-neutral-50 px-4 py-3">
              <span className="flex gap-1.5" aria-hidden="true">
                <span className="size-2 rounded-full bg-neutral-300" />
                <span className="size-2 rounded-full bg-neutral-300" />
                <span className="size-2 rounded-full bg-neutral-300" />
              </span>
              <span className="flex-1 text-center font-mono text-xs text-neutral-500">
                hikari{item.route}
              </span>
              <span className="w-9" aria-hidden="true" />
            </div>
            <div
              className="hikari-preview-scroll"
              role="region"
              tabIndex={0}
              aria-label={`${item.name} screenshot; scroll horizontally on small screens`}
            >
              <Image
                src={item.image}
                unoptimized
                alt={item.alt}
                width={1120}
                height={700}
                className="hikari-preview-image"
              />
            </div>
          </div>
        </div>
      ))}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-neutral-600">
        <p>
          {view.description}{' '}
          <span className="text-neutral-500">
            Actual interface{selected !== 2 && ' · demo account'}
          </span>
        </p>
        <Link
          href={view.route}
          className="font-medium text-neutral-900 underline underline-offset-4"
        >
          {view.link} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
