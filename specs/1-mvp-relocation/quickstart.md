# Quickstart: Roost MVP

## Prerequisites

- Node.js 18+
- Firebase project with Auth, Firestore, and Storage enabled
- Anthropic API key
- Gmail account with Google App Password

## Setup

```bash
# Install dependencies (including new ones from plan)
npm install firebase-admin pdf-parse mammoth

# Copy env template and fill in values
cp .env.example .env.local
```

## Required `.env.local` values

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
ANTHROPIC_API_KEY=sk-ant-...
GMAIL_USER=you@gmail.com
GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Run

```bash
npm run dev
```

## Implementation Order

1. **Wave 1 (Foundation):** Types, Firebase config, theme, homepage
2. **Wave 2 (parallel):** Auth/Onboarding, Agent Pipeline, Dashboard
3. **Wave 3 (integration):** Wire navigation, verify end-to-end flow

See `plan.md` for detailed task breakdown per wave.
