'use client';

export function DashboardLoading() {
  return (
    <div className="space-y-6">
      <p className="text-center text-sm text-charcoal/70">
        Your agents are still researching. Check back soon!
      </p>
      <div className="grid gap-4 md:grid-cols-2" aria-busy="true" aria-label="Loading results">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border border-charcoal/5 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-5 w-36 rounded bg-charcoal/10" />
                <div className="h-3 w-24 rounded bg-charcoal/5" />
              </div>
              <div className="h-12 w-12 rounded-full bg-charcoal/10" />
            </div>
            <div className="mt-4 flex gap-2">
              <div className="h-5 w-16 rounded-full bg-sage/10" />
              <div className="h-5 w-20 rounded-full bg-sage/10" />
              <div className="h-5 w-14 rounded-full bg-sage/10" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-3 w-full rounded bg-charcoal/5" />
              <div className="h-3 w-3/4 rounded bg-charcoal/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
