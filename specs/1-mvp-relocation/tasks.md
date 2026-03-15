# Tasks: Roost MVP — AI-Powered Life Relocation Assistant

**Plan:** `specs/1-mvp-relocation/plan.md`
**Branch:** `main`
**Date:** 2026-03-14

---

## Task Categories

Tasks are organized by owning team per Principle 6 (Strict File Ownership).
Each task MUST stay within the team's assigned directories.

**User Stories (from spec):**
- **US1**: As a prospective relocator, I want to upload my resume and answer lifestyle questions so that AI agents can research locations tailored to me.
- **US2**: As a job seeker, I want to see matched jobs with salary ranges and fit explanations per city.
- **US3**: As a budget-conscious mover, I want to see housing listings and a sample monthly budget per city.
- **US4**: As a lifestyle-focused individual, I want to see walkability, hobby spots, food scene, and climate overviews.
- **US5**: As a values-driven relocator, I want the system to consider my political, diversity, and setting preferences.
- **US6**: As a returning user, I want to log in and see my previously generated results with saved/dismissed locations.
- **US7**: As a user waiting for results, I want to receive an email notification when my results are ready.

**Dependency waves:**
- Wave 1 (Foundation) — all teams depend on this
- Wave 2A/2B/2C run in parallel after Wave 1
- Wave 3 (Integration) — after all Wave 2 teams complete

---

## Phase 1: Foundation Tasks (Wave 1)

> Scope: `src/lib/`, `src/types/`, config files, `src/app/layout.tsx`, `src/app/page.tsx`
> Must complete before any Wave 2 work begins.

- [ ] T001 Install new dependencies: `firebase-admin`, `pdf-parse`, `mammoth` in `package.json`

- [ ] T002 Replace all types with spec-defined interfaces in `src/types/index.ts`
  - Includes: UserProfile, ParsedResume, QuestionnaireAnswers, AgentResults, LocationResult, JobMatch, LivingDetails, HousingListing, MonthlyBudget, LifestyleDetails, ContextDetails, AgentTriggerRequest, AgentTriggerResponse
  - Use Firestore `Timestamp` type (import from `firebase/firestore`)
  - Export all interfaces

- [ ] T003 [P] Create Firebase Admin SDK initialization in `src/lib/firebase-admin.ts`
  - Initialize from `FIREBASE_SERVICE_ACCOUNT_KEY` env var (JSON string)
  - Export `adminAuth`, `adminDb`, `adminStorage`
  - Singleton pattern (check `getApps()` before initializing)

- [ ] T004 [P] Create utility functions in `src/lib/utils.ts`
  - `formatScore(score: number): string` — e.g., "85/100"
  - `formatCurrency(amount: number): string` — e.g., "$2,500"
  - `formatDate(date: Date | Timestamp): string` — e.g., "Mar 14, 2026"
  - `getStatusColor(status: string): string` — maps agentStatus to theme color

- [ ] T005 [P] Configure Tailwind theme with custom design tokens in `tailwind.config.ts`
  - Colors: terracotta `#C2785C`, sage `#7D8B69`, cream `#F5F0E8`, accent `#D4572A`, plus neutral scales
  - Font families: `display` (Fraunces), `body` (DM Sans)
  - Extend spacing, border-radius for card-based layouts

- [ ] T006 Update `src/app/globals.css` with base styles
  - Import Tailwind layers
  - CSS custom properties for theme colors
  - Base body styles (cream background, DM Sans body, Fraunces headings)
  - Custom utility classes for the warm/earthy aesthetic

- [ ] T007 Update `src/app/layout.tsx` with fonts, metadata, and navigation shell
  - Import Google Fonts: Fraunces (display weights) + DM Sans (body weights)
  - Set page metadata (title: "Roost — Find Where You'll Thrive", description)
  - Add minimal navigation shell (logo, placeholder nav links)
  - Apply font CSS variables to `<html>`

- [ ] T008 Build landing homepage in `src/app/page.tsx`
  - Hero section: headline ("Find where you'll thrive"), subhead, "Get Started" CTA → `/register`
  - Value proposition: 3 pillars (Career Matching, Lifestyle Fit, Budget Reality)
  - How it works: 3-step flow (Upload Resume → Answer Questions → Get Results)
  - Mobile-responsive, warm/earthy design, accessible

- [ ] T009 [P] Update `.env.example` with all required environment variables
  - Document all `NEXT_PUBLIC_FIREBASE_*` vars, `FIREBASE_SERVICE_ACCOUNT_KEY`, `ANTHROPIC_API_KEY`, `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `NEXT_PUBLIC_APP_URL`

- [ ] T010 Update `next.config.ts` with configuration
  - Experimental `after()` support if needed (check Next.js 16 defaults)

**Phase 1 acceptance:** `npm run dev` starts without errors. All types compile. Homepage renders with custom theme. Mobile-responsive.

---

## Phase 2A: Auth & Onboarding Tasks (Wave 2 — parallel)

> Scope: `src/app/(auth)/`, `src/app/onboarding/`, `src/components/onboarding/`, `src/lib/questionnaire/`, `src/app/api/resume/`
> Depends on: Phase 1 complete
> Covers: US1 (primary), US5 (values questionnaire section)

- [ ] T011 [US1] Create auth context provider in `src/components/onboarding/AuthProvider.tsx`
  - Track Firebase Auth state via `onAuthStateChanged`
  - Expose `user`, `loading`, `signOut` via React context
  - Wrap app in provider from `src/app/layout.tsx` (coordinate with Foundation if needed)

- [ ] T012 [P] [US1] Build registration page in `src/app/(auth)/register/page.tsx`
  - Email + password form with confirm password field
  - Firebase `createUserWithEmailAndPassword`
  - Client-side validation: email format, password min 8 chars, passwords match
  - Error display for auth errors (email taken, weak password)
  - Link to login page
  - Redirect to `/onboarding` on success
  - Warm/earthy styling consistent with theme

- [ ] T013 [P] [US1] Build login page in `src/app/(auth)/login/page.tsx`
  - Email + password form
  - Firebase `signInWithEmailAndPassword`
  - Error display for auth errors (wrong password, user not found)
  - Link to registration page
  - Redirect to `/dashboard` on success
  - Warm/earthy styling consistent with theme

- [ ] T014 [US1] Add route protection middleware/logic for `/onboarding/*` and `/dashboard/*`
  - Redirect unauthenticated users to `/login`
  - Can use client-side check in layout or Next.js middleware

- [ ] T015 [US1] Build onboarding landing page in `src/app/onboarding/page.tsx`
  - Step indicator: Resume Upload → Resume Review → Questionnaire → Confirmation
  - Route to first incomplete step
  - Warm design with progress visualization

- [ ] T016 [US1] Build resume upload page in `src/app/onboarding/resume/page.tsx`
  - File input for resume (PDF/DOCX, required) with drag-and-drop zone
  - File input for cover letter (PDF/DOCX, optional)
  - Client-side validation: file type (application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document), 10MB max
  - Upload to Firebase Storage at `resumes/{userId}/resume.{ext}`
  - Loading state during upload
  - On upload complete: call `POST /api/resume/parse` with storage URL
  - Navigate to review page with parsed data

- [ ] T017 [US1] Create resume parse API route in `src/app/api/resume/parse/route.ts`
  - Verify Firebase ID token from Authorization header
  - Download file from Firebase Storage via Admin SDK
  - Extract text: `pdf-parse` for PDF, `mammoth` for DOCX
  - Call Claude API (claude-sonnet-4-20250514) with structured extraction prompt
  - Prompt requests JSON matching ParsedResume shape: jobTitles, skills, yearsExperience, education, estimatedSalaryRange, industries, summary
  - Parse Claude response, validate against type shape
  - Return 200 with `{ success: true, parsedResume }` or 400/500 with error

- [ ] T018 [US1] Build resume review/edit page in `src/components/onboarding/ResumeReview.tsx`
  - Display all ParsedResume fields in editable form inputs
  - Job titles: editable tag list
  - Skills: editable tag list
  - Years experience: number input
  - Education: editable list of entries
  - Salary range: min/max number inputs
  - Industries: editable tag list
  - Summary: textarea
  - "Confirm & Continue" button saves to component state and navigates to questionnaire

- [ ] T019 [US1] Create questionnaire data definitions in `src/lib/questionnaire/questions.ts`
  - Define question arrays for each section with: id, label, type (select/multi-select/number/text/boolean), options (for select types), validation rules
  - Career: 5 questions (industryOpenness, minSalary, workStyle, companySizePref, excludedIndustries)
  - Lifestyle: 6 questions (climatePref, humidityTolerance, hobbies, walkabilityImportance, foodPriorities, nightlifeImportance)
  - Practical: 6 questions (maxRent, hasPartner, partnerJobNeeds, proximityTo, moveTimeline, petFriendly)
  - Values: 4 questions (politicalLeaning, gunLawPref, diversityImportance, settingPref)

- [ ] T020 [US1] Build questionnaire shell in `src/app/onboarding/questionnaire/page.tsx`
  - Section-based navigation (Career → Lifestyle → Practical → Values)
  - Progress indicator showing current section (1 of 4)
  - Back/Next buttons per section
  - Hold all answers in React state (QuestionnaireAnswers shape)
  - On final section complete: trigger profile assembly

- [ ] T021 [US1] Build Career questionnaire section in `src/components/onboarding/CareerSection.tsx`
  - Industry openness: radio/select with 4 options
  - Minimum salary: number input with currency formatting
  - Work style: radio with 4 options
  - Company size: radio with 5 options
  - Excluded industries: multi-select or tag input
  - Form validation on all fields

- [ ] T022 [US1] Build Lifestyle questionnaire section in `src/components/onboarding/LifestyleSection.tsx`
  - Climate preference: radio with 4 options
  - Humidity tolerance: radio with 3 options
  - Hobbies: multi-select or tag input (free text)
  - Walkability importance: radio with 3 options
  - Food priorities: multi-select or tag input
  - Nightlife importance: radio with 3 options

- [ ] T023 [US1] [US5] Build Practical questionnaire section in `src/components/onboarding/PracticalSection.tsx`
  - Max rent: number input with currency formatting
  - Has partner: boolean toggle
  - Partner job needs: text input — ONLY visible when hasPartner = true (branching logic)
  - Proximity to: tag input (free text, e.g., "family in Boston")
  - Move timeline: select with 5 options
  - Pet friendly: boolean toggle

- [ ] T024 [US1] [US5] Build Values questionnaire section in `src/components/onboarding/ValuesSection.tsx`
  - Political leaning: radio with 4 options
  - Gun law preference: radio with 4 options
  - Diversity importance: radio with 3 options
  - Setting preference: radio with 4 options

- [ ] T025 [US1] Implement profile assembly and agent trigger in `src/lib/questionnaire/assembleProfile.ts`
  - Merge parsedResume + questionnaire answers into UserProfile shape
  - Set `profileAssembledAt` to current Timestamp
  - Set `agentStatus` to `'pending'`
  - Write to Firestore at `users/{userId}` (doc set/merge)
  - Call `POST /api/agents/trigger` with userId and auth token
  - Handle 409 response (already triggered)
  - Return resultId on success

- [ ] T026 [US1] Build confirmation screen in `src/components/onboarding/ConfirmationScreen.tsx`
  - Message: "Your agents are researching. Results within 24 hours."
  - Animated illustration or icon (research/searching theme)
  - Link to dashboard: "Go to Dashboard"
  - Warm, reassuring design

**Phase 2A acceptance:** User can register, upload resume, see parsed data, edit it, complete all 4 questionnaire sections with branching, trigger agents, see confirmation. Full flow under 15 minutes. Mobile-responsive.

---

## Phase 2B: Agent Pipeline Tasks (Wave 2 — parallel)

> Scope: `src/app/api/agents/`, `src/lib/agents/`, `src/lib/email/`
> Depends on: Phase 1 complete
> Covers: US2 (jobs), US3 (housing/budget), US4 (lifestyle), US5 (values-based location matching), US7 (email notification)

- [ ] T027 [US2] [US4] Create shared Claude client in `src/lib/agents/claude-client.ts`
  - Initialize Anthropic client with `ANTHROPIC_API_KEY`
  - Helper: `callClaudeWithSearch(prompt: string, systemPrompt: string): Promise<string>` — calls Claude with `web_search` tool enabled
  - Helper: `parseJsonResponse<T>(response: string): T` — extracts JSON from Claude's response, validates basic shape
  - Error handling: wrap API calls with try/catch, throw descriptive errors

- [ ] T028 [US4] [US5] Implement Location Profiler agent in `src/lib/agents/location-profiler.ts`
  - Input: UserProfile (full profile with questionnaire answers)
  - Construct prompt incorporating: climate pref, humidity, walkability, food priorities, nightlife, political leaning, gun laws, diversity, setting pref, proximity requirements, max rent, hobbies
  - Call Claude with web search to identify 3-5 best-fit US cities
  - For each city, gather: cost of living index, climate summary, walkability data, demographics, food scene description, recent news headlines
  - Parse response into array of partial LocationResult objects (city, state, overallFitScore, lifestyle, context data)
  - Return `LocationProfileResult[]` with city identifiers and preliminary data

- [ ] T029 [US2] Implement Job Scout agent in `src/lib/agents/job-scout.ts`
  - Input: ParsedResume, career preferences (from QuestionnaireAnswers.career), city, state
  - Construct prompt: match user's job titles, skills, industries, work style pref against job openings in the target city
  - Call Claude with web search to find 3-5 real job postings
  - Parse response into JobMatch[] shape: title, company, salaryRange, fitScore, fitExplanation, applicationUrl, workStyle
  - Handle case where fewer than 3 jobs found (return what's available)

- [ ] T030 [US3] Implement Housing & Budget Analyst agent in `src/lib/agents/housing-analyst.ts`
  - Input: city, state, maxRent (from questionnaire), estimatedSalaryRange (from ParsedResume)
  - Construct prompt: find rental listings, cost of living data, build monthly budget
  - Call Claude with web search to find 3-5 rental listings and cost data
  - Parse response into LivingDetails shape: costOfLivingIndex, medianRent1br, medianRent2br, housingListings[], sampleBudget (MonthlyBudget)
  - Calculate savingsRate from estimatedSalary vs total expenses

- [ ] T031 [US2] [US3] [US4] Create agent orchestrator in `src/lib/agents/orchestrator.ts`
  - Input: UserProfile, resultId
  - Step 1: Run Location Profiler → get 3-5 cities with preliminary data
  - Step 2: For each city, run Job Scout + Housing Analyst in parallel (`Promise.all`)
  - Step 3: Assemble complete LocationResult[] by merging profiler data + job data + housing data
  - Assign `locationId` (generate unique ID per location)
  - Set `userAction: 'none'` for all locations
  - Set `highlightTags` based on notable data points (e.g., "3 climbing gyms", "15% below avg COL")
  - Error handling: try/catch per agent per city. If one agent fails for a city, continue with partial data. Log failure server-side.
  - Return assembled LocationResult[] array

- [ ] T032 [US1] [US7] Update trigger route in `src/app/api/agents/trigger/route.ts`
  - Verify Firebase ID token via Admin Auth (`adminAuth.verifyIdToken`)
  - Extract userId from verified token; confirm matches request body userId (403 if mismatch)
  - Read user document from Firestore; check `agentStatus`
  - If `'processing'` or `'complete'`: return 409 with existing resultId
  - Create new AgentResults document in `users/{userId}/results/` with status `'processing'`, empty locations array
  - Update user document: set `agentStatus` to `'processing'`
  - Return 200 with `{ success: true, resultId, message: "Agent processing started" }`
  - Use `after()` to run orchestrator asynchronously

- [ ] T033 [US7] Implement result writing and status updates in `src/lib/agents/orchestrator.ts`
  - On orchestrator success: write LocationResult[] to AgentResults document, set status `'complete'`
  - Update user document: set `agentStatus` to `'complete'`
  - Call `sendNotificationEmail()` with user email, display name, location count
  - On orchestrator error: set AgentResults status to `'error'`, set user agentStatus to `'error'`
  - Log errors server-side (no PII — omit email, resume content from logs)

- [ ] T034 [P] [US7] Create email notification sender in `src/lib/email/send-notification.ts`
  - Configure Nodemailer transport: Gmail SMTP (`smtp.gmail.com`, port 587, TLS)
  - Auth: `GMAIL_USER` + `GMAIL_APP_PASSWORD` from env vars
  - `sendNotificationEmail(to: string, displayName: string, locationCount: number): Promise<void>`
  - Send HTML email using template from `templates.ts`
  - Error handling: log failure but don't throw (email failure shouldn't fail the pipeline)

- [ ] T035 [P] [US7] Create email template in `src/lib/email/templates.ts`
  - `getResultsReadyEmail(displayName: string, locationCount: number, dashboardUrl: string): string`
  - Subject: "Your Roost results are ready!"
  - HTML body: greeting, "We've found {N} locations that could be a great fit.", CTA button → dashboardUrl, placeholder unsubscribe footer
  - Inline CSS for email client compatibility
  - Warm/earthy styling matching brand (terracotta accent for CTA button)

**Phase 2B acceptance:** Trigger API creates result doc, runs all 3 agents, writes results to Firestore, updates statuses, sends email. Partial failure handled gracefully. No API keys in client code.

---

## Phase 2C: Results Dashboard Tasks (Wave 2 — parallel)

> Scope: `src/app/dashboard/`, `src/components/dashboard/`, `src/components/ui/`
> Depends on: Phase 1 complete
> Covers: US2 (job cards), US3 (living tab), US4 (lifestyle tab), US6 (returning user/save/dismiss)

- [ ] T036 [P] Create ScoreDisplay component in `src/components/ui/ScoreDisplay.tsx`
  - Circular or bar visualization for 0-100 scores
  - Color coding: green (75+), amber (50-74), red (<50)
  - Accessible: score value in aria-label
  - Props: `score: number`, `label?: string`, `size?: 'sm' | 'md' | 'lg'`

- [ ] T037 [P] Create Badge component in `src/components/ui/Badge.tsx`
  - Highlight tag display (e.g., "3 climbing gyms", "15% below avg COL")
  - Variants: default, accent, muted
  - Props: `text: string`, `variant?: string`

- [ ] T038 [P] Create Card component in `src/components/ui/Card.tsx`
  - Warm card style with cream background, subtle shadow, rounded corners
  - Props: `children`, `className?`, `onClick?`

- [ ] T039 [P] Create Tabs component in `src/components/ui/Tabs.tsx`
  - Tab bar with active state styling (terracotta underline)
  - Keyboard navigable (arrow keys between tabs)
  - ARIA: `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`
  - Props: `tabs: {id, label}[]`, `activeTab`, `onTabChange`

- [ ] T040 [P] Create LoadingSpinner, EmptyState, ErrorState components in `src/components/ui/`
  - LoadingSpinner: animated spinner with optional message
  - EmptyState: illustration + message ("Your results are on the way...")
  - ErrorState: error icon + message + optional retry button
  - All themed to warm/earthy palette

- [ ] T041 [US6] Build dashboard page in `src/app/dashboard/page.tsx`
  - Protected route: redirect to `/login` if unauthenticated
  - Set up Firestore `onSnapshot` listener on `users/{userId}` for agentStatus
  - Set up Firestore `onSnapshot` listener on `users/{userId}/results/*` for result data
  - Render based on agentStatus: loading (processing), empty (pending), error (error), results (complete)
  - Clean up listeners on unmount

- [ ] T042 [US6] Build LocationCard component in `src/components/dashboard/LocationCard.tsx`
  - Display: city/state as heading, ScoreDisplay for fit score, highlight tags as Badges
  - Display: top job match (title + salary range), estimated monthly budget total, climate one-liner
  - Save/Dismiss action buttons (heart icon + X icon)
  - Saved indicator (filled heart) if userAction = 'saved'
  - Click handler navigates to `/dashboard/{locationId}`
  - Card-based layout, warm styling, mobile-responsive

- [ ] T043 [US6] Render ranked location cards list in `src/components/dashboard/LocationList.tsx`
  - Sort by overallFitScore descending
  - Filter out dismissed locations by default
  - "Show dismissed ({count})" toggle at bottom
  - When toggled: show dismissed cards with muted styling + "Undo" button
  - Grid layout on desktop (2 columns), stack on mobile

- [ ] T044 [US6] Implement Save/Dismiss actions in `src/components/dashboard/LocationActions.tsx`
  - Save: update `locations[index].userAction` to `'saved'` in Firestore
  - Dismiss: update to `'dismissed'`
  - Undo dismiss: update back to `'none'`
  - Optimistic UI update (update local state immediately, write to Firestore async)
  - Handle Firestore write errors (revert optimistic update, show toast/message)

- [ ] T045 [US2] Build location deep-dive page in `src/app/dashboard/[locationId]/page.tsx`
  - Extract `locationId` from URL params
  - Load user's results from Firestore (or receive via context from dashboard)
  - Find matching LocationResult by locationId
  - Render city/state header with fit score, Save/Dismiss buttons
  - Render Tabs component with 4 tabs: Jobs, Living, Lifestyle, Context
  - Back button to `/dashboard`

- [ ] T046 [US2] Build Jobs tab content in `src/components/dashboard/JobsTab.tsx`
  - List of JobMatch cards
  - Each card: title, company, salary range (formatted), work style badge, fit score bar, fit explanation text
  - "Apply" link (external, opens in new tab) with `rel="noopener noreferrer"`
  - Empty state if no jobs found
  - Mobile: cards stack vertically

- [ ] T047 [US3] Build Living tab content in `src/components/dashboard/LivingTab.tsx`
  - Cost of living index display (relative to 100 national avg)
  - Median rent comparison (1br vs 2br)
  - Housing listing cards: title, price, bedrooms, neighborhood, link to listing
  - Sample monthly budget breakdown: bar chart or structured table showing rent, groceries, utilities, transport, discretionary, total, estimated salary, savings rate
  - Mobile-responsive layout

- [ ] T048 [US4] Build Lifestyle tab content in `src/components/dashboard/LifestyleTab.tsx`
  - Walk score and transit score displays (ScoreDisplay components)
  - Nearby hobbies list: name, type, distance
  - Food scene summary (AI-generated paragraph)
  - Demographics summary (AI-generated paragraph)
  - Mobile-responsive layout

- [ ] T049 [US4] Build Context tab content in `src/components/dashboard/ContextTab.tsx`
  - Recent news: list of headline + source + date with link to article
  - Political climate summary (AI-generated paragraph)
  - Weather overview (AI-generated paragraph)
  - Crime index display
  - Mobile-responsive layout

- [ ] T050 [US6] Build dashboard loading state in `src/components/dashboard/DashboardLoading.tsx`
  - Shown when agentStatus = 'processing'
  - Animated placeholder cards (skeleton loading)
  - Message: "Your agents are still researching. Check back soon!"
  - Friendly, warm design

- [ ] T051 Ensure all dashboard components have ARIA labels and keyboard navigation
  - Tabs: arrow key navigation, Enter/Space to select
  - Cards: focusable, Enter to navigate
  - Buttons: descriptive aria-labels ("Save Austin, TX", "Dismiss Portland, OR")
  - Score displays: aria-label with numeric value
  - Heading hierarchy: h1 for page, h2 for sections, h3 for cards

**Phase 2C acceptance:** Dashboard shows location cards from Firestore. Real-time updates work. All 4 deep-dive tabs render data. Save/dismiss persists. Loading/empty/error states work. Mobile-responsive. Accessible.

---

## Phase 3: Integration & Polish (Wave 3)

> Scope: Cross-team wiring, navigation, final verification
> Depends on: Phases 2A, 2B, 2C all complete

- [ ] T052 Wire navigation: homepage "Get Started" → `/register` → `/onboarding` → `/onboarding/resume` → questionnaire → confirmation → `/dashboard`
  - Files: `src/app/page.tsx`, `src/app/layout.tsx`

- [ ] T053 Build navigation header component
  - Logo links to `/`
  - When logged out: "Login" and "Get Started" links
  - When logged in: "Dashboard" link and "Sign Out" button
  - Mobile: hamburger menu or simplified layout
  - Files: `src/app/layout.tsx` or new `src/components/ui/NavHeader.tsx`

- [ ] T054 Verify end-to-end Firestore document flow
  - Onboarding writes UserProfile to `users/{userId}`
  - Trigger creates AgentResults doc in `users/{userId}/results/{resultId}`
  - Agents write LocationResult[] to results doc
  - Dashboard reads and displays results via onSnapshot
  - Save/dismiss updates persist

- [ ] T055 Verify auth guards across all protected routes
  - `/onboarding/*` redirects to `/login` if unauthenticated
  - `/dashboard/*` redirects to `/login` if unauthenticated
  - `/login` and `/register` redirect to `/dashboard` if already authenticated

- [ ] T056 Verify duplicate trigger prevention
  - Second call to `/api/agents/trigger` returns 409 with existing resultId
  - User sees appropriate message if agents already running/complete

- [ ] T057 Run `npm run build` — verify zero TypeScript errors
  - Fix any type mismatches between teams
  - Ensure all imports resolve

- [ ] T058 Remove all `console.log` statements from production code
  - Search all `src/` files
  - Replace with appropriate error handling or remove

- [ ] T059 Verify mobile responsiveness across all screens at 360px width
  - Homepage, register, login, onboarding steps, questionnaire, confirmation, dashboard, deep-dive
  - Ensure touch targets are at least 44px

- [ ] T060 Final review against all 20 acceptance criteria in spec

---

## Dependencies

```
T001 ─┬─ T002 ─┬─ T011-T026 (Phase 2A — Auth & Onboarding)
      │        ├─ T027-T035 (Phase 2B — Agent Pipeline)
      │        └─ T036-T051 (Phase 2C — Results Dashboard)
      ├─ T003 ─┘
      ├─ T004 ─┘
      ├─ T005 ─── T006 ─── T007 ─── T008
      ├─ T009
      └─ T010

Phase 2A, 2B, 2C ──→ T052-T060 (Phase 3 — Integration)
```

**Within Phase 2A:** T011 → T014 (auth context before route protection). T012, T013 parallel. T016 → T017 → T018 (upload → parse → review). T019 → T020-T024 (questions defined before UI). T025 depends on T018+T020. T026 depends on T025.

**Within Phase 2B:** T027 → T028, T029, T030 (client before agents). T028 → T031 (profiler before orchestrator). T031 → T032, T033. T034, T035 parallel with all.

**Within Phase 2C:** T036-T040 parallel (UI primitives). T041 → T042 → T043 → T044. T045 → T046-T049 parallel. T050 parallel with card work.

## Parallel Execution Opportunities

**Phase 1:** T003, T004, T005, T009 can all run in parallel after T001.

**Phase 2 (cross-team):** All three Phase 2 tracks (A, B, C) run simultaneously after Phase 1.

**Phase 2A internal:** T012 + T013 in parallel. T021-T024 (questionnaire sections) in parallel after T019.

**Phase 2B internal:** T029 + T030 in parallel after T027. T034 + T035 in parallel.

**Phase 2C internal:** T036-T040 all in parallel. T046-T049 (tab contents) all in parallel after T045.

---

## Implementation Strategy

**MVP scope:** All phases are required for MVP. The waves provide natural checkpoints:
1. After Phase 1: verify project builds and homepage renders
2. After Phase 2: verify each team's work independently (auth flow, agent pipeline, dashboard UI)
3. After Phase 3: verify end-to-end flow and ship

**Incremental delivery:** Each Phase 2 track produces independently testable output. Auth & Onboarding can be tested with mock agent responses. Dashboard can be tested with seed data in Firestore. Agent Pipeline can be tested via direct API calls.

---

## Completion Checklist

- [ ] All T001-T010 tasks complete (Foundation)
- [ ] All T011-T026 tasks complete (Auth & Onboarding)
- [ ] All T027-T035 tasks complete (Agent Pipeline)
- [ ] All T036-T051 tasks complete (Results Dashboard)
- [ ] All T052-T060 tasks complete (Integration & Polish)
- [ ] Error states tested for all async operations (P1)
- [ ] Mobile layout verified at 360px (P5)
- [ ] Color contrast checked — 4.5:1 body text, 3:1 large text (P5)
- [ ] No server secrets in client bundle (P3)
- [ ] `npm run build` passes with zero errors
- [ ] No `console.log` in production code
