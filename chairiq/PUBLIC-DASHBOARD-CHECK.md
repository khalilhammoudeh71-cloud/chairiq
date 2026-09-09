# Public dentist verification and dashboard correction

September 8, 2026: the user signed in at chairiq-delta.vercel.app. Account menu and dashboard recognized the dentist; both sample plans and one patient were visible. Browser console errors: none.

A live View click revealed a missed integration: RecentPlansCard still used revoked public_token values and displayed Link Invalid. The correction obtains a fresh owner-scoped expiring link using the plan and patient IDs, stores that token, and navigates only after success; failures show a toast. Both card and View button use it. No old bearer tokens were restored.

All92 local tests passed; local production build passed; independent bounded review found no blocking/security issue. The corrected production deployment dpl_4eDPArWos12mm7hjRzpMFVqTfR74 reached READY at chairiq-delta.vercel.app, release snapshot621bddd07ab69bd9501e8727df1287c857329570. Original repository remains uncommitted/unpushed.

Live re-test: dashboard View opened the matching sample plan at /p without errors. Database confirmed the app-generated link has exactly24hours lifetime. The same generated link loaded the matching plan in a separate Chrome browser and ended at /p; no ChairIQ login was performed there. This was a separate browser, not incognito. The new view link remains valid until its normal expiry; no token is included in this report.

No messages sent, treatment contents changed, or DNS changes. Analytics Copy Link / email and Pending Actions contain additional legacy-token paths seen during source inspection; those separate controls have not been verified or corrected in this bounded View fix. Do not claim all delivery controls have passed. Email/SMS delivery remains untested and requires explicit recipient/authorization.
