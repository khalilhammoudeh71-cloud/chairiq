> **Applied:** The user approved this rollout and the changes were applied. See ROLLOUT-RESULT.md / ChairIQ-rollout-progress.md for verification, including completed dentist sign-in and dashboard checks. The plan below is retained as the approved pre-release record.

# ChairIQ rollout plan — pending final live approval

## Current state — September 8, 2026

The consent-table fix is live and verified. All share-link/app/access changes and both reviewed data operations remain local and unapplied. The user confirmed the two existing plans are samples and accepted preparing a rollout that invalidates their old links while preserving the plans.

Read-only checks reconfirmed exactly two plans for the confirmed patient, both currently unowned; the confirmed dentist account exists. The share-link table is still absent. Live public_token is text, NOT NULL and UNIQUE; revocation therefore replaces tokens with unique `revoked:` markers, rather than deleting plans or setting tokens to null. These markers are rejected by the patient RPC token format.

The Vercel preview is READY at baseline commit 25154ba97eb3a59f25f94533c8230841b33e8308, deployment dpl_J22P3g9KLF8tmfM3xao1m1DRdfJz, project prj_upHHkqHeOLyUF9c1uH2X2j2gop8b. It is a preview, not a production promotion. The proposed app destination is a new preview in that existing Vercel project; no DNS or production-alias change is included.

## Exact proposed release

1. Backup availability verified in the signed-in Supabase dashboard: latest physical daily backup 2026-09-08 08:59:01 UTC (03:59:01 Chicago), with Restore available. Point-in-time recovery is not enabled. Restore availability is verified, not a restore rehearsal or proof of backup integrity. This recovery point predates today’s consent migration and can lose subsequent writes; a recovery would require reviewing/reapplying the consent fix and retaining safer access controls. Storage object bytes are excluded. No restore or paid add-on was initiated. Do not describe the deleted synthetic branch as a backup.
2. Prepare a versioned app artifact and retain the current source/build reference. Confirm matching preview environment variable names/targets without exposing secrets. Do not change Twilio or delivery configuration.
3. At the final approval gate, present the live database changes together with the new preview and Edge endpoint deployment. These share one database with any older ChairIQ app: older anonymous table-reading clients will be incompatible after the access migration. A coordinated maintenance window or explicit acceptance of that interruption is needed.
4. Deploy the tested patient-plan-image Edge Function with JWT verification enabled, using existing built-in server credentials. No SMS/email functions are invoked.
5. Apply only the reviewed secure_plan_share_links and scope_patient_data_access SQL migrations, in order. Recheck live schema assumptions and the zero old patient-image preflight immediately before execution. Each migration is transactional; stop on any error.
6. Run assign-confirmed-plan-owners.sql for the exact two sample plans and one patient, then revoke-confirmed-sample-links.sql. Both guard against changed ownership/membership. Preserve sample plan contents. Old sample bearer URLs become invalid; future sharing actions create new 24-hour links.
7. Release the matching app preview and test login, owner access, fresh-link creation, /p/<token> backend redirect to /p, logged-out plan access, image access and denial of old sample links. No SMS/email delivery. A fresh test share-link row is an intended verification write included in the final approval scope; do not modify sample treatment content.
8. Record applied migration versions, preview URL and live verification results. Do not promote to production or change DNS as part of this scope.

## Migration history and recovery

Live migration history now lists 20260908173913 remote_schema and 20260908200425 protect_sms_consent. The local consent source is 20260908182644_protect_sms_consent.sql: it is already applied under the live version and must not be applied again. Earlier share/access local filenames predate the live remote_schema snapshot; reconcile their versions/history before any CLI push. Apply exact reviewed SQL individually through the migration tool and record the resulting versions. Never run the entire historical migration directory: it contains destructive reset and mock seed scripts.

If a transaction fails, stop and inspect; it rolls back its own changes. If later app/Edge verification fails after access controls are installed, keep the safer permissions and correct the app/Edge forward. The old app alone is not a compatible rollback. A database restore can discard later writes and requires an independently verified recovery procedure and approval; no restore is authorized here. Do not restore broad public policies or resurrect the sample bearer tokens as a convenience rollback.

## Verification

All 90 local tests pass, including the new sample-link revocation tests. Tests verify old bearer removal, exact row preservation, unrelated link preservation, and atomic refusal on changed ownership, missing plans or extra related plans. The sample revocation operation is tested in synthetic PostgreSQL locally; it has not been exercised against live data or the previously deleted Supabase branch. The earlier full Supabase tests remain 31 API, 11 image/CORS and 4 same-token expiry checks passed. The app build passed in that phase; subsequent additions are SQL/tests/docs only.

Independent bounded review found no important/security/compatibility issues in the sample revocation operation; both tests passed independently. Backup timestamp and restore availability are verified; no restore rehearsal was performed. The management API reports ACTIVE_HEALTHY, although the initially loaded overview briefly displayed Unhealthy; do not infer an outage from that initial UI state alone. No remaining live migration, ownership assignment, sample-link revocation, deployment, SMS or email was performed during preparation.

Recovery procedure reference: https://supabase.com/docs/guides/platform/backups . Dashboard restore requires explicit confirmation and makes the project inaccessible during restoration. No restoration is included in the proposed release approval.
