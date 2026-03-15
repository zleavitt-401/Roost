'use client';

import Link from 'next/link';
import { useAuth } from '@/components/onboarding/AuthProvider';

export function NavHeader() {
  const { user, loading, signOut } = useAuth();

  return (
    <div className="flex items-center gap-4">
      {loading ? (
        <div className="h-5 w-20 animate-pulse rounded bg-charcoal/10" />
      ) : user ? (
        <>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-charcoal transition-colors hover:text-terracotta"
          >
            Dashboard
          </Link>
          <button
            onClick={signOut}
            className="rounded-lg bg-charcoal/5 px-4 py-2 text-sm font-medium text-charcoal transition-colors hover:bg-charcoal/10"
          >
            Sign Out
          </button>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="text-sm font-medium text-charcoal transition-colors hover:text-terracotta"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-terracotta px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-accent"
          >
            Get Started
          </Link>
        </>
      )}
    </div>
  );
}
