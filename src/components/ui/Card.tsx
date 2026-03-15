'use client';

import { type ElementType, type ReactNode, type KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  as?: ElementType;
}

export function Card({ children, className, onClick, as }: CardProps) {
  const Component = as ?? 'div';
  const isInteractive = Boolean(onClick);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!onClick) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Component
      className={cn(
        'rounded-xl border border-charcoal/5 bg-white p-5 shadow-sm',
        isInteractive &&
          'cursor-pointer transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta',
        className
      )}
      onClick={onClick}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      role={isInteractive ? 'button' : undefined}
    >
      {children}
    </Component>
  );
}
