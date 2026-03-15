'use client';

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3" role="status">
      <div
        className="h-8 w-8 animate-spin rounded-full border-3 border-terracotta/30 border-t-terracotta"
        aria-hidden="true"
      />
      {message ? (
        <p className="text-sm text-charcoal/70">{message}</p>
      ) : (
        <span className="sr-only">Loading</span>
      )}
    </div>
  );
}
