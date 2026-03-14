# Agent Pipeline Rules

## Async-First Mandate
- Agent processing is ALWAYS async — never block an HTTP response waiting for Claude API calls
- The trigger endpoint (`POST /api/agents/trigger`) responds immediately with 202 Accepted
- Agents run in the background; results are written to Firestore as they complete

## Agent Architecture
Three agents in the MVP pipeline:
1. **Location Profiler** — identifies 3–5 best-fit US cities from user profile
2. **Job Scout** — finds job matches per city (runs in parallel after Location Profiler)
3. **Housing & Budget Analyst** — finds rentals + builds budget per city (runs in parallel)

Execution order:
```
Location Profiler → [Job Scout, Housing & Budget Analyst] (parallel per city)
```

## Claude API Usage
- Model: `claude-sonnet-4-20250514` (defined in `src/lib/agents/`)
- Always use structured output (JSON) — define explicit response schemas
- System prompts live as constants in each agent file, not inline
- Implement retry logic (3 attempts, exponential backoff) for API failures
- Log token usage per agent call for cost monitoring

## Firestore Write Pattern
- Write partial results as each agent completes — don't batch all results at the end
- Update `status` field on the results document: `pending → processing → complete | error`
- If any single agent fails, mark that section's status as `error` but continue other agents

## Error Handling
- Catch and log all Claude API errors with full context (userId, agentName, attempt)
- On final failure, write error state to Firestore so the UI can show a meaningful message
- Never let an unhandled promise rejection crash the agent pipeline

## Cost Controls
- Enforce max token limits per agent (set in agent config)
- Log cost estimates per run to help monitor spend
