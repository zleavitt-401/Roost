'use client';

import { useRouter } from 'next/navigation';
import type { LocationResult } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { ScoreDisplay } from '@/components/ui/ScoreDisplay';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

interface LocationCardProps {
  location: LocationResult;
  onSave: (locationId: string) => void;
  onDismiss: (locationId: string) => void;
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}

export function LocationCard({ location, onSave, onDismiss }: LocationCardProps) {
  const router = useRouter();
  const { locationId, city, state, overallFitScore, highlightTags, jobs, living, context, userAction } = location;
  const isSaved = userAction === 'saved';
  const isDismissed = userAction === 'dismissed';
  const topJob = jobs[0];
  const locationLabel = `${city}, ${state}`;

  const navigateToDetail = () => {
    router.push(`/dashboard/${locationId}`);
  };

  return (
    <Card
      className={cn(isDismissed && 'opacity-50')}
      onClick={navigateToDetail}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-semibold text-charcoal">
            {locationLabel}
          </h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {highlightTags.slice(0, 4).map((tag) => (
              <Badge key={tag} text={tag} />
            ))}
          </div>
        </div>
        <ScoreDisplay score={overallFitScore} size="sm" />
      </div>

      <div className="mt-4 space-y-1.5 text-sm text-charcoal/70">
        {topJob && (
          <p>
            <span className="font-medium text-charcoal">{topJob.title}</span>
            {' -- '}
            {formatCurrency(topJob.salaryRange.min)}-{formatCurrency(topJob.salaryRange.max)}
          </p>
        )}
        <p>
          Monthly budget: {formatCurrency(living.sampleBudget.total)}
        </p>
        {context.weatherOverview && (
          <p>{truncate(context.weatherOverview, 50)}</p>
        )}
      </div>

      <div className="mt-4 flex gap-2" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave(locationId);
          }}
          aria-label={isSaved ? `Unsave ${locationLabel}` : `Save ${locationLabel}`}
          className={cn(
            'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta',
            isSaved
              ? 'bg-terracotta text-white'
              : 'bg-terracotta/10 text-terracotta hover:bg-terracotta/20'
          )}
        >
          <span className="flex items-center gap-1.5">
            <svg
              className="h-4 w-4"
              fill={isSaved ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
            {isSaved ? 'Saved' : 'Save'}
          </span>
        </button>
        {!isDismissed ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDismiss(locationId);
            }}
            aria-label={`Dismiss ${locationLabel}`}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-charcoal/50 transition-colors hover:bg-charcoal/5 hover:text-charcoal/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
          >
            <span className="flex items-center gap-1.5">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
              Dismiss
            </span>
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave(locationId);
            }}
            aria-label={`Undo dismiss ${locationLabel}`}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-charcoal/50 transition-colors hover:bg-charcoal/5 hover:text-charcoal/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
          >
            Undo
          </button>
        )}
      </div>
    </Card>
  );
}
