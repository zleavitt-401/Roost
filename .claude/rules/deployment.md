# Deployment Rules

## Vercel Setup
- Production deploys from `main` branch only (automatic via Vercel GitHub integration)
- Preview deployments created automatically for every branch push
- All environment variables set in Vercel dashboard — never in code

## Branch Strategy
- `main` — production; requires PR + review before merge
- `feature/*` — feature development; gets preview deployment
- `fix/*` — bug fixes
- Never push directly to `main`

## Environment Variables in Vercel
Required vars for production (set in Vercel dashboard):
- `NEXT_PUBLIC_FIREBASE_*` (all 6 Firebase client vars)
- `ANTHROPIC_API_KEY`
- `GMAIL_USER`
- `GMAIL_APP_PASSWORD`
- `NEXT_PUBLIC_APP_URL` (set to production URL)

## Build Requirements
- `npm run build` must pass with zero TypeScript errors before merging any PR
- ESLint must pass with zero errors
- No `console.log` statements in production code (use a logger or remove)

## Pre-Deploy Checklist
- [ ] TypeScript compiles cleanly
- [ ] ESLint passes
- [ ] All env vars set in Vercel for the target environment
- [ ] Firebase Security Rules deployed
- [ ] Smoke test auth, onboarding, and agent trigger on preview deployment

## Monitoring
- Check Vercel function logs for agent pipeline errors after deploy
- Monitor Anthropic API usage dashboard for unexpected cost spikes
