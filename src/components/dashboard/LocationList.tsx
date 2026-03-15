'use client';

import { useState } from 'react';
import type { LocationResult } from '@/types';
import { LocationCard } from './LocationCard';

interface LocationListProps {
  locations: LocationResult[];
  onSave: (locationId: string) => void;
  onDismiss: (locationId: string) => void;
}

export function LocationList({ locations, onSave, onDismiss }: LocationListProps) {
  const [showDismissed, setShowDismissed] = useState(false);

  const sorted = [...locations].sort((a, b) => b.overallFitScore - a.overallFitScore);
  const active = sorted.filter((loc) => loc.userAction !== 'dismissed');
  const dismissed = sorted.filter((loc) => loc.userAction === 'dismissed');

  return (
    <div className="space-y-6">
      {active.length === 0 && !showDismissed && (
        <p className="py-8 text-center text-sm text-charcoal/60">
          All locations dismissed. Use the toggle below to restore them.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {active.map((location) => (
          <LocationCard
            key={location.locationId}
            location={location}
            onSave={onSave}
            onDismiss={onDismiss}
          />
        ))}
      </div>

      {dismissed.length > 0 && (
        <div className="space-y-4">
          <button
            onClick={() => setShowDismissed((prev) => !prev)}
            className="mx-auto block text-sm font-medium text-charcoal/50 transition-colors hover:text-charcoal/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
          >
            {showDismissed ? 'Hide' : 'Show'} dismissed ({dismissed.length})
          </button>

          {showDismissed && (
            <div className="grid gap-4 md:grid-cols-2">
              {dismissed.map((location) => (
                <LocationCard
                  key={location.locationId}
                  location={location}
                  onSave={onSave}
                  onDismiss={onDismiss}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
