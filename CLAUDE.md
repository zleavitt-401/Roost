# CLAUDE.md
> 📜 **Single Source of Truth**: `.specify/constitution.md`
> Always check constitution before design decisions.

## Project Overview
**Roost** — An AI-powered life-relocation assistant that helps users discover US locations where they'd thrive, not just find job listings. Users upload a resume, answer lifestyle questions, and receive comprehensive location reports assembled by AI agents within 24 hours.

## Tech Stack
- **Framework**: Next.js 14+ (App Router) with React 18
- **Styling**: Tailwind CSS with custom earthy/warm design tokens
- **Auth & DB**: Firebase (Auth, Firestore, Storage)
- **AI**: Anthropic Claude API (claude-sonnet-4-20250514) with web search tool
- **Email**: Nodemailer with Gmail (Google App Password)
- **Deployment**: Vercel

## Development Workflow
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Deploy (automatic via Vercel on push to main)
git push origin main

# Preview deployments (automatic on feature branch push)
git push origin feature/branch-name
```

## Core Principles
See `.specify/constitution.md` for:
- Architecture patterns (App Router, server components, Firestore real-time listeners)
- Code quality standards (error handling, loading states, WCAG 2.1 AA)
- Security policies (env vars for secrets, Firebase Security Rules)
- Frontend design direction (earthy/warm palette, distinctive typography, NOT generic AI aesthetic)

## Directory Ownership (Agent Teams)
- **Foundation**: `src/lib/`, `src/types/`, `src/app/layout.tsx`, `src/app/page.tsx`, config files
- **Auth & Onboarding**: `src/app/(auth)/`, `src/app/onboarding/`, `src/components/onboarding/`, `src/lib/questionnaire/`
- **Agent Pipeline**: `src/app/api/`, `src/lib/agents/`, `src/lib/email/`
- **Results Dashboard**: `src/app/dashboard/`, `src/components/dashboard/`, `src/components/ui/`

Do not modify files outside your assigned directories.

## Key Data Flow
1. User registers → uploads resume → completes questionnaire
2. Profile assembled → written to Firestore (`users/{userId}/profile`)
3. Agent trigger API called (`POST /api/agents/trigger`)
4. 3 agents run async: Location Profiler → Job Scout + Housing Analyst (parallel per city)
5. Results written to Firestore (`users/{userId}/results/{resultId}`)
6. User notified via email → views results on dashboard via Firestore `onSnapshot`

## Three AI Agents (MVP)
- **Job Scout**: Matches jobs to user's parsed resume + career preferences across identified cities
- **Location Profiler**: Identifies 3-5 best-fit US cities based on lifestyle/values preferences
- **Housing & Budget Analyst**: Finds rentals and builds sample monthly budgets per city

## Current Development
**Active Work**: MVP build — foundation, auth/onboarding, agent pipeline, results dashboard (Agent Teams parallel)
**Known Issues**: None yet (greenfield project)
**Next Steps**: After MVP — partner profiles, meetup discovery agent, "Research Deeper" feature, re-run agents with updated preferences

## Environment Variables
See `.env.example` for required keys:
- `NEXT_PUBLIC_FIREBASE_*` — Firebase client config
- `ANTHROPIC_API_KEY` — Claude API (server-side only)
- `GMAIL_USER` / `GMAIL_APP_PASSWORD` — email notifications
- `NEXT_PUBLIC_APP_URL` — app base URL