# Security Rules

## Environment Variables
- `ANTHROPIC_API_KEY`, `GMAIL_APP_PASSWORD`, Firebase Admin credentials are SERVER-SIDE ONLY — no `NEXT_PUBLIC_` prefix
- `NEXT_PUBLIC_FIREBASE_*` client config is intentionally public — that's fine
- Never commit `.env.local` or any file containing real secrets; never log API keys in error messages

## API Route Security
- All API routes that touch user data must verify the caller's Firebase Auth token server-side: `adminAuth.verifyIdToken(token)`
- Return 401 for missing/invalid tokens, 403 for insufficient permissions
- Never trust `userId` from the client request body — always derive from the verified token

## Input Validation
- Validate all user input on both client AND server before writing to Firestore or passing to Claude
- File uploads: validate MIME type server-side, enforce 10MB size limit, reject unexpected formats
- Questionnaire answers must match expected enum values — reject unexpected inputs server-side
- Sanitize any user text embedded in prompts to prevent prompt injection

## Firestore Security Rules
- Scope all reads/writes to `request.auth.uid` — users can only access their own data
- Deny all by default; explicitly allow only required operations
- Agent results readable only by the owning user; resume files accessible only by the owning user

## Data Privacy
- Don't log PII (email, resume contents) in server logs
- Resume files in Storage: use private bucket rules, generate signed URLs for access
- Don't expose other users' data in any API response; never expose raw error stack traces to users

## Never Do
- Never disable TypeScript strict mode to "fix" a type error
- Never store passwords, SSNs, or payment info
- Never use `allow read, write: if true` in Firebase Security Rules
