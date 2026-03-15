'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/onboarding/AuthProvider';

const STEPS = [
  { label: 'Resume', path: '/onboarding/resume' },
  { label: 'Review', path: '/onboarding/resume' },
  { label: 'Questionnaire', path: '/onboarding/questionnaire' },
  { label: 'Done', path: '/dashboard' },
];

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    // For MVP, always start at resume upload step
    router.replace('/onboarding/resume');
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-charcoal/60">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-charcoal">Get started with Roost</h1>
      <p className="mt-2 text-charcoal/60">
        Complete these steps so our agents can find the best cities for you.
      </p>

      {/* Step indicator */}
      <div className="mt-8 flex items-center gap-2">
        {STEPS.map((step, i) => (
          <div key={step.label} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-charcoal/10 text-sm font-medium text-charcoal/50">
                {i + 1}
              </div>
              <span className="text-sm text-charcoal/50">{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="h-px w-8 bg-charcoal/15" />
            )}
          </div>
        ))}
      </div>

      <p className="mt-8 text-charcoal/50">Redirecting to the first step...</p>
    </div>
  );
}
