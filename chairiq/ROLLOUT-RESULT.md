> **Public release complete:** https://chairiq-delta.vercel.app/login is now deployed and verified without Vercel authentication. See ChairIQ-public-release.md / PUBLIC-RELEASE.md. Earlier preview-only restrictions below describe the prior stage.

# ChairIQ rollout applied — September 8, 2026

Preview: https://chairiq-32tf3jtur-khalilhammoudeh71-clouds-projects.vercel.app/login
Deployment: dpl_GWuV1PbdM9LACRoMeK4aQBdPQjyo, READY, preview (not production).

## Applied with user approval

- Live secure_plan_share_links migration: 20260908202623 (local source 20260908052729).
- Live scope_patient_data_access migration: 20260908202632 (local source 20260908142423).
- Previously applied consent permission migration: 20260908200425 (local source 20260908182644).
- Exact guarded owner assignment: two sample plans and their one patient assigned to the confirmed dentist account.
- Exact guarded sample-link revocation: both old public_token values replaced with non-bearer markers. Plan content retained.
- patient-plan-image Edge Function deployed, version1, JWT verification enabled.
- Matching app uploaded directly through Vercel CLI59.11.7, built successfully and reached READY. A local release-only Git snapshot 269e8f8beb1b11a9a73ff656cfc307172eff972f records uploaded runtime source in work/vercel-release. No commit/push was made to the original repository or GitHub. Original source edits remain uncommitted.

## Verified live

- Consent RLS remains enabled; private patient-images bucket exists.
- Confirmed dentist database role sees two plans and one patient.
- Anonymous direct patient-table read denied with expected PostgreSQL42501.
- Both old sample bearer tokens return not_found.
- One verification link created under the authenticated dentist database role. Database assigned exactly24 hours despite a shorter requested expiry; valid anonymous exact-token fetch succeeded.
- The new preview loaded the sample plan and its five procedures in a separate in-app browser origin without a ChairIQ dentist login. Final browser URL was /p, token removed; no initial browser console errors.
- Vercel-authenticated HTTP check confirmed Express302 and Location:/p.
- The same verification link was then intentionally expired; database returned expired and browser reload showed Link Expired. Its expired row remains as test evidence; no live usable token is included in this report.
- Full local suite last passed90 tests. Previous isolated Supabase verification passed31 API,11 image/CORS and4 expiry checks. No patient-specific image records existed to exercise a real live image download; that path remains covered by isolated tests, with the endpoint now deployed.

## Remaining verification and limitations

Dentist browser sign-in and dashboard verification passed in the user’s in-app browser on the new preview. The signed-in menu showed the dentist account, the dashboard welcomed the confirmed dentist, Active Patients showed 1, and Recent Patient Plans displayed both sample plans (Mar 29 and Mar 4). Plans This Month showed 0, consistent with those older dates. No browser console errors were captured. No create/edit, send-email or send-SMS controls were used.

Existing Vercel preview protection remains enabled. A request without Vercel authorization redirects to Vercel sign-in; this preview is not suitable for unauthenticated patient distribution. Vercel CLI automatically generated a project automation bypass credential during the authenticated HTTP test. Protection was not disabled and no bypass credential was exposed in this report. Public production delivery requires a separate deployment/access decision; no production alias or DNS was changed.

The latest available daily physical backup was verified in the Supabase dashboard at2026-09-08 08:59:01UTC; no restore rehearsal was performed. Point-in-time recovery is off. A restore would lose later writes and undo today's fixes; see rollout plan for forward recovery guidance. No restore was performed.

Security advisor review still reports older function/search-path and schema-discovery findings. The share-link schema discovery notice describes authenticated table visibility, not a bypass of owner row policies. No consent-table exposure notice remains. This is not a full clean security audit.

Do not replay historical migrations or reapply the local files under their earlier timestamps. Live history also contains20260908173913 remote_schema. Reconcile the recorded local/live mappings before future migration pushes.

No SMS/email, Twilio change, DNS change, production promotion or sample treatment-content change occurred. The approved ownership/token operations and one expiring verification link were the only patient-related writes performed by this rollout; normal view counting may occur on page load.
