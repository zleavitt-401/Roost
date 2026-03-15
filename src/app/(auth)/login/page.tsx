'use client';

import { useState, type FormEvent } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/components/onboarding/AuthProvider';

function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    default:
      return 'Login failed. Please try again.';
  }
}

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-charcoal/60">Loading...</p>
      </div>
    );
  }

  if (user) {
    router.replace('/dashboard');
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const firebaseError = err as { code?: string };
      setError(getFirebaseErrorMessage(firebaseError.code ?? ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-charcoal/10 bg-cream p-8 shadow-sm">
        <h1 className="font-display text-3xl font-semibold text-charcoal">Welcome back</h1>
        <p className="mt-2 text-charcoal/60">
          Sign in to check your results or continue onboarding.
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-accent/20 bg-accent/5 px-4 py-3 text-sm text-accent">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-charcoal">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-charcoal/20 bg-white px-4 py-2.5 text-charcoal placeholder:text-charcoal/40 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/30"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-charcoal">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-charcoal/20 bg-white px-4 py-2.5 text-charcoal placeholder:text-charcoal/40 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/30"
              placeholder="Your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-accent px-6 py-3 font-semibold text-cream shadow-md transition-colors hover:bg-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2 focus:ring-offset-cream disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-charcoal/60">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-terracotta hover:text-accent">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
