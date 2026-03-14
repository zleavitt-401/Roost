---
paths:
  - "src/app/**/*.tsx"
  - "src/components/**/*.tsx"
---

# Frontend & UI Rules

## Design Direction
- Warm, earthy palette: use Tailwind tokens `terracotta`, `sage`, `cream`, `charcoal`, `accent` — never hardcode hex values
- Typography: `font-display` (Fraunces) for headlines, `font-body` (DM Sans) for body text
- The vibe is "a thoughtful friend helping you find home" — NOT a corporate relocation tool
- Never use generic AI aesthetic: no purple gradients, no Inter/Roboto, no cookie-cutter layouts
- Generous whitespace, card-based layouts, subtle transitions

## Component Architecture
- Prefer React Server Components by default; add `'use client'` only when needed (event handlers, hooks, browser APIs)
- Keep client components at the leaves of the component tree — keep them lean
- All shared UI primitives go in `src/components/ui/`; feature-specific components in team directories
- Loading states: skeleton loaders for cards, spinners for actions; always provide empty-state messaging + CTA

## Accessibility (WCAG 2.1 AA)
- Every image has meaningful `alt` text
- Proper heading hierarchy (`h1 → h2 → h3`, no skipping)
- All form inputs have associated `<label>` elements — not just placeholders
- All interactive elements keyboard-navigable with visible focus indicators
- Color contrast ratio minimum 4.5:1 for text; color alone must not convey meaning

## Responsive
- Mobile-first: design for 375px width, scale up
- Location cards stack vertically on mobile, grid on desktop
- Tab navigation on deep-dive view becomes accordion on mobile

## State & Performance
- No global state library for MVP — React context + `useState`/`useReducer`
- Form state managed with controlled components or React Hook Form
- Lazy-load heavy components with `next/dynamic`; use `next/image` for all images

## Never Do
- Never use inline `style={{}}` — always Tailwind
- Never skip loading/error/empty states on async data
- Never hardcode text strings that should come from data
