# Research: Roost MVP

**Date:** 2026-03-14

---

## Decision 1: Async Agent Execution Pattern

**Decision:** Fire-and-forget within the same serverless invocation. The trigger API route sends the HTTP response immediately using Next.js streaming/`waitUntil`, then continues agent processing in the background within the same function invocation.

**Rationale:** Simplest approach for MVP — no external queue infrastructure (SQS, Redis, etc.) needed. Vercel's `waitUntil` API (available in Next.js Edge/Node runtime) allows the function to continue executing after the response is sent. Agent processing across 3-5 cities with Claude API calls will take 2-10 minutes total, well within Vercel's maximum function duration.

**Alternatives considered:**
- External job queue (BullMQ/Redis, AWS SQS): Over-engineered for MVP volume. Adds infrastructure cost and complexity.
- Vercel Cron Jobs: Polling-based, adds latency. Would need a separate "pending jobs" collection.
- Separate long-running endpoint with Pro plan `maxDuration`: Requires paid Vercel plan. Fire-and-forget achieves the same result on Hobby plan.

**Implementation note:** Use Next.js `after()` (Next.js 15+) or `waitUntil()` from `@vercel/functions` to continue processing after response. If on Vercel Hobby plan with 60s max, consider upgrading to Pro (300s) if agent runs consistently exceed 60s. For local dev, the function simply runs to completion.

---

## Decision 2: Type Schema Reconciliation

**Decision:** Replace the existing scaffold types in `src/types/index.ts` with the spec-defined interface contracts. The current types diverge from the spec in several ways (different field names, missing fields, different structure).

**Rationale:** The spec's interface contracts were carefully designed during specification and represent the canonical schema. The existing scaffold types were auto-generated placeholders. All four teams depend on these types being exact.

**Key differences to reconcile:**
- `UserProfile`: Spec uses `agentStatus` (not `status`), has `resumeUrl` (required, not optional), `parsedResume` (required, not optional), `profileAssembledAt` (Timestamp), and `questionnaire` field (not `questionnaireAnswers`)
- `ParsedResume`: Spec uses `jobTitles[]` (not `currentTitle`), adds `estimatedSalaryRange`, `summary`, drops `fullName`, `workHistory`, `targetRoles`
- `QuestionnaireAnswers`: Spec has structured 4-section shape with specific enum types vs. current flat structure
- `LocationResult`: Spec uses `overallFitScore` (not `overallScore`), `highlightTags`, `userAction`, structured sub-objects
- `JobMatch`: Spec uses `salaryRange: {min, max}` (not separate fields), `fitScore`/`fitExplanation`, `workStyle` enum
- `LivingDetails`: Spec adds `medianRent1br`/`medianRent2br`, `housingListings[]`, `sampleBudget`
- `LifestyleDetails`: Spec uses `walkScore`/`transitScore` (required), `nearbyHobbies[]`, `foodScene`, `demographics`
- `ContextDetails`: Spec uses `recentNews[]`, `politicalClimate`, `weatherOverview`, `crimeIndex`

**Alternatives considered:**
- Gradual migration: Would leave inconsistencies during build. Since this is greenfield with placeholder code, clean replacement is safer.

---

## Decision 3: Resume Parsing Approach

**Decision:** Server-side API route (`POST /api/resume/parse`) that receives the Firebase Storage URL, downloads the file, extracts text, and sends it to Claude API for structured extraction into `ParsedResume` shape.

**Rationale:** Resume parsing requires the Claude API key (server-side only). PDF/DOCX text extraction must happen server-side. The client uploads to Firebase Storage first, then calls the parse API with the storage path.

**Alternatives considered:**
- Client-side parsing with a separate text extraction library: Would require exposing Claude API key or adding another API hop. Text extraction libraries (pdf-parse, mammoth) work better server-side.
- Third-party resume parsing API (Sovren, Affinda): Adds cost and external dependency. Claude is already in the stack and handles this well.

**Implementation note:** Use `pdf-parse` for PDF text extraction and `mammoth` for DOCX-to-text conversion. Both are lightweight npm packages. The parse API route calls Claude with a structured prompt requesting JSON output matching `ParsedResume`.

---

## Decision 4: Questionnaire State Management

**Decision:** Client-side React state with section-by-section progression. Answers are held in component state during the questionnaire flow and written to Firestore as a single document upon completion.

**Rationale:** The questionnaire is a linear multi-step form. Persisting partial answers to Firestore on every keystroke would add unnecessary writes and complexity. A single write on completion is simpler and cheaper.

**Alternatives considered:**
- Persist each section to Firestore as user completes it: More resilient to browser crashes but adds 4x Firestore writes. For MVP with a 15-minute flow, the risk of data loss is acceptable.
- URL-based state (query params): Doesn't scale well for 20-25 questions with complex types.

---

## Decision 5: Fire-and-Forget Implementation

**Decision:** Use Next.js `after()` callback (available in Next.js 15+, which the project uses via Next.js 16) to run agent processing after the response is sent.

**Rationale:** `after()` is the idiomatic Next.js way to run background work in Route Handlers. It's supported natively without importing Vercel-specific packages. The agent orchestration function runs inside `after()`, making the trigger endpoint respond in <1 second while agents process in the background.

**Alternatives considered:**
- `waitUntil()` from `@vercel/functions`: Vercel-specific, less portable. `after()` is framework-native.
- Spawning a separate fetch to self: Hacky, unreliable on serverless.

---

## Decision 6: Email via Nodemailer + Gmail

**Decision:** Use Nodemailer with Gmail SMTP and a Google App Password. Simple HTML email template rendered as a string (no template engine needed for MVP).

**Rationale:** Spec requires Nodemailer/Gmail. For MVP volume (likely <100 emails/day during validation), Gmail's sending limits (500/day for consumer, 2000/day for Workspace) are more than sufficient.

**Alternatives considered:**
- Resend/SendGrid: Better deliverability and analytics but adds another service account and cost. Overkill for MVP validation.
- React Email for templates: Nice DX but adds a dependency for a single email template. Raw HTML string is sufficient.
