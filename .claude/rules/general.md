# General Project Rules

Roost is an AI-powered relocation assistant built with Next.js, Firebase, and Claude API.

## Code Style
- TypeScript strict mode always — no `any` (use `unknown` and narrow), no ignored type errors
- Prefer `const` over `let`; never use `var`
- Named exports over default exports for components (exception: Next.js page/layout files require default exports)
- Prefer early returns over nested conditionals
- Shared types live in `src/types/index.ts` — import from there, never redefine

## File Organization
- Respect directory ownership (see CLAUDE.md agent teams map)
- Never modify files outside your assigned team's directories without explicit permission
- Keep files under 300 lines; split into smaller modules if exceeded
- One component per file; utilities/hooks in `src/lib/` — check before creating new helpers

## Naming
- Components: PascalCase (`LocationCard.tsx`)
- Utilities/hooks: camelCase (`useFirestore.ts`, `parseResume.ts`)
- API routes: kebab-case directories (`/api/agents/trigger/`)

## Error Handling
- All async functions must handle errors explicitly — no silent failures
- Use descriptive messages that include the operation: `Failed to parse resume: ${error.message}`
- Log errors server-side; surface friendly messages client-side

## Comments
- Write self-documenting code; comments explain *why*, not *what*
- No commented-out code in commits; no `console.log` in production code

## Never Do
- Never use `any` type
- Never commit `.env` files — use `.env.example` as template
- Never use `console.log` in production — use a logger utility or remove before commit
