/** Merge class names, filtering out falsy values. */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/** Format a fit score as "85/100". */
export function formatScore(score: number): string {
  return `${Math.round(score)}/100`;
}

/** Format a dollar amount as "$2,500" (no cents). */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format a Date as "Mar 14, 2026". */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/** Map an agent status string to a theme-appropriate Tailwind text color class. */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'complete':
      return 'text-sage';
    case 'processing':
    case 'pending':
      return 'text-terracotta';
    case 'error':
      return 'text-accent';
    default:
      return 'text-charcoal';
  }
}
