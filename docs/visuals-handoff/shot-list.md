# ChairIQ Visual Shot List — Anatomically Accurate Step Images

**Purpose:** hand this document to a 3D artist or certified medical illustrator. It specifies every image needed, one per patient-education step, for the 10 highest-priority procedures. Step titles below are the exact titles patients see in ChairIQ — the image for each step must depict that step and nothing else.

**Prepared:** August 17, 2026 · Priority is based on procedures used in real ChairIQ treatment plans first (exam, root canal, crown, extraction, denture), then the highest-volume everyday procedures.

## Global style + technical requirements (applies to every image)

- **Anatomy must be correct and verifiable:** 32-tooth adult dentition unless a tooth is shown extracted/missing; correct root counts (e.g. molars 2–3 roots, anteriors 1); correct pulp chamber/canal anatomy in cutaways; gingiva, PDL, and bone in correct relation. The reviewing dentist will reject anatomically wrong images.
- **View style:** clean 3D-render or medical-illustration style, single tooth or quadrant cutaway (sagittal cross-section) where the step happens inside the tooth; patient-level, non-frightening. No blood, no graphic tissue.
- **Consistency:** same tooth model, same palette, same lighting across all steps of a procedure (and ideally across all procedures).
- **Format:** JPG or PNG (WebP accepted), 4:3 landscape, minimum 1600×1200 px, sRGB. No text or labels baked into the image (captions are added by the app in English/Spanish).
- **File naming (critical):** deliver files named exactly `<procedure-slug>/step_<n>.<ext>` plus one optional `<procedure-slug>/hero.<ext>` per procedure (a welcoming general image for the top of the page). Example: `cleaning/step_2.jpg`. These names map 1:1 to how ChairIQ stores and serves images.
- **Rights:** work-for-hire or full exclusive license to ChairIQ, including display inside a commercial software product.

---

## 1. `cleaning` — Dental Cleaning (Prophylaxis) — 4 steps

| File | Step title (as patients see it) | Image must show |
|---|---|---|
| step_1 | Oral Examination | Hygienist's mirror + explorer over a healthy full arch; mild plaque visible near gumline; front-on oblique view of mouth open |
| step_2 | Scaling (Tartar Removal) | Ultrasonic scaler tip or hand scaler at the gumline of lower anterior teeth removing visible tartar; slight cutaway showing deposit just below gum margin |
| step_3 | Polishing | Rotating prophy cup with paste on the buccal surface of premolars; smooth, stain-free enamel behind the cup vs. mild stain ahead of it |
| step_4 | Fluoride Treatment | Fluoride varnish being brushed onto upper anterior teeth; thin glossy layer visible on enamel |

## 2. `exam` — Dental Examination — 3 steps

| File | Step title | Image must show |
|---|---|---|
| step_1 | Step 1: Medical history review | Dentist and patient talking at chairside, clipboard/tablet with health-history form; no instruments in mouth |
| step_2 | Step 2: Visual and clinical examination | Dentist with mirror and probe examining full dentition; wide view showing teeth, gums, tongue |
| step_3 | Step 3: Findings discussion and treatment plan | Dentist showing patient an X-ray/intraoral image on a screen, pointing at a tooth |

## 3. `filling` — Dental Filling — 4 steps

| File | Step title | Image must show |
|---|---|---|
| step_1 | Numbing the Area | Topical gel swab at the gumline near a lower molar; syringe out of focus/background (non-threatening) |
| step_2 | Decay Removal | Cutaway of a molar with occlusal caries; handpiece bur removing the dark decayed dentin, healthy dentin/pulp intact below |
| step_3 | Filling Placement | Same cutaway, cleaned cavity being filled in composite layers; curing light tip above the tooth |
| step_4 | Shaping & Polishing | Completed tooth-colored filling being polished; articulating paper marks being checked on the occlusal surface |

## 4. `crown` — Dental Crown — 4 steps *(library slug: dental-crown)*

| File | Step title | Image must show |
|---|---|---|
| step_1 | Step 1: Tooth preparation (first visit) | Molar reduced to a tapered crown prep; bur shaping enamel; correct prep geometry (chamfer margin) |
| step_2 | Step 2: Impression or digital scan | Intraoral scanner wand over the prepped tooth OR putty tray seated on the quadrant; show one, not both |
| step_3 | Step 3: Temporary crown placement | Slightly opaque acrylic temporary crown being seated on the prep |
| step_4 | Step 4: Permanent crown placement (second visit) | Ceramic crown lowered onto the prep, cement layer visible in cutaway; shade matching neighboring teeth |

## 5. `root-canal` — Root Canal Treatment — 5 steps

| File | Step title | Image must show |
|---|---|---|
| step_1 | Step 1: Numbing | Local anesthetic near a lower molar with inflamed pulp shown in cutaway (red, swollen pulp chamber) |
| step_2 | Step 2: Access opening | Cutaway: small occlusal access opening drilled through enamel/dentin into the pulp chamber; 2–3 canals visible below |
| step_3 | Step 3: Cleaning the canals | Endodontic file inside a canal removing infected pulp; correct canal curvature and count for a molar |
| step_4 | Step 4: Sealing | Canals filled with gutta-percha (pink/orange) and sealed access; cutaway showing complete obturation to the apex |
| step_5 | Step 5: Crown placement (second visit) | Crowned, treated tooth in cutaway: gutta-percha in canals, core, crown on top — the "finished" picture |

## 6. `extraction` — Tooth Extraction — 4 steps

| File | Step title | Image must show |
|---|---|---|
| step_1 | Before the visit | Periapical X-ray of the tooth on a screen beside the actual tooth; dentist reviewing |
| step_2 | Numbing | Anesthetic application near the tooth; calm patient-level framing |
| step_3 | Removing the tooth | Forceps gripping the tooth with gentle luxation implied; cutaway showing intact socket walls and neighboring teeth protected; NO blood |
| step_4 | Finishing up | Gauze placed over the closed socket; aftercare card in background |

## 7. `scaling-root-planing` — Scaling and Root Planing (D4341) — 5 steps

| File | Step title | Image must show |
|---|---|---|
| step_1 | Step 1 — Exam and planning | Perio probe in a deepened pocket with mm markings visible; cutaway showing bone loss vs. healthy side |
| step_2 | Step 2 — Numbing (if needed) | Topical/local anesthetic at the gumline of the treated quadrant |
| step_3 | Step 3 — Scaling (cleaning) | Cutaway below the gumline: scaler removing subgingival calculus from the root surface |
| step_4 | Step 4 — Root planing (smoothing) | Same cutaway: curette smoothing the root; smooth root surface vs. rough contrast |
| step_5 | Step 5 — Follow-up and healing | Healed pocket: gum reattached, shallow sulcus, pink stippled gingiva |

## 8. `implant` — Dental Implant — 6 steps

| File | Step title | Image must show |
|---|---|---|
| step_1 | Consultation & Planning | CBCT/X-ray view of edentulous space with implant planning overlay |
| step_2 | Implant Placement | Cutaway: titanium implant being threaded into jawbone at the correct depth/angle; gum flap neatly around it |
| step_3 | Osseointegration (Healing) | Cutaway close-up: bone visibly fused to the implant threads; calendar/clock cue for 3–6 months |
| step_4 | Abutment Placement | Abutment connected to the integrated implant, gum healed around collar |
| step_5 | Crown Placement | Ceramic crown seated on the abutment, matching neighbors; full assembly visible in cutaway |
| step_6 | Follow-Up & Maintenance | Completed implant among natural teeth with floss/brush; healthy gum contour |

## 9. `denture` — Denture — 5 steps

| File | Step title | Image must show |
|---|---|---|
| step_1 | Step 1: Initial impressions and measurements | Impression tray with material seated on an edentulous arch |
| step_2 | Step 2: Bite registration | Wax occlusal rims in place; shade guide being held next to the mouth |
| step_3 | Step 3: Try-in appointment | Wax try-in denture with teeth set in wax, in the patient's mouth or held by dentist |
| step_4 | Step 4: Final denture fitting | Finished acrylic denture being seated; correct fit against the ridge |
| step_5 | Step 5: Follow-up adjustments | Dentist adjusting the denture base with a lab handpiece; pressure-spot indicator paste visible |

## 10. `bridge` — Dental Bridge — 5 steps

| File | Step title | Image must show |
|---|---|---|
| step_1 | Consultation and plan | Gap with one missing tooth between two healthy abutment teeth; X-ray on screen |
| step_2 | Tooth preparation | Both abutment teeth prepped for crowns on either side of the gap |
| step_3 | Impressions and temporary bridge | Scan/impression of the prepped quadrant; temporary bridge nearby |
| step_4 | Lab makes the bridge | Three-unit bridge (crown–pontic–crown) on a lab model, technician's tools |
| step_5 | Final fit and cementing | Bridge cemented over the abutments, pontic resting on the ridge; cutaway of cement layer |

---

## Next tier (same style, when budget allows)
`whitening` (4 steps), `veneer` (5 steps), `srp`/`simple-extraction`/`wisdom-teeth-education`/`valplast-education` (steps not yet written — write content first), then the remaining ~24 library procedures. The full inventory lives in `sourcing-guide.md`.
