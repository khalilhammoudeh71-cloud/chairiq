---
name: Procedure visuals pipeline
description: How patient-facing procedure step diagrams are stored/served and traps when adding new ones
---

Patient step diagrams are served ONLY from the Supabase `procedure_visuals` table (public URLs in the `treatment-images` storage bucket, path `<canonical_slug>/<step_key>.jpg`). The static `public/visuals/<slug>/step_N.svg` files are dead — only `thumb.jpg` in those dirs is referenced (dashboard/library thumbnails, ProcedureThumb fallback chain).

**Why:** the whole DB rows already existed pointing at the dead SVGs, which made it look like static files mattered; the actual consumer path is `patientPlanService` querying `procedure_visuals` by canonical slug.

**How to apply:** to add/upgrade visuals for a procedure, upload to storage with the service key and upsert `procedure_visuals` (onConflict `canonical_slug,step_key`; `hero` = sort 0, `step_N` = sort N; EN/ES alt text). Storage-hosted URLs take effect in dev AND prod immediately (no republish); static files under `public/` need a republish.

Traps:
- A `hero` row (sort 0) breaks any consumer that index-aligns visuals to steps; consumers must filter `step_key === 'hero'` or match by `step_key` (markdown-content-editor had this bug; patient paths already separate hero).
- ADA D1110/"adult prophy"/"prophylaxis" all normalize to canonical slug `cleaning` (see procedureNormalization.js), BUT plan rows with an explicit stored `canonical_slug` (e.g. legacy 'prophy') are NOT alias-normalized — they miss the curated `cleaning` library entry.
- Supabase writes from scripts: use `SUPABASE_SECRET_KEY` against REST/storage (works fine); anon key is read-only for these tables.
- `procedure_library.steps_en` rows exist in TWO shapes: newer `{stepTitle, stepBody, imageKey}` and older `{title, description}`. Any consumer reading only `stepTitle` shows blank/Untitled for older rows — always read `stepTitle || title` (and `stepBody || description`).
- Staff per-step image replacement UI lives in the content editor ("Step Images" card, edit mode only); it keys uploads by the row's `canonical_slug || slug` and takes effect for patients immediately.
- End-to-end verification without login: insert a throwaway patient+plan+procedure with the service key, screenshot `/p/<public_token>` (or `/treatment-plan-landing?token=...`), then delete the patient (cascades).
