---
name: Patient-link analytics privacy
description: Privacy constraints for patient share links when published-app analytics is enabled.
---

Patient share tokens must never remain in the document URL when the SPA or published-app analytics tracker loads. Tokenized links must be exchanged server-side and redirected to a clean route before serving HTML; patient custom events must use a fixed route alias and schema-approved aggregate properties.

**Why:** Published analytics records automatic pageviews as well as custom events. Sanitizing custom-event properties alone is insufficient, and URL fragments are not a safe hiding place because the tracker can collect hashes.

**How to apply:** Preserve the pre-HTML redirect/handoff when changing patient-link routing or delivery. Keep token-bearing links out of client-side navigation, and verify both automatic pageviews and custom payload metadata after analytics changes.