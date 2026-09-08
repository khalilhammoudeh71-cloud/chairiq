# ChairIQ — Getting Anatomically Accurate Procedure Images

**Prepared:** August 17, 2026. Plain-language guide for sourcing replacement images for the AI-generated step diagrams.

---

## 1. Where we stand today (coverage inventory)

The Content Library has **39 published procedures**. Almost every one already has 4–5 AI-generated step images, so this is a **replacement** project, not a fill-the-gaps project — you can swap images one at a time, highest-value first, and patients always see something in the meantime.

### Priority order (what to replace first)

**Tier 1 — procedures already used in real patient plans:**

| Procedure | Slug | Steps | Used in plans |
|---|---|---|---|
| Dental Examination | `exam` | 3 | 2 plans |
| Root Canal Treatment | `root-canal` | 5 | 1 plan |
| Dental Crown | `crown` | 4 | 1 plan |
| Tooth Extraction | `extraction` | 4 | 1 plan |
| Denture | `denture` | 5 | 1 plan |

**Tier 2 — highest-volume everyday procedures:** Dental Cleaning (`cleaning`, 4 steps), Dental Filling (`filling`, 4), Scaling & Root Planing (`scaling-root-planing`, 5), Dental Implant (`implant`, 6), Dental Bridge (`bridge`, 5).

**Tier 1 + Tier 2 = 45 images** (plus optional hero images). The full shot list for these is in `shot-list.md`.

**Tier 3 — everything else:** the remaining ~29 procedures (whitening, veneer, gum graft, bone graft, sinus lift, etc.), roughly 120 more images. Do these after Tier 1–2 proves the style.

**Content gaps to fix first:** 4 procedures have images but **no step text at all** (`simple-extraction`, `srp`, `wisdom-teeth-education`, `valplast-education`). Write their steps before commissioning images, so the images match real step titles. Note `srp` duplicates `scaling-root-planing` — consider retiring one.

---

## 2. Chosen approach — Freepik Premium subscription

**Decision (Aug 17, 2026):** subscribe to **Freepik Premium** and curate accurate dental illustrations from it, replacing AI-generated step images one at a time.

**Why Freepik won:**
- **Price:** roughly **$10–25/month** for unlimited downloads (pick the Premium tier at freepik.com/pricing) — vs. $500+ one-time for 3D renders or $300+ per image for a medical illustrator.
- **License fits ChairIQ:** the Premium commercial license explicitly covers using downloaded images inside apps and websites, with no attribution required. The only real limits: you can't resell/redistribute the image files themselves as files, and can't use them as a trademark/logo. Displaying them on patient education pages is squarely allowed.
- **Content is there, with curation:** searches like "dental implant cross section", "tooth anatomy", "root canal illustration" return genuinely accurate labeled diagrams mixed with marketing-style graphics. The doctor screens every pick for anatomical accuracy before upload — same review step as any other source.

**Libraries considered and passed on:**
- **Envato Elements (~$17/mo):** unlimited too, but dental results skew cartoon/mascot style — weak for real anatomy education.
- **SciePro ($249/mo):** medically verified and beautiful, but dental coverage is thin — mostly general anatomy (hearts, brains, lungs).
- **Nucleus Medical Art Library:** gold-standard accuracy, but licensing images for embedding inside your own software requires a sales conversation and annual contract, not a simple subscription. Worth revisiting later for flagship procedures.
- **ViewMedica Stock:** accurate but pay-per-image credits ($6–10 each), not a subscription.

**Workflow:**
1. Search Freepik using the step titles in `shot-list.md` (e.g. "dental crown preparation illustration").
2. Download candidates; the **dentist approves each image** for anatomical accuracy.
3. Upload approved images in **Content Library → edit procedure → Step Images** — replaces the AI image for that step instantly. Use "Preview as patient" to confirm.
4. Work through Tier 1 first (21 images), then Tier 2.

**Practical tips:**
- Prefer a consistent illustration style across the steps of a single procedure (download from the same artist/series where possible).
- Save the Freepik page URL for each image you use in a simple list (spreadsheet or note) — good practice for license record-keeping.
- Where Freepik has no accurate match for a step, leave the AI image in place and note the gap; those few can be commissioned later (see options below).

---

## 3. Alternative — Buy a 3D dental model + render the steps

Buy one high-quality 3D model of teeth/jaw anatomy, then pay a 3D artist a small fee to pose and render each step from the shot list. One model gets reused for all ~165 images, which keeps every picture visually consistent.

**Where to buy models:**
- **CGTrader** (cgtrader.com/3d-models/dental) — large dental section; anatomically detailed tooth/jaw sets typically **$20–$150** per model.
- **TurboSquid** (turbosquid.com) — similar range; look for models with separate pulp/root/bone layers so cutaway renders are possible.
- **Sketchfab Store** — smaller selection, same license idea.

**Licensing — verified, and good news:**
- **TurboSquid Royalty-Free License:** rendered images made from a purchased model may be used "in almost all forms of media, including … online projects and mobile apps." You may NOT resell or redistribute the model file itself — ChairIQ only shows rendered JPG/PNGs, so this is fine. (Source: TurboSquid Royalty Free License FAQ, help.turbosquid.com)
- **CGTrader Royalty-Free License:** same principle — allowed as long as the model is "incorporated" and a third party "cannot retrieve it on its own." Rendered stills inside ChairIQ qualify. (Source: CGTrader Help Center, Royalty Free License article)
- One caution: a few products carry a **custom/editorial license** instead — check the license line on the product page before buying.

**What to look for in a model:** full adult dentition (32 teeth), separable teeth, root + pulp anatomy modeled (not just crowns), gum + jawbone meshes, and ideally a cross-section-ready setup.

**Rough budget:** model(s) $50–$300 once + freelance 3D artist (Upwork/Fiverr, $30–$80/hr) posing and rendering ~45 Tier 1–2 images ≈ **$500–$1,500 total** for Tiers 1–2.

## 4. Alternative — Commission a certified medical illustrator (best quality, most expensive)

- Find one through the **Association of Medical Illustrators directory (ami.org)** or the **Medical Illustration Sourcebook (medillsb.com)**.
- Typical pricing is **per illustration**, driven by complexity and license scope: simple single-panel dental illustrations commonly run **$300–$800 each**; detailed cutaways more. 45 images ≈ **$15,000–$35,000**. (Sources: AMI Pricing Guide, medillsb.com fee articles, published illustrator pricing pages.)
- Negotiate a **broad perpetual license for display in ChairIQ** (or work-for-hire). Per-use licenses are the default in this industry — say up front the images go inside a commercial software product.
- Best used selectively: e.g. commission only the most-seen procedure (exam or cleaning) as a brand-quality flagship set.

## 5. Alternative — License an existing dental patient-education library

Products like **CAESY Cloud** (Patterson Dental, 280+ multimedia presentations), **Consult-PRO**, and **BiteFX** license animations/images to dental practices. Two caveats: (1) practice licenses generally cover chairside/in-office display, **not embedding stills inside your own software** — that requires a partnership/redistribution agreement; (2) monthly subscription forever vs. owning images once. Worth a phone call if you want video too, otherwise Options A/B fit ChairIQ better.

## 6. Recommendation

1. **Now:** subscribe to **Freepik Premium** (Section 2) and start replacing Tier 1 images (21 images), using `shot-list.md` as the search checklist.
2. **Review workflow:** the dentist approves every image before upload (anatomy check), then staff upload each approved image in **Content Library → edit procedure → Step Images** — it replaces the AI image for that step instantly, no republishing needed. Use "Preview as patient" to see the result exactly as patients do.
3. **Fallback for gaps:** if Freepik has no accurate match for a specific step, keep the AI image there for now; batch those gaps and fill them later via the 3D-model route (Section 3) or a medical illustrator (Section 4) for marquee procedures.

## 7. Full inventory reference (all 39 procedures)

All are published. "Visuals" = existing AI-generated step images already in the system.

| Slug | Title | Steps | Visuals present | Notes |
|---|---|---|---|---|
| exam | Dental Examination | 3 | step 1–4 + hero | Tier 1 |
| root-canal | Root Canal Treatment | 5 | step 1–5 + hero | Tier 1 |
| crown (dental-crown) | Dental Crown | 4 | step 1–4 | Tier 1 |
| extraction | Tooth extraction | 4 | step 1–4 | Tier 1 |
| denture | Denture | 5 | step 1–4 | Tier 1 · step 5 has no image |
| cleaning | Dental Cleaning | 4 | step 1–4 + hero | Tier 2 |
| filling | Dental Filling | 4 | step 1–4 + hero | Tier 2 |
| scaling-root-planing | Scaling & Root Planing | 5 | step 1–4 + hero | Tier 2 · step 5 has no image |
| implant | Dental Implant | 6 | step 1–5 | Tier 2 · step 6 has no image |
| bridge | Dental bridge | 5 | step 1–4 | Tier 2 · step 5 has no image |
| whitening | Teeth Whitening | 4 | step 1–4 | Tier 3 |
| veneer | Dental Veneer | 5 | step 1–4 | Tier 3 |
| apicoectomy | Apicoectomy | 5 | step 1–4 | Tier 3 |
| bone-graft | Bone Grafting | 5 | step 1–4 | Tier 3 |
| core-buildup | Core Buildup | 4 | step 1–4 | Tier 3 |
| crown-lengthening | Crown Lengthening | 5 | step 1–4 | Tier 3 |
| dental-sealant | Dental Sealant | 3 | step 1–4 | Tier 3 · extra step_4 image unused |
| denture-reline | Denture Reline | 3 | step 1–4 | Tier 3 · extra image unused |
| emergency-palliative | Emergency/Palliative | 3 | step 1–4 | Tier 3 |
| fluoride-treatment | Fluoride Treatment | 3 | step 1–4 | Tier 3 |
| frenectomy | Frenectomy | 4 | step 1–4 | Tier 3 |
| full-mouth-debridement | Full Mouth Debridement | 3 | step 1–4 | Tier 3 |
| gum-graft | Gum Graft | 5 | step 1–4 | Tier 3 |
| inlay-onlay | Inlay / Onlay | 4 | step 1–4 | Tier 3 |
| night-guard | Night Guard | 3 | step 1–4 | Tier 3 |
| orthodontics | Braces/Aligners | 5 | step 1–4 | Tier 3 |
| periodontal-maintenance | Perio Maintenance | 4 | step 1–4 | Tier 3 |
| prophy | Adult Prophylaxis (D1110) | 5 | step 1–4 + hero | Tier 3 · overlaps `cleaning` |
| pulpotomy | Pulpotomy | 4 | step 1–4 | Tier 3 |
| root-canal-retreatment | RCT Retreatment | 5 | step 1–4 | Tier 3 |
| sedation | Dental Sedation | 4 | step 1–4 | Tier 3 |
| sinus-lift | Sinus Lift | 5 | step 1–4 | Tier 3 |
| sleep-apnea-appliance | Sleep Apnea Appliance | 4 | step 1–4 | Tier 3 |
| space-maintainer | Space Maintainer | 3 | step 1–4 | Tier 3 |
| tmj-treatment | TMJ/TMD Treatment | 4 | step 1–4 | Tier 3 |
| simple-extraction | Simple Extraction | **0** | step 1–4 + hero | Write steps first |
| srp | Scaling and Root Planing | **0** | step 1–4 | Duplicate of scaling-root-planing |
| valplast-education | Valplast Partial | **0** | step 1–5 + hero | Write steps first |
| wisdom-teeth-education | Wisdom Teeth Removal | **0** | step 1–4 + hero | Write steps first |
