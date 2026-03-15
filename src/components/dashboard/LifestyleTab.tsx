'use client';

import type { LifestyleDetails } from '@/types';
import { ScoreDisplay } from '@/components/ui/ScoreDisplay';
import { Card } from '@/components/ui/Card';

interface LifestyleTabProps {
  lifestyle: LifestyleDetails;
}

export function LifestyleTab({ lifestyle }: LifestyleTabProps) {
  const { walkScore, transitScore, nearbyHobbies, foodScene, demographics } = lifestyle;

  return (
    <div className="space-y-6">
      {/* Walkability scores */}
      <section>
        <h3 className="font-display text-base font-semibold text-charcoal">Walkability</h3>
        <div className="mt-3 flex gap-6">
          <ScoreDisplay score={walkScore} label="Walk Score" size="lg" />
          <ScoreDisplay score={transitScore} label="Transit Score" size="lg" />
        </div>
      </section>

      {/* Nearby hobbies */}
      {nearbyHobbies.length > 0 && (
        <section>
          <h3 className="font-display text-base font-semibold text-charcoal">Nearby Hobbies</h3>
          <ul className="mt-3 space-y-2">
            {nearbyHobbies.map((hobby, index) => (
              <li
                key={`${hobby.name}-${index}`}
                className="flex items-center justify-between rounded-lg border border-charcoal/5 bg-white px-4 py-3 text-sm"
              >
                <div>
                  <span className="font-medium text-charcoal">{hobby.name}</span>
                  <span className="ml-2 text-charcoal/50">{hobby.type}</span>
                </div>
                <span className="shrink-0 text-charcoal/50">{hobby.distance}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Food scene */}
      <section>
        <h3 className="font-display text-base font-semibold text-charcoal">Food Scene</h3>
        <Card className="mt-3">
          <p className="text-sm leading-relaxed text-charcoal/70">{foodScene}</p>
        </Card>
      </section>

      {/* Demographics */}
      <section>
        <h3 className="font-display text-base font-semibold text-charcoal">Demographics</h3>
        <Card className="mt-3">
          <p className="text-sm leading-relaxed text-charcoal/70">{demographics}</p>
        </Card>
      </section>
    </div>
  );
}
