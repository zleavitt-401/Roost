'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/onboarding/AuthProvider';
import type { AgentResults, LocationResult } from '@/types';
import { updateLocationAction } from '@/components/dashboard/LocationActions';
import { ScoreDisplay } from '@/components/ui/ScoreDisplay';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabPanel } from '@/components/ui/Tabs';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { JobsTab } from '@/components/dashboard/JobsTab';
import { LivingTab } from '@/components/dashboard/LivingTab';
import { LifestyleTab } from '@/components/dashboard/LifestyleTab';
import { ContextTab } from '@/components/dashboard/ContextTab';

const TABS = [
  { id: 'jobs', label: 'Jobs' },
  { id: 'living', label: 'Living' },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'context', label: 'Context' },
] as const;

interface PageProps {
  params: Promise<{ locationId: string }>;
}

export default function LocationDetailPage({ params }: PageProps) {
  const { locationId } = use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [results, setResults] = useState<AgentResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('jobs');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  // Listen to results
  useEffect(() => {
    if (!user) return;

    const resultsRef = collection(db, 'users', user.uid, 'results');
    const unsubscribe = onSnapshot(
      resultsRef,
      (snapshot) => {
        if (snapshot.empty) {
          setResults(null);
        } else {
          const resultDoc = snapshot.docs[0];
          setResults({ ...resultDoc.data(), resultId: resultDoc.id } as AgentResults);
        }
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  const location: LocationResult | undefined = results?.locations.find(
    (l) => l.locationId === locationId
  );

  const handleAction = useCallback(
    async (action: LocationResult['userAction']) => {
      if (!user || !results || !location) return;

      const previousAction = location.userAction;
      const newAction = previousAction === action ? 'none' : action;

      // Optimistic update
      setResults((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          locations: prev.locations.map((l) =>
            l.locationId === locationId ? { ...l, userAction: newAction } : l
          ),
        };
      });

      try {
        await updateLocationAction(user.uid, results.resultId, locationId, newAction);
      } catch {
        // Revert on error
        setResults((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            locations: prev.locations.map((l) =>
              l.locationId === locationId ? { ...l, userAction: previousAction } : l
            ),
          };
        });
      }
    },
    [user, results, location, locationId]
  );

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner message="Loading location details..." />
      </div>
    );
  }

  if (!location) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <ErrorState
          title="Location not found"
          message="We could not find the location you are looking for."
          onRetry={() => router.push('/dashboard')}
        />
      </div>
    );
  }

  const locationLabel = `${location.city}, ${location.state}`;
  const isSaved = location.userAction === 'saved';

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm font-medium text-charcoal/50 transition-colors hover:text-charcoal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        Back to results
      </Link>

      {/* Header */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-charcoal md:text-3xl">
            {locationLabel}
          </h1>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {location.highlightTags.map((tag) => (
              <Badge key={tag} text={tag} />
            ))}
          </div>
        </div>
        <ScoreDisplay score={location.overallFitScore} label="Fit Score" size="lg" />
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => handleAction('saved')}
          aria-label={isSaved ? `Unsave ${locationLabel}` : `Save ${locationLabel}`}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta ${
            isSaved
              ? 'bg-terracotta text-white'
              : 'bg-terracotta/10 text-terracotta hover:bg-terracotta/20'
          }`}
        >
          {isSaved ? 'Saved' : 'Save'}
        </button>
        <button
          onClick={() => handleAction('dismissed')}
          aria-label={`Dismiss ${locationLabel}`}
          className="rounded-lg px-4 py-2 text-sm font-medium text-charcoal/50 transition-colors hover:bg-charcoal/5 hover:text-charcoal/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
        >
          Dismiss
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-8">
        <Tabs
          tabs={[...TABS]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <TabPanel id="jobs" activeTab={activeTab}>
          <JobsTab jobs={location.jobs} />
        </TabPanel>
        <TabPanel id="living" activeTab={activeTab}>
          <LivingTab living={location.living} />
        </TabPanel>
        <TabPanel id="lifestyle" activeTab={activeTab}>
          <LifestyleTab lifestyle={location.lifestyle} />
        </TabPanel>
        <TabPanel id="context" activeTab={activeTab}>
          <ContextTab context={location.context} />
        </TabPanel>
      </div>
    </div>
  );
}
