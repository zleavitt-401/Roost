---
paths:
  - "src/app/api/**"
  - "src/lib/agents/**"
  - "src/lib/email/**"
---

# Agent Pipeline Rules

## Async-First Mandate
- Agent processing is ALWAYS async — never block an HTTP response waiting for Claude API calls
- The trigger endpoint (`POST /api/agents/trigger`) responds immediately with 202 Accepted + `resultId`
- Agents run in the background; results written to Firestore as each completes

## Agent Architecture
Execution order:
```
Location Profiler → [Job Scout, Housing & Budget Analyst] (parallel per city)
```
1. **Location Profiler** — identifies 3–5 best-fit US cities from user profile
2. **Job Scout** — finds job matches per city (parallel after Location Profiler)
3. **Housing & Budget Analyst** — finds rentals + builds budget per city (parallel)

## Claude API Usage
- Model: `claude-sonnet-4-20250514`; `max_tokens: 4096` for research calls
- Enable web search tool: `tools: [{ type: "web_search_20250305", name: "web_search" }]`
- Always use structured JSON output — define explicit response schemas in system prompts
- System prompts live as constants in each agent file, not inline
- Parse responses defensively — strip markdown fences before `JSON.parse`
- Implement retry logic (3 attempts, exponential backoff) for API failures
- Log token usage per agent call for cost monitoring

## Firestore Write Pattern
- Write partial results as each agent completes — don't batch all at the end
- Update `agentStatus` field: `pending → processing → complete | error`
- If one agent fails, mark that section as `error` but continue other agents; save partial results

## Error Handling
- Catch and log all Claude API errors with full context (userId, agentName, attempt)
- On final failure, write error state to Firestore so the UI can surface a meaningful message
- Never let an unhandled promise rejection crash the pipeline

## Email (Nodemailer/Gmail)
- Send notification only after ALL agents complete (or on error with partial results)
- Use `NEXT_PUBLIC_APP_URL` for the dashboard link in emails

## Never Do
- Never expose `ANTHROPIC_API_KEY` in client-side code or API responses
- Never run agents synchronously in the API response
- Never skip error handling on Claude API calls — rate limits and timeouts happen
