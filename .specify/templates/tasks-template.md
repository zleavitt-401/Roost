# Tasks: [FEATURE_NAME]

**Plan:** `.specify/memory/[PLAN_FILE]`
**Branch:** `[BRANCH_NAME]`
**Date:** [DATE]

---

## Task Categories

Tasks are organized by owning team per Principle 6 (Strict File Ownership).
Each task MUST stay within the team's assigned directories.

---

## Foundation Tasks
> Scope: `src/lib/`, `src/types/`, firebase config, environment setup

- [ ] **F-01** [TASK_TITLE]
  - Files: `[FILE_PATH]`
  - Depends on: —
  - Notes: [NOTES]

- [ ] **F-02** [TASK_TITLE]
  - Files: `[FILE_PATH]`
  - Depends on: F-01

---

## Auth & Onboarding Tasks
> Scope: `src/app/(auth)/`, `src/app/onboarding/`, `src/components/onboarding/`

- [ ] **A-01** [TASK_TITLE]
  - Files: `[FILE_PATH]`
  - Depends on: F-01
  - Notes: [NOTES]

---

## Agent Pipeline Tasks
> Scope: `src/app/api/agents/`, `src/lib/agents/`, `src/lib/email/`

- [ ] **P-01** [TASK_TITLE]
  - Files: `[FILE_PATH]`
  - Depends on: F-01, F-02
  - Notes: [NOTES]

---

## Results Dashboard Tasks
> Scope: `src/app/dashboard/`, `src/components/dashboard/`, `src/components/ui/`

- [ ] **D-01** [TASK_TITLE]
  - Files: `[FILE_PATH]`
  - Depends on: P-01
  - Notes: [NOTES]

---

## Cross-Cutting Tasks
> Tasks that touch shared interfaces or require coordination across teams

- [ ] **X-01** [TASK_TITLE]
  - Teams involved: [TEAMS]
  - Files: `src/types/[type].ts`
  - Notes: Coordinate before starting — changes affect multiple teams.

---

## Completion Checklist

- [ ] All F-xx tasks complete
- [ ] All A-xx tasks complete
- [ ] All P-xx tasks complete
- [ ] All D-xx tasks complete
- [ ] All X-xx tasks complete
- [ ] Error states tested for all async operations (P1)
- [ ] Mobile layout verified at 375px (P5)
- [ ] Color contrast checked (P5)
- [ ] No server secrets in client bundle (P3)
- [ ] PR opened with Vercel preview link (P7)
