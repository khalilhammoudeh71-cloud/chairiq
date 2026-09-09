> **Update:** Public dentist sign-in/dashboard now verified. The missed dashboard View integration was corrected and production updated to dpl_4eDPArWos12mm7hjRzpMFVqTfR74. See PUBLIC-DASHBOARD-CHECK.md / ChairIQ-public-dashboard-check.md.

# ChairIQ public production release — September 8, 2026

Public app: https://chairiq-delta.vercel.app/login
Production deployment: dpl_6HgyT4YrwYKdA9f1QuBt1R7q8QP6, READY.
Source: same tested runtime snapshot269e8f8beb1b11a9a73ff656cfc307172eff972f.

The user authorized making ChairIQ publicly accessible. Initial preview promotion created a new production build (dpl_ESp4FDEExds2fHDpakmwCAM4UPcJ), but production had no environment configuration. The seven existing branch-preview application settings were copied to production: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS and FROM_EMAIL. The password was stored as a Vercel secret. Supabase target was checked against ChairIQ. No values were printed in the report; the temporary downloaded environment file was deleted. A fresh production build with that configuration succeeded and replaced the first promotion.

Public verification used ordinary Python HTTP requests with no Vercel cookies or bypass token: /login returned200; /p/<fresh sample token> returned Express302 Location:/p; following the handoff with only its patient cookie returned200 at https://chairiq-delta.vercel.app/p. The in-app browser loaded the matching sample plan and five procedures without ChairIQ dentist login; final URL contained no token and no browser errors were captured. The verification token was then intentionally expired: the RPC returned expired and browser reload showed Link Expired. Only that test share-link row was created/expired; no treatment contents were changed.

The longer team hostname chairiq-khalilhammoudeh71-clouds-projects.vercel.app still redirects unauthenticated requests to Vercel sign-in. Use chairiq-delta.vercel.app for public access. No Vercel protection setting was disabled, and no custom-domain DNS or Twilio setting changed. Production promotion assigned Vercel-managed production aliases. No SMS/email was sent; delivery has not been live-tested. Future links derive from the current browser origin, so sign in at the public address before generating patient links.

Dentist login/dashboard and both sample plans were previously verified on the matching preview; an actual dentist login on this new production origin was not repeated. Patient-specific live image downloads could not be exercised because there are no sample image records; isolated image tests passed earlier. Existing unrelated security-advisor findings remain as recorded in the rollout report.
