'use client';

import Link from 'next/link';

export function ConfirmationScreen() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center">
      {/* Animated search indicator */}
      <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 animate-ping rounded-full bg-terracotta/20" />
        <div className="absolute inset-2 animate-pulse rounded-full bg-terracotta/10" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-terracotta/15">
          <svg
            className="h-8 w-8 text-terracotta"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <h2 className="font-display text-3xl font-semibold text-charcoal">
        Your agents are researching
      </h2>
      <p className="mt-4 text-lg leading-relaxed text-charcoal/70">
        Our AI agents are now analyzing your profile and searching for the best cities,
        jobs, and housing options for you. You will receive an email when your results
        are ready -- typically within 24 hours.
      </p>

      <div className="mt-8 rounded-xl border border-sage/30 bg-sage/5 px-6 py-4">
        <p className="text-sm text-charcoal/60">
          Here is what is happening behind the scenes:
        </p>
        <ul className="mt-3 flex flex-col gap-2 text-left text-sm text-charcoal/70">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 block h-2 w-2 shrink-0 rounded-full bg-sage" />
            Location Profiler is identifying 3-5 best-fit US cities
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 block h-2 w-2 shrink-0 rounded-full bg-sage" />
            Job Scout is matching roles to your skills across those cities
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 block h-2 w-2 shrink-0 rounded-full bg-sage" />
            Housing Analyst is finding rentals and building sample budgets
          </li>
        </ul>
      </div>

      <Link
        href="/dashboard"
        className="mt-10 inline-block rounded-lg bg-accent px-8 py-3 font-semibold text-cream shadow-md transition-colors hover:bg-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2 focus:ring-offset-cream"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
