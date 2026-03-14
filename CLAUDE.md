# Roost — Claude Code Context

## What Is This Project

Roost is an AI-powered life-relocation assistant. Users discover locations where they'd
thrive — not just job listings. The AI agent pipeline processes user profiles and surfaces
personalized, context-rich relocation recommendations.

## Constitution

The project constitution lives at `.specify/memory/constitution.md`. Read it before
implementing any feature. All seven principles are non-negotiable.

## Tech Stack

- **Framework:** Next.js 14+ App Router, React 18
- **Styling:** Tailwind CSS
- **Auth/DB/Storage:** Firebase (Auth, Firestore, Storage)
- **AI:** Anthropic Claude API — `claude-sonnet-4-20250514`
- **Email:** Nodemailer + Gmail App Password
- **Deploy:** Vercel (preview per branch, prod from `main`)

## File Ownership (Principle 6)

| Team | Directories |
|------|-------------|
| Foundation | `src/lib/`, `src/types/`, firebase config |
| Auth & Onboarding | `src/app/(auth)/`, `src/app/onboarding/`, `src/components/onboarding/` |
| Agent Pipeline | `src/app/api/agents/`, `src/lib/agents/`, `src/lib/email/` |
| Results Dashboard | `src/app/dashboard/`, `src/components/dashboard/`, `src/components/ui/` |

## Key Architectural Constraints

- Agent processing is **always async** — never block on Claude API calls
- Firestore `onSnapshot` for real-time updates — no WebSockets, no polling
- Server keys (`ANTHROPIC_API_KEY`, `GMAIL_APP_PASSWORD`, Firebase Admin) MUST stay server-side
- Firebase client config is intentionally public — that's fine

## Spec Kit Workflow

1. `/speckit.constitution` — update project principles
2. `/speckit.specify <feature>` — write feature spec
3. `/speckit.clarify` — resolve open questions
4. `/speckit.plan` — design implementation
5. `/speckit.tasks` — generate task list
6. `/speckit.implement` — execute tasks
