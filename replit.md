# ChairIQ - Dental Treatment Planning App

## Overview
ChairIQ is a React-based dental treatment planning SPA for dentists and patients. It provides treatment plan creation, procedure education, patient plan sharing, and admin analytics.

## Tech Stack
- React 18 + Vite (port 5000) with Express backend (middleware mode)
- Redux Toolkit for state management
- TailwindCSS for styling
- React Router v6 for navigation
- Supabase for authentication and database
- D3.js/Recharts for data visualization
- Framer Motion for animations
- Google Gemini AI for content generation
- Nodemailer for email delivery (Zoho SMTP)

## Project Structure
- `chairiq/` - Main app directory
  - `server/` - Express backend
    - `index.js` - Express server with Vite middleware mode + API routes
    - `mailer.js` - Nodemailer SMTP transport + email templates
  - `src/` - Source code
    - `pages/` - Page components (each in own directory)
    - `components/` - Shared components (AppIcon, ErrorBoundary, ProtectedRoute, etc.)
    - `contexts/` - AuthContext, ThemeContext
    - `services/` - authService, geminiClient, aiPersonalizationService, ttsService, emailService
    - `lib/` - supabase.js client
    - `data/` - Static data files
    - `styles/` - globals.css, index.css, tailwind.css
  - `public/assets/images/` - Static images

## Environment Variables Required
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SMTP_HOST` - SMTP server hostname (e.g., smtp.zoho.com)
- `SMTP_PORT` - SMTP port (465 for SSL, 587 for STARTTLS)
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password
- `FROM_EMAIL` - Sender email address
- `VITE_GEMINI_API_KEY` - Google Gemini API key
- `AI_INTEGRATIONS_OPENAI_BASE_URL` - Auto-set by Replit AI Integration
- `AI_INTEGRATIONS_OPENAI_API_KEY` - Auto-set by Replit AI Integration (dummy key)

## OpenAI Integration
- Uses Replit AI Integrations (no separate API key needed, billed to Replit credits)
- Frontend accesses OpenAI via Vite proxy: `/openai-proxy` -> `http://localhost:1106/modelfarm/openai`
- Client configured in `chairiq/src/services/openaiClient.js`
- Used by: dentalChatService, ttsService, aiContentGenerationService, procedureEducationGeneratorService, visualDescriptionService, aiPersonalizationService, procedureAnalysisService, learningJourneySummaryService

## Recent Changes (2026-03-04) — Email Delivery
- Added Express backend server (chairiq/server/index.js) with Vite middleware mode
  - Express handles API routes, Vite handles frontend in middleware mode
  - `npm run start` now runs Express server instead of raw Vite
  - package.json updated: `"type": "module"`, start script → `node server/index.js`
  - postcss.config.js → postcss.config.cjs, tailwind.config.js → tailwind.config.cjs (CommonJS compat)
- Added Nodemailer SMTP transport (chairiq/server/mailer.js)
  - Zoho SMTP via env vars: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL
  - Port 465 = secure:true, port 587 = STARTTLS
  - Professional HTML email template with dark header, CTA button, fallback plain text
- API endpoints:
  - POST /api/notifications/email — sends treatment plan link email (to, planLink, patientName)
  - POST /api/test-email — sends test email to verify SMTP config
- Frontend emailService.js — client for both endpoints
- Create-patient-plan page: Email/SMS radio selector
  - Email selected by default; shows email input + Send Email button
  - SMS shows "coming soon (pending carrier approval)" message
  - Removed old "Send SMS to Patient" standalone button

## Previous Changes (2026-03-04)
- Implemented secure expiring share links for patient treatment plans
  - New `plan_share_links` table with token, plan_id, patient_id, expires_at, view_count
  - Share tokens are 48-char cryptographically random strings (via Web Crypto API)
  - Links expire after 24 hours from creation
  - PatientPlanView validates share tokens: shows "Link Invalid" or "Link Expired" states
  - Falls back to legacy public_token for backward compatibility with existing links
  - View count incremented atomically via Supabase RPC function (SECURITY DEFINER)
  - SMS messages made generic — no patient names or practice names included
  - SMS now includes "Reply STOP to opt out." per compliance
  - shareLinkService.js handles token creation, validation, increment, and reuse
  - patientPlanService refactored: shared `_enrichPlanData()` method for both token types
  - getEnrichedPatientPlanById() added for plan ID-based lookups (used by share links)
- Added SMS Consent page at /sms-consent (public, Twilio compliance)
- Updated root canal hero image to new 4-stage procedure illustration

## Previous Changes (2026-02-23)
- Fixed treatment-plan-landing page missing all text content (summary, why, steps, aftercare, whatIfNot)
  - Root cause: getEnrichedPatientPlan returned fields like `whatThisIs`, `whyRecommendedBullets` but treatment-plan-landing expected language-suffixed fields like `summaryEn`, `whyEn`, `stepsEn`
  - Fix: patientPlanService now includes both formats in the library object so both patient-plan-view and treatment-plan-landing pages render correctly
- Fixed visuals mismatched with procedure steps (e.g., root canal numbing step showing access opening image)
  - Root cause: DB visuals keyed by step_1/step_2 matched static data (no numbing step), but AI education content adds "Numbing" as step 1, shifting all positions
  - Fix: Changed from position-based to title-based visual matching — uses static procedures.js titles to map DB visuals to education steps by content similarity
- Removed generic procedure terms from AddProcedureDrawer — ADA codes only + manual entry
- Fixed copy-link clipboard function to properly handle async API with fallback
- Added inline "Link copied!" notification near copy button
- Added custom image upload panel to Visual Sync page — dentists can select a procedure + step and upload their own images directly
- Visual sync now auto-creates missing entries in canonical_procedures table before syncing visuals (fixes foreign key errors)
- Switched procedure_visuals DB operations to upsert for reliability
- Integrated Supabase storage bucket "treatment-images" for procedure visuals
- Created storageService.js with upload/download/list/URL resolution for treatment images
- Created admin visual sync page (/admin/visual-sync) for bulk-uploading procedure images and populating procedure_visuals table
- Updated patientPlanService to fetch and resolve visual URLs (heroKey + stepKeys) from procedure_visuals
- Updated ImageManager to upload directly to Supabase storage when procedure slug is provided
- Fixed debug panels across all pages to strictly gate behind ?debug=1 query parameter
- Added Visual Sync shortcut to admin dashboard Quick Actions

## Previous Changes (2026-02-09)
- Redesigned landing page hero: dark premium background (#0c0e14) with animated product demo
- Hero shows treatment plan cards and phone SMS mockup with gentle floating animations
- Dark header matching hero, high-contrast white text, dual CTA buttons
- Demo elements hidden on mobile (<640px), animations respect prefers-reduced-motion
- HeroAnimation component renders CSS-only animated product demo (no JS, no video)
- COMPLETE design token migration: 0 hardcoded Tailwind color classes remain across 71+ JSX files
- Migrated ~750+ hardcoded color instances to design tokens (bg-bg0/bg1/bg2/bg3, text-t1/t2/t3, border-bd, accent, success, danger, warning)
- 0 dark: classes, 0 focus:ring-* patterns, 0 shadow-xl/2xl, 0 animate-bounce, 0 hover:scale
- Standardized all focus states to focus-visible:outline with accent token
- Removed all gradient backgrounds, decorative animations, aggressive shadow transitions
- Button hover: brightness-110 (not color swap), focus: outline-accent/30 (not ring glow)
- Overlays standardized: bg-[var(--overlay)] replacing bg-black bg-opacity-*
- CSS variables in tailwind.css as single source of truth
- Light mode: white #ffffff, text #1a1f36, accent #2563eb
- Dark mode: charcoal #111215, text #e3e4e8, accent #6b8aee
- Added Gemini AI integration via Vite proxy (/gemini-proxy)
- Connected Twilio SMS (credentials stored as Replit secrets + Supabase Edge Function secrets)

## Previous Changes (2026-02-08)
- Connected OpenAI via Replit AI Integrations with Vite proxy
- Fixed Vite config: port changed from 4028 to 5000, allowedHosts set to true for Replit
- Fixed unprotected admin route `/admin/procedure-library` - now wrapped in ProtectedRoute
- Fixed duplicate login route - `/dentist-login-authentication` now redirects to `/login`
- Fixed Supabase client crash when env vars missing - now returns null with graceful handling
- Fixed AuthContext infinite loading when Supabase is unavailable
- Added .gitignore file

## Key Architecture Decisions
- Supabase client returns null when env vars are missing (graceful degradation)
- AuthContext handles null Supabase by immediately setting loading=false
- ProtectedRoute redirects unauthenticated users to /login
- Theme system uses CSS custom properties with dark mode support
