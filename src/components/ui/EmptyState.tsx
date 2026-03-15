'use client';

import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  message: string;
  action?: { label: string; href: string };
}

export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-terracotta/10"
        aria-hidden="true"
      >
        <svg
          className="h-8 w-8 text-terracotta"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
          />
        </svg>
      </div>
      <h2 className="font-display text-xl font-semibold text-charcoal">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-charcoal/60">{message}</p>
      {action && (
        <Link
          href={action.href}
          className="mt-6 inline-block rounded-lg bg-terracotta px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracotta/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
