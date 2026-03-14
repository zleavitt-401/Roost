---
paths:
  - "src/lib/firebase.ts"
  - "src/lib/**/*firebase*"
  - "src/lib/**/*firestore*"
  - "src/components/**/*.tsx"
---

# Firebase Rules

## Client vs. Admin SDK
- Use the **client SDK** (`src/lib/firebase.ts`) in browser code and client components
- Use the **Firebase Admin SDK** only in server-side API routes — never import in client bundles
- Never expose service account credentials — Admin SDK keys must only live in server-side env vars

## Firestore Patterns
- Use `onSnapshot` for real-time dashboard data, `getDoc`/`getDocs` for one-time reads
- Always unsubscribe `onSnapshot` listeners in `useEffect` cleanup functions
- Always handle the case where a document doesn't exist (check `snapshot.exists()`)
- Structure: `users/{userId}/profile` for user data, `users/{userId}/results/{resultId}` for agent results
- Timestamps: always use `serverTimestamp()` for `createdAt` / `updatedAt`
- Status fields use string enums defined in `src/types/index.ts`

## Auth
- Use Firebase Auth email/password for MVP
- Store `userId` from `auth.currentUser.uid`, never from user input
- Auth state managed via `onAuthStateChanged` listener at app root
- Redirect unauthenticated users to `/login` — never show a blank page

## Storage
- Resume uploads go to `resumes/{userId}/{filename}`
- Accept only PDF and DOCX — validate MIME type before upload; max 10MB

## Error Handling
- All Firebase operations wrapped in try/catch
- Log errors with operation context: `console.error('Firestore: failed to write user profile', error)`
- Show user-friendly error messages, never raw Firebase error codes

## Never Do
- Never expose Firebase Admin SDK credentials client-side
- Never use `NEXT_PUBLIC_` prefix for server-only Firebase config
- Never write Security Rules that allow unrestricted read/write (`allow read, write: if true`)
