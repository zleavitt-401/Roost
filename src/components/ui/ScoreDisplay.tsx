'use client';

import { cn } from '@/lib/utils';

interface ScoreDisplayProps {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeConfig = {
  sm: { dimension: 48, strokeWidth: 4, fontSize: 'text-xs' },
  md: { dimension: 64, strokeWidth: 5, fontSize: 'text-sm' },
  lg: { dimension: 88, strokeWidth: 6, fontSize: 'text-base' },
} as const;

function getScoreColor(score: number): string {
  if (score >= 75) return 'stroke-sage';
  if (score >= 50) return 'stroke-terracotta';
  return 'stroke-accent';
}

function getScoreTextColor(score: number): string {
  if (score >= 75) return 'text-sage';
  if (score >= 50) return 'text-terracotta';
  return 'text-accent';
}

export function ScoreDisplay({ score, label, size = 'md' }: ScoreDisplayProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const config = sizeConfig[size];
  const radius = (config.dimension - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  const ariaLabel = label
    ? `${label}: ${clamped} out of 100`
    : `Fit score: ${clamped} out of 100`;

  return (
    <div className="flex flex-col items-center gap-1" aria-label={ariaLabel} role="img">
      <svg
        width={config.dimension}
        height={config.dimension}
        viewBox={`0 0 ${config.dimension} ${config.dimension}`}
        aria-hidden="true"
      >
        <circle
          cx={config.dimension / 2}
          cy={config.dimension / 2}
          r={radius}
          fill="none"
          strokeWidth={config.strokeWidth}
          className="stroke-charcoal/10"
        />
        <circle
          cx={config.dimension / 2}
          cy={config.dimension / 2}
          r={radius}
          fill="none"
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn('transition-all duration-500', getScoreColor(clamped))}
          transform={`rotate(-90 ${config.dimension / 2} ${config.dimension / 2})`}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          className={cn('fill-current font-semibold', config.fontSize, getScoreTextColor(clamped))}
        >
          {clamped}
        </text>
      </svg>
      {label && (
        <span className="text-xs text-charcoal/60">{label}</span>
      )}
    </div>
  );
}
