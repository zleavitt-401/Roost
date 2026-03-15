# Implementation Plan: Roost MVP — AI-Powered Life Relocation Assistant

**Spec:** `specs/1-mvp-relocation/spec.md`
**Branch:** `main`
**Date:** 2026-03-14

---

## Constitution Check (Pre-Flight)

- [x] P1 — User-First Resilience: Loading/empty/error states defined for dashboard and all async ops. Agent partial failure handled gracefully. Form validation on all inputs.
- [x] P2 — Warm, Distinctive Design: Earthy palette (terracotta, sage, cream), Fraunces + DM Sans typography, card-based layouts, generous whitespace.
- [x] P3 — Security-First Secret Management: `ANTHROPIC_API_KEY`, `GMAIL_APP_PASSWORD` server-side only. Firebase client config public (by design). Firestore rules enforce auth-gated access. API routes verify Firebase ID tokens.
- [x] P4 — Async-First Architecture: Fire-and-forget trigger via `after()`. Firestore `onSnapshot` for real-time dashboard. No blocking agent calls.
- [x] P5 — Accessible, Mobile-First UI: WCAG 2.1 AA. Mobile-first responsive. Keyboard navigable. ARIA labels on interactive elements.
- [x] P6 — Strict File Ownership: Four teams with non-overlapping directories (see File Ownership Map).
- [x] P7 — Branch-Based Development: Main branch for greenfield MVP per user directive.

---

## Architecture Decisions

### 1. Fire-and-Forget Agent Execution

**Decision:** Use Next.js `after()` in the trigger route handler to run agents after HTTP response is sent.
**Alternatives considered:** External queue (BullMQ), Vercel Cron, separate long-running endpoint.
**Rationale:** Simplest MVP approach. No external infrastructure. Native Next.js 15+ API.

### 2. Type Schema Replacement

**Decision:** Replace existing scaffold types with spec-defined interface contracts. Current types diverge significantly.
**Alternatives considered:** Gradual migration. Rejected because all code is placeholder — clean replacement is safer.
**Rationale:** Spec contracts are canonical. All four teams depend on exact shapes.

### 3. Resume Parsing via Server-Side API Route

**Decision:** `POST /api/resume/parse` downloads from Storage, extracts text (pdf-parse/mammoth), sends to Claude for structured extraction.
**Alternatives considered:** Client-side parsing, third-party resume API.
**Rationale:** Keeps API key server-side. Claude is already in stack. pdf-parse and mammoth are lightweight.

### 4. Questionnaire State in React

**Decision:** Client-side React state during questionnaire. Single Firestore write on completion.
**Alternatives considered:** Per-section Firestore persistence.
**Rationale:** Simpler, cheaper. 15-minute flow has acceptable data loss risk.

### 5. Duplicate Trigger Prevention

**Decision:** Block re-trigger when `agentStatus` is `'processing'` or `'complete'`. Return existing resultId.
**Alternatives considered:** Allow re-trigger anytime.
**Rationale:** Prevents wasted API costs. May be relaxed in future phase.

---

## Implementation Phases

### Wave 1 — Foundation (Foundation Team)

**Files:** `src/types/index.ts`, `src/lib/firebase.ts`, `src/lib/utils.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `tailwind.config.ts`, `next.config.ts`, `.env.example`, `package.json`

- [ ] Replace `src/types/index.ts` with spec-defined interfaces (UserProfile, ParsedResume, QuestionnaireAnswers, AgentResults, LocationResult, JobMatch, LivingDetails, HousingListing, MonthlyBudget, LifestyleDetails, ContextDetails, AgentTriggerRequest, AgentTriggerResponse)
- [ ] Add `firebase-admin` to dependencies for server-side Firestore/Auth/Storage operations
- [ ] Add `pdf-parse` and `mammoth` to dependencies for resume text extraction
- [ ] Update `src/lib/firebase.ts` — keep client config, add `src/lib/firebase-admin.ts` for server-side Admin SDK initialization
- [ ] Configure Tailwind theme with custom design tokens: terracotta (`#C2785C`), sage (`#7D8B69`), warm cream (`#F5F0E8`), bold accent (`#D4572A`), proper font configuration for Fraunces + DM Sans
- [ ] Update `src/app/globals.css` with base styles, custom CSS variables, font imports
- [ ] Update `src/app/layout.tsx` with Google Fonts (Fraunces display, DM Sans body), global navigation shell, metadata
- [ ] Build landing homepage at `src/app/page.tsx` — hero section, value proposition (3 pillars: career, lifestyle, community), "Get Started" CTA linking to `/register`
- [ ] Create `src/lib/utils.ts` with utility functions: `formatScore()`, `formatCurrency()`, `formatDate()`, `getStatusColor()`
- [ ] Update `.env.example` with all required variables documented
- [ ] Update `next.config.ts` with any needed configuration (images domains, etc.)

**Produces:** All shared TypeScript types, Firebase client + admin config, Tailwind theme, homepage, utilities.
**Acceptance:** `npm run dev` starts without errors. Types compile and are importable. Homepage renders with custom theme and is mobile-responsive.

---

### Wave 2A — Auth & Onboarding (Auth & Onboarding Team)

**Files:** `src/app/(auth)/register/page.tsx`, `src/app/(auth)/login/page.tsx`, `src/app/onboarding/page.tsx`, `src/app/onboarding/resume/page.tsx`, `src/app/onboarding/questionnaire/page.tsx`, `src/components/onboarding/`, `src/lib/questionnaire/`, `src/app/api/resume/parse/route.ts`

**Depends on:** Wave 1 (types, Firebase config, theme)

- [ ] Build registration page — email/password form, Firebase `createUserWithEmailAndPassword`, redirect to `/onboarding` on success
- [ ] Build login page — email/password form, Firebase `signInWithEmailAndPassword`, redirect to `/dashboard` on success
- [ ] Add auth state provider/context — wrap app to track current user, protect routes
- [ ] Build onboarding landing page — step indicator showing: Resume → Review → Questionnaire → Done
- [ ] Build resume upload page — file input (PDF/DOCX), client-side validation (type + 10MB limit), upload to Firebase Storage at `resumes/{userId}/resume.{ext}`, optional cover letter upload
- [ ] Create `POST /api/resume/parse` route — download file from Storage (admin SDK), extract text (pdf-parse for PDF, mammoth for DOCX), call Claude API with structured extraction prompt, return ParsedResume JSON
- [ ] Build resume review/edit page — display parsed fields in editable form, user confirms or corrects data
- [ ] Build questionnaire — Career section (5 questions: industry openness, min salary, work style, company size, excluded industries)
- [ ] Build questionnaire — Lifestyle section (6 questions: climate, humidity, hobbies, walkability, food, nightlife)
- [ ] Build questionnaire — Practical section (6 questions: max rent, partner status, partner needs [conditional], proximity, timeline, pets)
- [ ] Build questionnaire — Values section (4 questions: political leaning, gun laws, diversity, setting)
- [ ] Implement branching logic — show `partnerJobNeeds` only when `hasPartner = true`
- [ ] Add progress indicator — section name + step count (e.g., "Career — Step 1 of 4")
- [ ] Add back navigation — user can return to previous sections to edit
- [ ] Add form validation — required fields, numeric ranges (salary, rent), descriptive error messages
- [ ] Assemble UserProfile on completion — merge parsedResume + questionnaire answers, write to Firestore `users/{userId}`
- [ ] Call `POST /api/agents/trigger` after profile write — pass userId, handle 409 (already triggered)
- [ ] Show confirmation screen — "Your agents are researching. Results within 24 hours." with link to dashboard

**Note on resume parse API:** This route lives in `src/app/api/resume/parse/` which is technically in Agent Pipeline's `src/app/api/` directory. The Auth & Onboarding team creates this route since it's consumed exclusively by the onboarding flow. Coordinate with Agent Pipeline team to avoid conflicts in `src/app/api/`.

---

### Wave 2B — Agent Pipeline (Agent Pipeline Team)

**Files:** `src/app/api/agents/trigger/route.ts`, `src/lib/agents/orchestrator.ts`, `src/lib/agents/location-profiler.ts`, `src/lib/agents/job-scout.ts`, `src/lib/agents/housing-analyst.ts`, `src/lib/agents/claude-client.ts`, `src/lib/email/send-notification.ts`, `src/lib/email/templates.ts`

**Depends on:** Wave 1 (types, Firebase config)

- [ ] Create `src/lib/agents/claude-client.ts` — shared Anthropic client initialization, helper for calling Claude with web search tool enabled, response parsing utilities
- [ ] Implement Location Profiler agent (`src/lib/agents/location-profiler.ts`) — takes UserProfile, constructs prompt incorporating lifestyle/values/practical preferences, calls Claude with web search, parses response into array of `{city, state}` with preliminary data (COL, climate, walkability, demographics, food scene, recent news)
- [ ] Implement Job Scout agent (`src/lib/agents/job-scout.ts`) — takes ParsedResume + career preferences + city/state, calls Claude with web search to find 3-5 matching jobs, parses into JobMatch[] shape
- [ ] Implement Housing & Budget Analyst agent (`src/lib/agents/housing-analyst.ts`) — takes city/state + maxRent + salary estimates, calls Claude with web search to find rental listings and cost data, builds MonthlyBudget, parses into LivingDetails shape
- [ ] Create agent orchestrator (`src/lib/agents/orchestrator.ts`) — runs Location Profiler first, then for each identified city runs Job Scout + Housing Analyst in parallel (Promise.all), assembles complete LocationResult[] array, handles partial failures (try/catch per agent, continue on error)
- [ ] Update trigger route (`src/app/api/agents/trigger/route.ts`) — verify Firebase ID token, check agentStatus for duplicate prevention (409 if processing/complete), create AgentResults doc with status 'processing', update user agentStatus, return 200 with resultId, use `after()` to run orchestrator
- [ ] Implement result writing — on orchestrator completion, write assembled LocationResult[] to AgentResults doc, set status to 'complete', update user agentStatus to 'complete'
- [ ] Implement error handling — if orchestrator throws, set AgentResults status to 'error', set user agentStatus to 'error', log error server-side (no PII in logs)
- [ ] Create email notification (`src/lib/email/send-notification.ts`) — configure Nodemailer transport with Gmail SMTP, send on agent completion
- [ ] Create email template (`src/lib/email/templates.ts`) — HTML string with greeting, location count, CTA button to `/dashboard`, placeholder unsubscribe

---

### Wave 2C — Results Dashboard (Results Dashboard Team)

**Files:** `src/app/dashboard/page.tsx`, `src/app/dashboard/[locationId]/page.tsx`, `src/components/dashboard/`, `src/components/ui/`

**Depends on:** Wave 1 (types, Firebase config, theme)

- [ ] Create shared UI primitives in `src/components/ui/` — ScoreDisplay (circular/bar), Badge, Card, Tabs, Button, LoadingSpinner, EmptyState, ErrorState
- [ ] Build dashboard page (`src/app/dashboard/page.tsx`) — protected route (redirect to login if unauthenticated)
- [ ] Implement Firestore `onSnapshot` listener for `users/{userId}/results/*` — real-time updates as agents complete
- [ ] Implement Firestore listener for `users/{userId}` — track agentStatus for loading state
- [ ] Build location card component — displays city/state, fit score (0-100 with visual), highlight tags, top job match title + salary, estimated monthly total, climate one-liner
- [ ] Render ranked location cards — sorted by overallFitScore descending, saved locations marked with visual indicator
- [ ] Implement dismissed location filtering — hidden by default, "Show dismissed" toggle reveals them
- [ ] Build loading state — shown when agentStatus is 'processing', animated placeholder cards
- [ ] Build empty state — shown when no results exist yet, friendly message with "check back soon"
- [ ] Build error state — shown when agentStatus is 'error', user-friendly message
- [ ] Build location deep-dive page (`src/app/dashboard/[locationId]/page.tsx`) — receives locationId from URL, finds matching LocationResult
- [ ] Build Jobs tab — list of JobMatch cards with title, company, salary range, work style badge, fit score bar, fit explanation, "Apply" link
- [ ] Build Living tab — COL index display, median rent comparison, housing listing cards, sample monthly budget breakdown (bar chart or table)
- [ ] Build Lifestyle tab — walk/transit score displays, nearby hobbies list, food scene summary text, demographics summary text
- [ ] Build Context tab — recent news links (headline + source + date), political climate summary, weather overview, crime index display
- [ ] Implement Save/Dismiss actions — update `userAction` field in Firestore via client SDK, optimistic UI update
- [ ] Implement undo dismiss — when "Show dismissed" is active, dismissed cards show "Undo" button that sets userAction back to 'none'
- [ ] Ensure all components are mobile-responsive — card layouts stack on mobile, tabs become scrollable on narrow screens
- [ ] Add ARIA labels — tabs, buttons, score displays, interactive elements

---

### Wave 3 — Integration (Lead Agent / All Teams)

**Depends on:** Waves 2A, 2B, 2C all complete

- [ ] Wire navigation: homepage "Get Started" → `/register` → `/onboarding` → `/onboarding/resume` → `/onboarding/questionnaire` → confirmation → `/dashboard`
- [ ] Add navigation header — logo links to homepage, conditional auth links (Login/Register when logged out, Dashboard/Logout when logged in)
- [ ] Verify Firestore document flow end-to-end: onboarding writes profile → trigger creates result doc → agents write results → dashboard reads and displays
- [ ] Verify save/dismiss actions persist and survive page reload
- [ ] Verify email notification fires on agent completion with correct CTA link
- [ ] Verify auth guards — unauthenticated users redirected from `/onboarding/*` and `/dashboard/*`
- [ ] Verify duplicate trigger prevention — second trigger returns 409 with existing resultId
- [ ] Run `npm run build` — zero TypeScript errors
- [ ] Remove any `console.log` statements from production code
- [ ] Verify mobile responsiveness across all screens (360px+)
- [ ] Final review against all acceptance criteria in spec

---

## Integration Points

| From               | To                  | Interface                          | Notes                                      |
|--------------------|---------------------|------------------------------------|--------------------------------------------|
| Foundation         | All teams           | `src/types/index.ts`               | Canonical type definitions                 |
| Foundation         | All teams           | `src/lib/firebase.ts`              | Client-side Firebase instances             |
| Foundation         | Agent Pipeline      | `src/lib/firebase-admin.ts`        | Server-side Admin SDK                      |
| Auth & Onboarding  | Agent Pipeline      | `POST /api/agents/trigger`         | Triggers agent run after profile assembly  |
| Auth & Onboarding  | Firestore           | `users/{userId}` write             | Profile document                           |
| Agent Pipeline     | Firestore           | `users/{userId}/results/{id}` write | Agent results                             |
| Agent Pipeline     | User email          | Nodemailer/Gmail                   | Notification on completion                 |
| Results Dashboard  | Firestore           | `users/{userId}/results/*` read    | Real-time via onSnapshot                   |
| Results Dashboard  | Firestore           | `locations[].userAction` update    | Save/dismiss actions                       |

---

## Risk Register

| Risk                                          | Likelihood | Impact | Mitigation                                                                  |
|-----------------------------------------------|-----------|--------|-----------------------------------------------------------------------------|
| Vercel function timeout during agent run       | Medium    | High   | Monitor execution times. Upgrade to Pro plan (300s) if needed.              |
| Claude API rate limits during parallel agent calls | Low   | Medium | Sequential fallback per city if rate limited. Add retry with backoff.       |
| Resume parsing produces inaccurate data        | Medium    | Low    | User confirmation/edit screen catches errors before profile assembly.       |
| Gmail sending limits hit                       | Low       | Medium | MVP volume far below limits. Migrate to Resend/SendGrid if needed.         |
| Firebase free tier Firestore limits             | Low       | Low    | MVP user volume is low. Monitor usage in Firebase console.                  |
| Type schema mismatch between teams             | Medium    | High   | Single source of truth in `src/types/index.ts`. Wave 1 must complete first. |
| `after()` not available in dev environment     | Low       | Low    | Function runs to completion in dev (no early return). Behavior is compatible.|

---

## Deployment Notes

- **Environment variables required:**
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`
  - `FIREBASE_SERVICE_ACCOUNT_KEY` (JSON string, server-side only)
  - `ANTHROPIC_API_KEY` (server-side only)
  - `GMAIL_USER` (server-side only)
  - `GMAIL_APP_PASSWORD` (server-side only)
  - `NEXT_PUBLIC_APP_URL` (e.g., `https://roost.vercel.app`)

- **New npm dependencies to add:**
  - `firebase-admin` — server-side Firebase operations
  - `pdf-parse` — PDF text extraction for resume parsing
  - `mammoth` — DOCX to text conversion for resume parsing

- **Firestore indexes:** None needed for MVP (queries are scoped by document path, not cross-collection)

- **Firestore Security Rules:** Deploy rules from `data-model.md` — auth-gated user documents, server-only result writes with client userAction update exception

- **Vercel config:** Set all env vars in Vercel dashboard. No special function configuration needed for MVP (default timeout sufficient for trigger endpoint; `after()` handles background work).
