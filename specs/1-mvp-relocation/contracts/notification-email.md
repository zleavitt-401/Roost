# Contract: Notification Email

**Produced by:** Agent Pipeline team
**Consumed by:** End user (email inbox)

---

## Trigger

Sent when agent processing completes successfully (agentStatus → 'complete').

## Email Content

**From:** `Roost <{GMAIL_USER}>`
**To:** User's email (from Firebase Auth)
**Subject:** `Your Roost results are ready!`

**Body (HTML):**
- Greeting: "Hi {displayName},"
- Message: "We've found {N} locations that could be a great fit for you."
- CTA button: "View Your Results" → links to `{NEXT_PUBLIC_APP_URL}/dashboard`
- Footer: "You're receiving this because you signed up for Roost." + placeholder unsubscribe link

## Transport

- Nodemailer with Gmail SMTP
- Auth: Google App Password (`GMAIL_USER` + `GMAIL_APP_PASSWORD` env vars)
- No email sent on error status (user sees error state on dashboard instead)
