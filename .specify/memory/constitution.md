<!--
SYNC IMPACT REPORT
==================
Version change: (none) → 1.0.0 (initial ratification)
Added sections: All — this is the first version of the Roost constitution.
Modified principles: N/A
Removed sections: N/A
Templates updated:
  ✅ .specify/templates/constitution-template.md — seeded from this document
  ✅ .specify/templates/spec-template.md — created with constitution-aligned sections
  ✅ .specify/templates/plan-template.md — created with file-ownership enforcement
  ✅ .specify/templates/tasks-template.md — created with team-ownership task categories
Deferred TODOs:
  - TODO(RATIFICATION_DATE): Set to today 2026-03-13 (project inception date assumed)
-->

# Roost Project Constitution

**Version:** 1.0.0
**Ratification Date:** 2026-03-13
**Last Amended:** 2026-03-13

---

## Project Identity

**Roost** is an AI-powered life-relocation assistant that helps users discover locations where
they'd truly thrive — not just surface job listings. The product acts as a thoughtful friend
helping users find home, combining deep user profiling with AI agent orchestration to surface
personalized, context-rich relocation recommendations.

---

## Principle 1 — User-First Resilience

Every user-facing feature MUST implement error handling and loading states. No feature ships
without graceful degradation. All forms MUST validate input client-side before submission.
The product MUST remain usable (read-only at minimum) even when backend agent processing
is delayed or unavailable.

**Rationale:** Agent pipelines are inherently async and can be slow or fail. Users MUST
never be left staring at a blank screen or receive silent failures.

---

## Principle 2 — Warm, Distinctive Design

The visual language MUST be warm, inviting, and characterful — never generic or corporate.

Non-negotiable design constraints:
- Typography: A characterful display font (Fraunces or Playfair Display) paired with a
  clean body font (DM Sans or Source Sans 3). No default system font stacks for headings.
- Color palette: Earthy/warm tones — terracotta, sage green, warm cream — with one bold
  accent. No cold blues, sterile grays, or generic SaaS palettes.
- Layout: Generous whitespace, card-based layouts, subtle page-transition animations.
- Tone: "Thoughtful friend helping you find home" — warm, personal, grounded.

**Rationale:** Relocation is emotional. The product aesthetic MUST match the emotional
weight of the decision users are making.

---

## Principle 3 — Security-First Secret Management

Server-side API keys and secrets MUST NEVER be exposed to the client bundle. All secrets
MUST be stored in environment variables. Firebase client config (public keys) is the only
exception, as it is intentionally public per Firebase's security model. Firestore security
rules MUST enforce auth-gated access at the database level — the API layer alone is
insufficient.

**Rationale:** Claude API keys, Gmail App Passwords, and Firebase Admin credentials are
high-value targets. A single leaked key can result in significant financial or data damage.

---

## Principle 4 — Async-First Architecture

The system MUST be designed around asynchronous agent processing. No user-facing request
MUST block on agent completion. The pattern is: trigger → acknowledge → poll/listen.
Firestore `onSnapshot` listeners MUST be used for real-time dashboard updates; no polling
loops or WebSocket servers are to be introduced.

**Rationale:** Claude API calls can take 10–60+ seconds. Blocking HTTP requests would
time out on Vercel's serverless functions and create a poor user experience.

---

## Principle 5 — Accessible, Mobile-First UI

All UI MUST meet WCAG 2.1 AA accessibility standards at minimum. Responsive design MUST
follow a mobile-first approach — base styles target mobile, breakpoints add complexity.
Interactive elements MUST have visible focus states. Color contrast ratios MUST meet AA
thresholds (4.5:1 for body text, 3:1 for large text).

**Rationale:** Relocation affects people in transition — often on mobile, often stressed.
Accessibility is not optional.

---

## Principle 6 — Strict File Ownership

Each agent team owns specific directories and MUST NOT modify files outside their assigned
scope. Shared interfaces and types MUST be defined in `src/types/` and MUST NOT be changed
unilaterally by any single team. Cross-team changes require explicit coordination documented
in the relevant spec.

**Team ownership:**

| Team | Owned Directories |
|------|-------------------|
| Foundation | `src/lib/`, `src/types/`, `firebase.config.ts`, `.env*` setup |
| Auth & Onboarding | `src/app/(auth)/`, `src/app/onboarding/`, `src/components/onboarding/` |
| Agent Pipeline | `src/app/api/agents/`, `src/lib/agents/`, `src/lib/email/` |
| Results Dashboard | `src/app/dashboard/`, `src/components/dashboard/`, `src/components/ui/` |

**Rationale:** Prevents merge conflicts, preserves architectural intent, and makes it
safe to run multiple agents in parallel without collision.

---

## Principle 7 — Branch-Based Development Workflow

All features MUST be developed on named feature branches. Direct commits to `main` are
prohibited except for hotfixes with explicit justification. Every branch MUST produce a
Vercel preview deployment before merge. PRs MUST pass all checks before merging.

Branch naming: `feature/<short-name>`, `fix/<short-name>`, `chore/<short-name>`

**Rationale:** Vercel preview deployments enable visual QA before production. Feature
isolation prevents unstable code from blocking other work.

---

## Tech Stack (Canonical Reference)

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14+ (App Router), React 18 |
| Styling | Tailwind CSS |
| Auth | Firebase Auth (client SDK) |
| Database | Firebase Firestore (client SDK + Admin SDK) |
| File Storage | Firebase Storage |
| AI Processing | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| Email | Nodemailer + Gmail (Google App Password) |
| Deployment | Vercel (preview per branch, production from `main`) |

---

## Governance

### Amendment Procedure

1. Propose the amendment with rationale in a PR or spec document.
2. Update `LAST_AMENDED` date and bump version per the versioning policy below.
3. Run consistency propagation: update all affected templates and spec documents.
4. Commit with message: `docs: amend constitution to vX.Y.Z (<summary>)`

### Versioning Policy

- **MAJOR** (X.0.0): Backward-incompatible changes — removal or redefinition of a
  principle, change to file ownership that invalidates prior work.
- **MINOR** (X.Y.0): New principle added, new tech stack entry, material expansion of
  existing guidance.
- **PATCH** (X.Y.Z): Clarifications, wording refinements, typo fixes, non-semantic changes.

### Compliance Review

Each feature spec MUST include a "Constitution Check" section confirming compliance with
all seven principles before implementation begins. The lead agent (in delegate mode) MUST
refuse to proceed if any principle is unaddressed.
