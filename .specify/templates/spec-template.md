# Feature Spec: [FEATURE_NAME]

**Branch:** `[BRANCH_NAME]`
**Status:** Draft | In Review | Approved
**Owner Team:** [OWNER_TEAM]
**Created:** [DATE]

---

## Summary

[ONE_PARAGRAPH_FEATURE_DESCRIPTION]

---

## Goals

- [GOAL_1]
- [GOAL_2]

## Non-Goals

- [NON_GOAL_1]

---

## User Stories

- As a [user type], I want to [action] so that [benefit].

---

## Functional Requirements

### [REQUIREMENT_GROUP_1]

- [ ] [REQ_1]
- [ ] [REQ_2]

---

## Technical Design

### Data Model

[FIRESTORE_COLLECTIONS_AND_FIELDS]

### API Routes

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/[route]` | [description] |

### Component Tree

```
[COMPONENT_HIERARCHY]
```

### Shared Interfaces (src/types/)

```typescript
// Any new or modified types that cross team boundaries
```

---

## File Ownership Map

| Team | Files/Directories Modified |
|------|---------------------------|
| Foundation | |
| Auth & Onboarding | |
| Agent Pipeline | |
| Results Dashboard | |

---

## Constitution Check

- [ ] **P1 — User-First Resilience**: Error handling and loading states defined for all async operations.
- [ ] **P2 — Warm Design**: UI follows earthy palette, display typography, card layouts.
- [ ] **P3 — Secret Management**: No server keys exposed client-side. Firestore rules updated if needed.
- [ ] **P4 — Async-First**: No blocking agent calls. Firestore listeners used for real-time updates.
- [ ] **P5 — Accessible Mobile-First**: WCAG 2.1 AA compliance confirmed. Mobile breakpoints defined.
- [ ] **P6 — File Ownership**: Each team's scope is listed above. No cross-boundary writes.
- [ ] **P7 — Branch Workflow**: Feature branch named. PR required before merge.

---

## Open Questions

- [ ] [QUESTION_1]

---

## Acceptance Criteria

- [ ] [CRITERION_1]
- [ ] [CRITERION_2]
