# Deployment Rules

## Vercel
- Production deploys from `main` branch only (automatic via Vercel GitHub integration)
- Every feature branch gets automatic preview deployment
- All env vars set in Vercel dashboard — never rely on `.env` files in production
- Serverless function timeout: 60 seconds max on Hobby plan — agent trigger must be async

## Environment Variables
- Development: `.env.local` (gitignored); production: Vercel project settings
- Required vars: `NEXT_PUBLIC_FIREBASE_*` (all 6), `ANTHROPIC_API_KEY`, `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `NEXT_PUBLIC_APP_URL`
- Keep `.env.example` up to date with every new var added

## Git Workflow
- `main` — production; requires PR + review before merge; never push directly
- `feature/*` — feature development; `fix/*` — bug fixes
- Commit messages: imperative tense, under 72 chars (`Add questionnaire branching logic`)
- Squash merge PRs into `main`

## Build Requirements
- `npm run build` must pass with zero TypeScript errors before merging any PR
- ESLint must pass with zero errors; no `// @ts-ignore` as a permanent fix
- No `console.log` in production code; flag any page over 200KB initial bundle

## Pre-Deploy Checklist
- [ ] TypeScript compiles cleanly
- [ ] ESLint passes
- [ ] All env vars set in Vercel for the target environment
- [ ] Firebase Security Rules deployed
- [ ] Smoke test auth, onboarding, and agent trigger on preview deployment

## Never Do
- Never deploy with `ANTHROPIC_API_KEY` missing — agents will silently fail
- Never use `next export` — Roost needs server-side API routes
- Never hardcode `localhost` URLs — use `NEXT_PUBLIC_APP_URL` env var
