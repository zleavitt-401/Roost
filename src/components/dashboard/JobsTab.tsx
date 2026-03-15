'use client';

import type { JobMatch } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { ScoreDisplay } from '@/components/ui/ScoreDisplay';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';

interface JobsTabProps {
  jobs: JobMatch[];
}

const workStyleLabels: Record<JobMatch['workStyle'], string> = {
  remote: 'Remote',
  hybrid: 'Hybrid',
  in_person: 'In-Person',
};

export function JobsTab({ jobs }: JobsTabProps) {
  if (jobs.length === 0) {
    return (
      <EmptyState
        title="No jobs found"
        message="No matching jobs were identified for this location. Check back later as new opportunities may appear."
      />
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job, index) => (
        <Card key={`${job.company}-${job.title}-${index}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-base font-semibold text-charcoal">
                {job.title}
              </h3>
              <p className="mt-0.5 text-sm text-charcoal/70">{job.company}</p>
            </div>
            <ScoreDisplay score={job.fitScore} label="Fit" size="sm" />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium text-charcoal">
              {formatCurrency(job.salaryRange.min)} - {formatCurrency(job.salaryRange.max)}
            </span>
            <Badge text={workStyleLabels[job.workStyle]} variant="accent" />
          </div>

          <p className="mt-3 text-sm text-charcoal/60">{job.fitExplanation}</p>

          <a
            href={job.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block rounded-lg bg-terracotta/10 px-4 py-2 text-sm font-medium text-terracotta transition-colors hover:bg-terracotta/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            onClick={(e) => e.stopPropagation()}
          >
            Apply
          </a>
        </Card>
      ))}
    </div>
  );
}
