# Security Rules

## Environment Variables
- `ANTHROPIC_API_KEY`, `GMAIL_APP_PASSWORD`, and Firebase Admin credentials are SERVER-SIDE ONLY
- Never import server-only env vars in client components or `src/lib/firebase.ts`
- `NEXT_PUBLIC_*` vars are intentionally public — Firebase client config is fine to expose
- Never commit `.env.local` or any file containing real secrets

## API Route Security
- All API routes that touch user data must verify the caller's Firebase Auth token
- Verify token server-side using the Admin SDK: `adminAuth.verifyIdToken(token)`
- Return 401 for missing/invalid tokens, 403 for insufficient permissions
- Never trust client-provided `userId` — always derive from the verified token

## Input Validation
- Validate and sanitize all user inputs before writing to Firestore or passing to Claude
- File uploads: validate MIME type and size server-side (not just client-side)
- Sanitize any user text that will be embedded in prompts to prevent prompt injection

## Firestore Security Rules
- Scope all reads/writes to `request.auth.uid`
- Deny all by default; explicitly allow only required operations
- Never use `allow read, write: if true` in production

## Data Privacy
- Don't log PII (email, resume contents) in server logs
- Resume files in Storage: use private bucket rules, generate signed URLs for access
- Don't expose other users' data in any API response
