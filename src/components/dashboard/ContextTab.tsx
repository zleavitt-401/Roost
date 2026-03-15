'use client';

import type { ContextDetails } from '@/types';
import { Card } from '@/components/ui/Card';
import { ScoreDisplay } from '@/components/ui/ScoreDisplay';

interface ContextTabProps {
  context: ContextDetails;
}

export function ContextTab({ context }: ContextTabProps) {
  const { recentNews, politicalClimate, weatherOverview, crimeIndex } = context;

  return (
    <div className="space-y-6">
      {/* Crime and weather overview */}
      <section>
        <h3 className="font-display text-base font-semibold text-charcoal">Overview</h3>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Card>
            <div className="flex items-center gap-4">
              <ScoreDisplay score={Math.max(0, 100 - crimeIndex)} label="Safety" size="md" />
              <div>
                <p className="text-xs text-charcoal/50">Crime Index</p>
                <p className="text-lg font-semibold text-charcoal">{crimeIndex}</p>
                <p className="text-xs text-charcoal/40">Lower is safer</p>
              </div>
            </div>
          </Card>
          <Card>
            <h4 className="text-xs text-charcoal/50">Weather</h4>
            <p className="mt-1 text-sm leading-relaxed text-charcoal/70">{weatherOverview}</p>
          </Card>
        </div>
      </section>

      {/* Political climate */}
      <section>
        <h3 className="font-display text-base font-semibold text-charcoal">Political Climate</h3>
        <Card className="mt-3">
          <p className="text-sm leading-relaxed text-charcoal/70">{politicalClimate}</p>
        </Card>
      </section>

      {/* Recent news */}
      {recentNews.length > 0 && (
        <section>
          <h3 className="font-display text-base font-semibold text-charcoal">Recent News</h3>
          <ul className="mt-3 space-y-2">
            {recentNews.map((item, index) => (
              <li
                key={`${item.url}-${index}`}
                className="rounded-lg border border-charcoal/5 bg-white px-4 py-3"
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-charcoal hover:text-terracotta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
                >
                  {item.headline}
                </a>
                <p className="mt-0.5 text-xs text-charcoal/40">
                  {item.source} -- {item.date}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
