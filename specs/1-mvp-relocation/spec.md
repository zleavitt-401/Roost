# Feature Spec: Roost MVP — AI-Powered Life Relocation Assistant

**Branch:** `main` (greenfield MVP — no feature branch)
**Status:** Draft
**Owner Team:** All Teams (Foundation, Auth & Onboarding, Agent Pipeline, Results Dashboard)
**Created:** 2026-03-14

---

## Summary

Roost is an AI-powered life-relocation assistant that helps users discover US locations where they'd thrive. Users register, upload a resume, complete a guided lifestyle questionnaire, and receive comprehensive location reports assembled by three AI agents (Job Scout, Location Profiler, Housing & Budget Analyst) within 24 hours. The MVP targets individuals or couples relocating within the US, delivering ranked location cards with deep dives into jobs, housing, lifestyle, and community context — all through a warm, emotionally resonant interface that treats relocation as the life-changing decision it is.

---

## Clarifications

### Session 2026-03-14

- Q: How should async agent processing work beyond the initial trigger (given Vercel 60s timeout)? → A: Fire-and-forget — trigger endpoint responds immediately, continues agent work in same serverless invocation.
- Q: How should dismissed locations behave on the dashboard? → A: Hidden by default, revealable via a "Show dismissed" toggle.
- Q: Should the system prevent duplicate agent runs? → A: Yes — block re-trigger when agentStatus is 'processing' or 'complete' (return existing resultId). May be relaxed in a future phase to allow re-runs.

---

## Goals

- Enable users to complete the full onboarding flow (register, upload resume, complete questionnaire) in under 15 minutes
- Deliver personalized, AI-researched location recommendations for 3-5 US cities within 24 hours of profile completion
- Provide actionable depth per location: real job matches, housing options, cost-of-living breakdowns, and lifestyle fit assessments
- Create a warm, distinctive product experience that feels like a thoughtful friend helping users find home — not a generic search tool
- Notify users via email when results are ready so they don't need to keep checking back

## Non-Goals

- Partner/spouse separate profile with dual-job matching (future phase)
- Meetup or community group discovery agent
- "Research Deeper" button for second-round agent research
- Automated outreach to employers or landlords
- Interview scheduling or application tracking
- Re-running agents with updated preferences
- Payment or subscription system
- Mobile native app (responsive web only)
- International locations (US only for MVP)
- Social features or sharing

---

## User Stories

- As a **prospective relocator**, I want to upload my resume and answer lifestyle questions so that AI agents can research locations tailored to my specific career, lifestyle, and values.
- As a **job seeker considering relocation**, I want to see matched jobs with salary ranges and fit explanations per city so that I can evaluate career opportunities in each location.
- As a **budget-conscious mover**, I want to see housing listings and a sample monthly budget per city so that I can understand if I can afford to live there.
- As a **lifestyle-focused individual**, I want to see walkability scores, hobby spots, food scene summaries, and climate overviews so that I can judge quality of life beyond just employment.
- As a **values-driven relocator**, I want the system to consider my political preferences, diversity importance, and urban/rural preference so that I land somewhere aligned with my values.
- As a **returning user**, I want to log in and see my previously generated results with saved/dismissed locations so that I can revisit my research over time.
- As a **user waiting for results**, I want to receive an email notification when my results are ready so that I don't have to keep checking the dashboard.

---

## Functional Requirements

### Registration & Authentication

- [ ] Users can register with email and password via Firebase Auth
- [ ] Users can log in with existing credentials
- [ ] Authenticated routes redirect unauthenticated users to login
- [ ] Auth state persists across browser sessions

### Resume Upload & Parsing

- [ ] Users can upload a resume (PDF or DOCX, required) and cover letter (PDF or DOCX, optional)
- [ ] Files are stored in Firebase Storage scoped to the authenticated user
- [ ] File uploads enforce a 10MB size limit and validate MIME type server-side
- [ ] AI parsing extracts structured data: job titles, skills, years of experience, education, estimated salary range, industries, and a summary
- [ ] Users see a confirmation/edit screen showing parsed data before proceeding
- [ ] Users can manually correct any parsed fields before finalizing

### Guided Questionnaire

- [ ] Questionnaire consists of 20-25 questions across 4 sections: Career, Lifestyle, Practical, Values
- [ ] **Career section** covers: industry openness, minimum salary, work style preference, company size preference, excluded industries
- [ ] **Lifestyle section** covers: climate preference, humidity tolerance, hobbies, walkability importance, food priorities, nightlife importance
- [ ] **Practical section** covers: maximum rent, partner status, partner job needs (conditional on partner = yes), proximity requirements, move timeline, pet-friendliness
- [ ] **Values section** covers: political leaning, gun law preference, diversity importance, urban/suburban/rural preference
- [ ] Branching logic: partner-related questions appear only when hasPartner = true
- [ ] Progress indicator shows which section the user is on
- [ ] Users can navigate back to previous sections to edit answers
- [ ] All inputs have client-side validation with descriptive error messages

### Profile Assembly & Agent Trigger

- [ ] After questionnaire completion, system assembles a complete UserProfile combining resume data and questionnaire answers
- [ ] UserProfile is written to Firestore at `users/{userId}/profile`
- [ ] System calls POST `/api/agents/trigger` with the userId to initiate agent processing
- [ ] User sees a confirmation screen: "Your agents are researching. Results within 24 hours."
- [ ] User's agentStatus is set to 'processing' upon trigger
- [ ] Agent trigger is blocked if agentStatus is already 'processing' or 'complete' — API returns existing resultId instead of creating a duplicate run

### Agent Pipeline

- [ ] **Location Profiler** runs first: identifies 3-5 best-fit US cities based on lifestyle, values, and practical preferences using Claude API with web search
- [ ] **Job Scout** runs in parallel per city (after Location Profiler): finds 3-5 matching jobs per location based on parsed resume and career preferences
- [ ] **Housing & Budget Analyst** runs in parallel per city (after Location Profiler): finds rental listings and builds sample monthly budgets cross-referencing salary estimates
- [ ] Agent orchestration: Location Profiler first, then Job Scout + Housing Analyst in parallel for each identified city
- [ ] Async execution: trigger endpoint sends HTTP response immediately, then continues agent processing in the same serverless invocation (fire-and-forget pattern). No external queue or cron required for MVP.
- [ ] Results are written to Firestore at `users/{userId}/results/{resultId}` matching the AgentResults schema
- [ ] User's agentStatus is updated to 'complete' when all agents finish, or 'error' if processing fails
- [ ] If one agent fails, others continue; partial results are saved
- [ ] All API keys remain server-side only — never exposed in client bundles

### Email Notification

- [ ] When agent processing completes, an email is sent to the user via Nodemailer/Gmail
- [ ] Email subject: "Your Roost results are ready!"
- [ ] Email body includes: greeting with user's name, count of locations found, CTA button linking to /dashboard
- [ ] Email is delivered within 5 minutes of results completion

### Results Dashboard

- [ ] Dashboard displays 3-5 ranked location cards sorted by overall fit score (0-100)
- [ ] Each location card shows: city/state, fit score, highlight tags, top job match, estimated monthly budget, climate snapshot
- [ ] Clicking a location card opens a tabbed deep-dive view with 4 tabs:
  - **Jobs**: matched jobs with fit scores, salary ranges, work style, fit explanations, application links
  - **Living**: cost of living index, median rents, housing listings, sample monthly budget breakdown
  - **Lifestyle**: walk/transit scores, nearby hobby spots, food scene summary, demographics summary
  - **Context**: recent news links, political climate summary, weather overview, crime index
- [ ] Users can Save or Dismiss locations (persisted to Firestore via userAction field)
- [ ] Dismissed locations are hidden by default; a "Show dismissed" toggle reveals them and allows undoing the dismissal
- [ ] Dashboard uses Firestore onSnapshot listeners for real-time updates as results arrive
- [ ] Loading state shown while agents are still processing
- [ ] Empty state shown if no results are available yet
- [ ] Error state shown if agent processing failed

---

## User Scenarios & Testing

### Scenario 1: New User — Complete Onboarding to Results

1. User navigates to homepage and clicks "Get Started"
2. User registers with email and password
3. User uploads a PDF resume (required)
4. System parses resume and displays extracted data for confirmation
5. User reviews and confirms parsed resume data
6. User completes all 4 questionnaire sections (Career, Lifestyle, Practical, Values)
7. System assembles profile and triggers agent pipeline
8. User sees confirmation screen with "Results within 24 hours" message
9. User receives email when results are ready
10. User logs in, navigates to dashboard, sees 3-5 ranked location cards
11. User clicks a location card and explores all 4 deep-dive tabs
12. User saves one location and dismisses another

**Expected outcome:** Full flow completes in under 15 minutes (excluding agent processing time). All data flows correctly from onboarding through agents to dashboard.

### Scenario 2: Returning User — View Saved Results

1. User logs in with existing credentials
2. Dashboard loads with previously generated results
3. Saved locations are clearly marked; dismissed locations are hidden by default
4. User can click into any location for the full deep-dive view

**Expected outcome:** Dashboard loads in under 2 seconds. Previous save/dismiss actions are preserved.

### Scenario 3: Questionnaire Branching — Partner Questions

1. User reaches Practical section of questionnaire
2. User selects hasPartner = true
3. Partner job needs question appears
4. User selects hasPartner = false
5. Partner job needs question hides

**Expected outcome:** Conditional fields appear/disappear smoothly based on partner status.

### Scenario 4: Agent Partial Failure

1. Agent pipeline is triggered
2. Job Scout agent fails for one city but succeeds for others
3. Housing agent succeeds for all cities
4. Results are saved with partial job data
5. User sees results with available data; missing sections show a graceful fallback message

**Expected outcome:** Partial results are still useful. No blank screens or cryptic errors.

### Scenario 5: Resume Parsing — Edit Parsed Data

1. User uploads a resume
2. AI parsing extracts data but misidentifies a job title
3. User edits the incorrect field on the confirmation screen
4. Corrected data is used for profile assembly and agent research

**Expected outcome:** User corrections override AI parsing. Downstream agents use the corrected data.

---

## Key Entities

### UserProfile
Stored at `users/{userId}/profile` in Firestore. Contains:
- User identity (userId, email)
- Resume storage path and parsed resume data (job titles, skills, experience, education, salary range, industries)
- Questionnaire answers across all 4 sections
- Agent processing status (pending → processing → complete/error)
- Profile assembly timestamp

### AgentResults
Stored at `users/{userId}/results/{resultId}` in Firestore. Contains:
- Result metadata (resultId, userId, creation timestamp, status)
- Array of 3-5 LocationResult objects, each containing:
  - Location identity and fit score
  - Job matches (3-5 per city)
  - Living details (cost of living, rents, housing listings, sample budget)
  - Lifestyle details (walk/transit scores, hobby spots, food/demographics summaries)
  - Context details (news, political climate, weather, crime)
  - User action state (none/saved/dismissed)

---

## File Ownership Map

| Team                | Files/Directories Modified                                                                                      |
|---------------------|----------------------------------------------------------------------------------------------------------------|
| Foundation          | `src/lib/`, `src/types/`, `src/app/layout.tsx`, `src/app/page.tsx`, config files, `.env.example`               |
| Auth & Onboarding   | `src/app/(auth)/`, `src/app/onboarding/`, `src/components/onboarding/`, `src/lib/questionnaire/`               |
| Agent Pipeline      | `src/app/api/`, `src/lib/agents/`, `src/lib/email/`                                                            |
| Results Dashboard   | `src/app/dashboard/`, `src/components/dashboard/`, `src/components/ui/`                                        |

---

## Constitution Check

- [x] **P1 — User-First Resilience**: Error handling and loading states defined for all async operations. Loading/empty/error states specified for dashboard. Agent partial failure handled gracefully.
- [x] **P2 — Warm Design**: UI follows earthy palette (terracotta, sage, warm cream), display typography (Fraunces + DM Sans), card-based layouts with generous whitespace.
- [x] **P3 — Secret Management**: ANTHROPIC_API_KEY and GMAIL_APP_PASSWORD are server-side only. Firebase client config is intentionally public. Firestore rules enforce auth-gated access.
- [x] **P4 — Async-First**: Agent trigger returns immediately with acknowledgment. Firestore onSnapshot listeners used for real-time dashboard updates. No blocking agent calls.
- [x] **P5 — Accessible Mobile-First**: All screens mobile-responsive. WCAG 2.1 AA compliance required. Keyboard navigable, proper heading hierarchy, ARIA labels on interactive elements.
- [x] **P6 — File Ownership**: Each team's scope listed in File Ownership Map above. No cross-boundary writes.
- [x] **P7 — Branch Workflow**: Working on main for greenfield MVP per user directive. Feature branches for post-MVP work.

---

## Assumptions

- Users have a PDF or DOCX resume available for upload
- Claude API (claude-sonnet-4-20250514) with web search tool is sufficient for both resume parsing and agent research
- 3-5 locations provides sufficient breadth for MVP (quality over quantity)
- Free tier — no payment integration needed while validating concept
- Questionnaire is form-based with simple branching, not conversational AI
- Agent processing cost per user is acceptable at Claude Sonnet pricing (~$0.50-2.00 per full run)
- Gmail with Google App Password via Nodemailer is sufficient for MVP email volume
- Vercel Hobby plan serverless function timeout (60 seconds) is sufficient for the trigger endpoint; agent processing runs asynchronously beyond that
- Users access the product via modern browsers (Chrome, Safari, Firefox, Edge — last 2 major versions)

---

## Success Criteria

- Users can complete the full onboarding flow (register, upload resume, complete questionnaire) in under 15 minutes
- Resume parser accurately extracts job titles, skills, and years of experience from standard resume formats
- Agent pipeline produces personalized results for 3-5 US locations within 24 hours of profile completion
- Each location card includes job matches, housing options, cost of living data, and a lifestyle fit score
- Email notification is delivered to the user within 5 minutes of results completion
- Dashboard page loads and displays results in under 2 seconds
- All screens are fully functional and readable on mobile devices (360px width and above)
- No API keys or server-side secrets are exposed in client-side code or browser network requests
- Users can save and dismiss locations with actions persisting across sessions
- Dashboard updates in real-time as agent results arrive without requiring page refresh

---

## Acceptance Criteria

- [ ] User can register with email/password and log in successfully
- [ ] Resume upload accepts PDF and DOCX files up to 10MB and stores them in Firebase Storage
- [ ] AI resume parsing extracts structured data matching the ParsedResume schema
- [ ] User can review and edit parsed resume data before proceeding
- [ ] Questionnaire covers all 4 sections with ~20-25 questions and branching logic
- [ ] UserProfile document written to Firestore matches the schema exactly
- [ ] Agent trigger API creates an AgentResults document and begins processing
- [ ] Location Profiler identifies 3-5 US cities; Job Scout and Housing Analyst research each city
- [ ] AgentResults written to Firestore match the schema with all fields populated
- [ ] User's agentStatus transitions correctly: pending → processing → complete/error
- [ ] Email notification sent upon completion with correct content and CTA link
- [ ] Dashboard displays ranked location cards with all required data points
- [ ] Tabbed deep-dive view shows all 4 tabs (Jobs, Living, Lifestyle, Context) with correct data
- [ ] Save/Dismiss actions persist to Firestore and survive page reload
- [ ] Real-time Firestore listeners update dashboard as results arrive
- [ ] Loading, empty, and error states render correctly
- [ ] All screens are mobile-responsive with the warm/earthy design theme
- [ ] All interactive elements are keyboard navigable with ARIA labels
- [ ] Zero TypeScript errors on `npm run build`
- [ ] No `console.log` statements in production code
