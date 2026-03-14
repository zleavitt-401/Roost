# Implementation Plan: [FEATURE_NAME]

**Spec:** `.specify/memory/[SPEC_FILE]`
**Branch:** `[BRANCH_NAME]`
**Date:** [DATE]

---

## Constitution Check (Pre-Flight)

Before proceeding, confirm all seven principles are addressed in the spec:

- [ ] P1 — User-First Resilience
- [ ] P2 — Warm, Distinctive Design
- [ ] P3 — Security-First Secret Management
- [ ] P4 — Async-First Architecture
- [ ] P5 — Accessible, Mobile-First UI
- [ ] P6 — Strict File Ownership
- [ ] P7 — Branch-Based Development Workflow

---

## Architecture Decisions

### [DECISION_1_TITLE]

**Decision:** [DECISION]
**Alternatives considered:** [ALTERNATIVES]
**Rationale:** [RATIONALE]

---

## Implementation Phases

### Phase 1 — Foundation ([OWNER_TEAM])

**Files:** `src/lib/`, `src/types/`

- [ ] [TASK_1]
- [ ] [TASK_2]

### Phase 2 — [PHASE_2_NAME] ([OWNER_TEAM])

**Files:** [FILE_PATHS]

- [ ] [TASK_1]
- [ ] [TASK_2]

### Phase 3 — [PHASE_3_NAME] ([OWNER_TEAM])

**Files:** [FILE_PATHS]

- [ ] [TASK_1]

---

## Integration Points

| From | To | Interface | Notes |
|------|----|-----------|-------|
| [TEAM_A] | [TEAM_B] | `src/types/[type].ts` | [note] |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| [RISK_1] | Low/Med/High | Low/Med/High | [mitigation] |

---

## Deployment Notes

- Environment variables required: `[ENV_VAR_1]`, `[ENV_VAR_2]`
- Firestore indexes to add: [INDEX_DESCRIPTION]
- Vercel config changes: [CHANGES]
