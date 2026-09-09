# Vercel migration: Phase 1

Status: local implementation only. No deployment or production configuration changes.

## Build and runtime

- Vercel project Root Directory: `chairiq`.
- Node.js on Vercel: `24.x` (supported LTS). The package engine range is
  `20.x || 24.x`: Vercel selects the highest matching supported major (24), while
  the existing Replit Node 20 runtime remains compatible.
- Install: `npm ci`; build: `npm run build`; output: `build`.
- `package-lock.json` now belongs to this application. The first app lock was seeded from the repository root lock to
  retain compatible recorded versions; packages absent there resolve from the
  existing ranges. The exact Replit installation was not available for comparison.
- Supabase is pinned to `2.87.1`, the version already named by the original
  dependency declaration. The initial lock resolved `2.116.0`, which fails client
  initialization on Node 20 because it requires a native WebSocket. This pin
  preserves Replit compatibility without changing application authentication code.
  Other dependency declarations are unchanged.
- `npm start` keeps the local/Replit listener. Production startup serves `build`;
  development startup uses Vite middleware. `NODE_ENV=production` works without
  `REPLIT_DEPLOYMENT`; that flag remains supported for existing Replit startup.
- `api/index.js` exports the same app from `server/app.js`. Importing the function
  does not start a listener, load Vite, or serve local build files.

## Routing

`vercel.json` uses an ordered `routes` table: security headers, fingerprinted
JS/CSS cache headers, backend routes, filesystem, then SPA fallback. It deliberately
does not mix low-level `routes` with top-level `headers` or `rewrites`.

- `/api` and `/api/*` go to Express; unknown API routes return JSON 404.
- `/p/:publicToken` goes to Express before HTML. Existing validation, cookie and
redirect semantics are retained, with non-cacheable responses added.
- `/p` and other frontend deep links fall back to `index.html` after static lookup.
- Static files come from the Vite output. Only fingerprinted JS/CSS receive the
  immutable policy; replaceable public images do not receive blanket immutable caching.
- Existing Express parser errors retain their original behavior; API requests
  never use the React index fallback.

## Verification

Run `npm ci`, `npm run build`, then `npm test` inside `chairiq`.
Tests start child processes with an environment allowlist and dotenv disabled.
They exercise unauthenticated APIs, unknown API paths, token validation/cookies/
redirects/cache headers, import without listening, and built SPA routes/assets.
An authenticated request also runs against an in-memory mock auth response with
native WebSocket absent, protecting compatibility with the Replit runtime.
The build-dependent test skips if no build exists. Tests do not authenticate with
Supabase or invoke actual messaging providers. They do not certify live delivery.

## Still pending

- Phase 2: replace Replit's OpenAI/Gemini development proxies. AI generation,
  personalization, summaries, chat and TTS are not functional on Vercel yet.
  Existing proxy configuration is intentionally unchanged.
- Preview configuration: provide the Supabase public variables at both build and
  runtime, and server-only SMTP variables if email is to be tested. Use an isolated
  test environment. No environment values are stored in this document.
- Keep Twilio credentials and `send-sms` in Supabase. No sender, message wording,
  consent or campaign behavior changed.
- Replit-injected analytics, scheduled batch execution and existing Supabase access
  policy concerns remain outside Phase 1.
- Vercel-hosted integration verification and any domain cutover require separate
  authorization. Do not use a preview against production data for smoke tests.
