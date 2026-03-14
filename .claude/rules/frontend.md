# Frontend Rules

## Design System
- Colors: use the custom Tailwind tokens (`terracotta`, `sage`, `cream`, `charcoal`, `accent`)
- Never use hex values inline — always use design tokens
- Typography: `font-display` (Fraunces) for headlines, `font-body` (DM Sans) for body text
- Do NOT produce generic AI aesthetic — avoid default Tailwind blue, stock gradients, and placeholder UI patterns

## Component Architecture
- Prefer React Server Components by default; add `'use client'` only when needed (event handlers, hooks, browser APIs)
- Keep client components at the leaves of the component tree
- All shared UI primitives go in `src/components/ui/`
- Feature-specific components go in their team's directory (`dashboard/`, `onboarding/`)

## Accessibility
- WCAG 2.1 AA compliance is non-negotiable
- All interactive elements need visible focus states
- Images require descriptive alt text
- Forms need proper labels (not just placeholders)
- Color alone must not convey meaning

## State Management
- No global state library for MVP — use React context + `useState`/`useReducer` where needed
- Server state (Firestore data) managed via `onSnapshot` — no additional cache layer
- Form state managed with controlled components or React Hook Form

## Loading & Error States
- Every async UI operation needs a loading state (skeleton or spinner)
- Every error condition needs a user-visible message
- Use optimistic updates sparingly — only where UX clearly benefits

## Performance
- Lazy-load heavy components with `next/dynamic`
- Use `next/image` for all images
- Avoid large client-side bundles — keep `'use client'` components lean
