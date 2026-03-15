'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  text: string;
  variant?: 'default' | 'accent' | 'muted';
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-sage/20 text-sage',
  accent: 'bg-terracotta/15 text-terracotta',
  muted: 'bg-charcoal/10 text-charcoal/60',
};

export function Badge({ text, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant]
      )}
    >
      {text}
    </span>
  );
}
