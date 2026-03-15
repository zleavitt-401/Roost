'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { doc, collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/onboarding/AuthProvider';
import type { UserProfile, AgentResults, LocationResult } from '@/types';
import { LocationList } from '@/components/dashboard/LocationList';
import { DashboardLoading } from '@/components/dashboard/DashboardLoading';
import { updateLocationAction } from '@/components/dashboard/LocationActions';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [agentStatus, setAgentStatus] = useState<UserProfile['agentStatus'] | null>(null);
  const [results, setResults] = useState<AgentResults | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  // Listen to user profile for agentStatus
  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(
      userRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as UserProfile;
          setAgentStatus(data.agentStatus);
        } else {
          setAgentStatus('pending');
        }
        setProfileLoading(false);
      },
      (err) => {
        setError(`Failed to load profile: ${err.message}`);
        setProfileLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  // Listen to results collection
  useEffect(() => {
    if (!user) return;

    const resultsRef = collection(db, 'users', user.uid, 'results');
    const unsubscribe = onSnapshot(
      resultsRef,
      (snapshot) => {
        if (snapshot.empty) {
          setResults(null);
          return;
        }
        // Use the first (most recent) result document
        const resultDoc = snapshot.docs[0];
        setResults({ ...resultDoc.data(), resultId: resultDoc.id } as AgentResults);
      },
      (err) => {
        setError(`Failed to load results: ${err.message}`);
      }
    );

    return unsubscribe;
  }, [user]);

  const handleSave = useCallback(
    async (locationId: string) => {
      if (!user || !results) return;

      const location = results.locations.find((l) => l.locationId === locationId);
      if (!location) return;

      const newAction: LocationResult['userAction'] =
        location.userAction === 'saved' ? 'none' : 'saved';

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
              l.locationId === locationId ? { ...l, userAction: location.userAction } : l
            ),
          };
        });
      }
    },
    [user, results]
  );

  const handleDismiss = useCallback(
    async (locationId: string) => {
      if (!user || !results) return;

      const location = results.locations.find((l) => l.locationId === locationId);
      if (!location) return;

      const newAction: LocationResult['userAction'] =
        location.userAction === 'dismissed' ? 'none' : 'dismissed';

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
              l.locationId === locationId ? { ...l, userAction: location.userAction } : l
            ),
          };
        });
      }
    },
    [user, results]
  );

  // Auth loading
  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner message="Loading..." />
      </div>
    );
  }

  // Profile loading
  if (profileLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner message="Loading your dashboard..." />
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <ErrorState
          title="Something went wrong"
          message={error}
          onRetry={() => {
            setError(null);
            setProfileLoading(true);
            router.refresh();
          }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-charcoal md:text-3xl">Your Results</h1>

      <div className="mt-8">
        {agentStatus === 'error' && (
          <ErrorState
            title="Agent error"
            message="Something went wrong while researching your locations. Please try again."
          />
        )}

        {agentStatus === 'processing' && !results && <DashboardLoading />}

        {(agentStatus === 'pending' || agentStatus === null) && (
          <EmptyState
            title="Complete your profile to get started"
            message="Upload your resume and answer a few questions so our agents can find the best places for you."
            action={{ label: 'Get started', href: '/onboarding' }}
          />
        )}

        {agentStatus === 'complete' && results && results.locations.length > 0 && (
          <LocationList
            locations={results.locations}
            onSave={handleSave}
            onDismiss={handleDismiss}
          />
        )}

        {agentStatus === 'complete' && results && results.locations.length === 0 && (
          <EmptyState
            title="No locations found"
            message="Our agents could not find matching locations. Try updating your preferences."
            action={{ label: 'Update preferences', href: '/onboarding' }}
          />
        )}

        {agentStatus === 'complete' && !results && (
          <EmptyState
            title="No results yet"
            message="It looks like your results are still being prepared. Check back soon."
          />
        )}
      </div>
    </div>
  );
}
