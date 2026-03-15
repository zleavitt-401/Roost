# Contract: Resume Parse API

**Produced by:** Auth & Onboarding team (API route)
**Consumed by:** Auth & Onboarding team (client-side onboarding flow)

---

## Endpoint

```
POST /api/resume/parse
```

## Request

**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer <Firebase ID token>`

**Body:**
```typescript
interface ResumeParseRequest {
  resumeUrl: string;      // Firebase Storage path
  coverLetterUrl?: string; // Firebase Storage path (optional)
}
```

## Response

**Success (200):**
```typescript
interface ResumeParseResponse {
  success: true;
  parsedResume: ParsedResume;
}
```

**Validation Error (400):**
```typescript
{
  success: false;
  message: string;  // "Invalid file URL" or "File not found"
}
```

**Unauthorized (401):**
```typescript
{
  success: false;
  message: string;
}
```

## Behavior

1. Verify Firebase ID token
2. Download file from Firebase Storage using admin SDK
3. Extract text (pdf-parse for PDF, mammoth for DOCX)
4. Send extracted text to Claude API with structured extraction prompt
5. Parse Claude response into `ParsedResume` shape
6. Return parsed data for user confirmation
