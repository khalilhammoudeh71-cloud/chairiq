# Remaining share controls — corrected September 8, 2026

Production deployment dpl_7nd2fg9pLdg3DEohHKuUtZNxzBuy is READY at https://chairiq-delta.vercel.app . Release snapshot97fa64d9c5e0a5b5128f44724dae830ef62ca35f. Original repository edits remain uncommitted/unpushed.

Analytics Copy Link and email sharing now resolve the current plan reference through owner-restricted reads and create a fresh24hour bearer before copying or delivering. They no longer distribute revoked/non-expiring public_token references. Missing or inaccessible plans fail closed. Pending Actions Take Action was previously unwired; it now opens a fresh owner-authorized link and displays errors. SMS resend already used fresh tokens and was unchanged.

All94 tests passed, production build passed, and independent bounded review found no blocking issue. Helper tests verify exact plan/patient mapping and refusal to mint a link for inaccessible plans. Email ordering and error flow were reviewed in source; neither live email nor SMS send was invoked. No live pending-action record exists, so that control was not exercised against live data.

Live Copy verification: clicked Analytics Copy for the existing sample. Mac clipboard contained a chairiq-delta.vercel.app/p/ URL with a48character bearer; database lifetime was24hours. That exact copied link opened the matching five-procedure sample plan in separate Chrome without a ChairIQ login, ending at /p. This was separate-browser testing, not incognito. Browser errors on the analytics page: none. The IAB clipboard abstraction returned empty, so the actual Mac clipboard was used to verify this copy. The copied sample link is intentionally left on the clipboard and expires normally.

No SMS/email, DNS/Twilio changes, or treatment-content changes occurred. Actual message delivery remains untested and requires explicit recipient and sending authorization.
