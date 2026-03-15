'use client';

import { useState, type FormEvent } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/components/onboarding/AuthProvider';

function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 8 characters.';
    case 'auth/operation-not-allowed':
      return 'Email/password registration is not enabled. Please contact support.';
    default:
      return 'Registration failed. Please try again.';
  }
}

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    router.replace('/onboarding');
    return null;
  }

  const validate = (): string | null => {
    if (!email.trim()) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.';
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/onboarding');
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
        <h1 className="font-display text-3xl font-semibold text-charcoal">Create your account</h1>
        <p className="mt-2 text-charcoal/60">
          Start discovering where you will thrive.
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
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-charcoal/20 bg-white px-4 py-2.5 text-charcoal placeholder:text-charcoal/40 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/30"
              placeholder="Minimum 8 characters"
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-charcoal">
              Confirm password
            </label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-charcoal/20 bg-white px-4 py-2.5 text-charcoal placeholder:text-charcoal/40 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/30"
              placeholder="Re-enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-accent px-6 py-3 font-semibold text-cream shadow-md transition-colors hover:bg-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2 focus:ring-offset-cream disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-charcoal/60">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-terracotta hover:text-accent">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
