---
name: Production env vars for autoscale deployment
description: Why Supabase client vars must live in Replit env vars, not chairiq/.env, and how to verify live sends
---

# Production env vars for the autoscale deployment

`chairiq/.env` is gitignored, so anything only defined there (e.g. `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) is **absent in the published autoscale container**. Those two are now set as shared Replit env vars.

**Why:** The Express server reads them via `dotenv/config` + `process.env`; without them, auth middleware and SMS (Supabase edge function `send-sms` → Twilio) silently fail in production while working in dev.

**How to apply:** Any new runtime config added to `chairiq/.env` that the server needs must also be added as a Replit env var (public values) or secret (sensitive values) before republishing.

# Verifying live sends without real recipients

- Authenticated production endpoints can be exercised by creating a temp Supabase user with the service key (`admin.createUser` with `email_confirm: true`), signing in for a JWT, calling the live API, then deleting the user and any test `message_logs` rows.
- Twilio accepts `+15005550006` (queued) for pipeline verification without texting a real person.
- A controlled email recipient is the practice's own inbox (the `FROM_EMAIL` address).
- The plan table is `treatment_plans` (not `plans`); `message_logs.plan_id` references it.
