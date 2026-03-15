# Contract: Agent Trigger API

**Produced by:** Agent Pipeline team
**Consumed by:** Auth & Onboarding team

---

## Endpoint

```
POST /api/agents/trigger
```

## Request

**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer <Firebase ID token>`

**Body:**
```typescript
interface AgentTriggerRequest {
  userId: string;
}
```

**Validation:**
- `userId` must match the authenticated user's UID (derived from the verified Firebase ID token)
- Request is rejected (409 Conflict) if user's `agentStatus` is already `'processing'` or `'complete'`

## Response

**Success (200):**
```typescript
interface AgentTriggerResponse {
  success: true;
  resultId: string;  // ID of the created AgentResults document
  message: string;   // "Agent processing started"
}
```

**Already Running (409):**
```typescript
{
  success: false;
  resultId: string;  // ID of existing result
  message: string;   // "Agents already processing" or "Results already complete"
}
```

**Unauthorized (401):**
```typescript
{
  success: false;
  message: string;   // "Missing or invalid authentication token"
}
```

**Forbidden (403):**
```typescript
{
  success: false;
  message: string;   // "UserId does not match authenticated user"
}
```

**Server Error (500):**
```typescript
{
  success: false;
  message: string;   // "Failed to start agent processing"
}
```

## Behavior

1. Verify Firebase ID token from Authorization header
2. Confirm `userId` in body matches token's UID
3. Read user's current `agentStatus` from Firestore
4. If `'processing'` or `'complete'`, return 409 with existing resultId
5. Create new `AgentResults` document with status `'processing'`
6. Update user's `agentStatus` to `'processing'`
7. Return 200 with resultId
8. In `after()` callback: run agent orchestration (Location Profiler → Job Scout + Housing in parallel)
9. On completion: update `AgentResults` status to `'complete'`, update user's `agentStatus` to `'complete'`, send notification email
10. On error: update statuses to `'error'`, log error server-side
