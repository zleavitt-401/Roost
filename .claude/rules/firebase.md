# Firebase Rules

## Client vs. Admin SDK
- Use the **client SDK** (`src/lib/firebase.ts`) in browser code and client components
- Use the **Firebase Admin SDK** only in server-side API routes (never import in client bundles)
- Never expose service account credentials — Admin SDK keys must only live in server-side env vars

## Firestore Patterns
- Use `onSnapshot` for real-time listeners in the dashboard — no polling
- Always unsubscribe `onSnapshot` listeners in `useEffect` cleanup functions
- Structure documents to minimize reads: embed data that's always fetched together
- Use subcollections for one-to-many: `users/{userId}/results/{resultId}`

## Security Rules (to be written in Firebase Console)
- All user data must be scoped to `request.auth.uid == userId`
- Never allow unauthenticated reads of user data
- Storage uploads limited to authenticated users; max file size enforced in rules

## Data Model Conventions
- Document IDs: use Firebase auto-IDs unless a natural key exists (e.g., `userId`)
- Timestamps: always use `serverTimestamp()` for `createdAt` / `updatedAt`
- Status fields use string enums defined in `src/types/index.ts`

## Auth
- Use Firebase Auth email/password for MVP
- Auth state managed via `onAuthStateChanged` listener at app root
- Protect all routes behind auth check — redirect to `/login` if unauthenticated
