# General Development Rules

## Code Style
- TypeScript strict mode always — no `any`, no ignored type errors
- Prefer `const` over `let`; never use `var`
- Named exports over default exports for components (exception: Next.js page/layout files require default exports)
- Co-locate types with their consumers when used in only one place; shared types go in `src/types/index.ts`

## File Organization
- Respect directory ownership (see CLAUDE.md agent teams map)
- Never modify files outside your assigned team's directories without explicit permission
- Keep files under 300 lines; split into smaller modules if exceeded
- One component per file

## Error Handling
- All async functions must handle errors explicitly — no silent failures
- User-visible errors must have helpful messages, not raw exception strings
- Log errors server-side; surface friendly messages client-side

## Comments
- Write self-documenting code; comments explain *why*, not *what*
- No commented-out code in commits
- TODOs must include a ticket reference or owner

## Testing (future)
- Unit tests for all utility functions in `src/lib/`
- Integration tests for all API routes
- No mocking Firestore in tests — use the emulator
