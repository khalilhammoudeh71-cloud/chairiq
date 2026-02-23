# ChairIQ - Dental Treatment Planning App

## Overview
ChairIQ is a React-based dental treatment planning SPA for dentists and patients. It provides treatment plan creation, procedure education, patient plan sharing, and admin analytics.

## Tech Stack
- React 18 + Vite (port 5000)
- Redux Toolkit for state management
- TailwindCSS for styling
- React Router v6 for navigation
- Supabase for authentication and database
- D3.js/Recharts for data visualization
- Framer Motion for animations
- Google Gemini AI for content generation

## Project Structure
- `chairiq/` - Main app directory
  - `src/` - Source code
    - `pages/` - Page components (each in own directory)
    - `components/` - Shared components (AppIcon, ErrorBoundary, ProtectedRoute, etc.)
    - `contexts/` - AuthContext, ThemeContext
    - `services/` - authService, geminiClient, aiPersonalizationService, ttsService
    - `lib/` - supabase.js client
    - `data/` - Static data files
    - `styles/` - globals.css, index.css, tailwind.css
  - `public/assets/images/` - Static images

## Environment Variables Required
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_GEMINI_API_KEY` - Google Gemini API key
- `AI_INTEGRATIONS_OPENAI_BASE_URL` - Auto-set by Replit AI Integration
- `AI_INTEGRATIONS_OPENAI_API_KEY` - Auto-set by Replit AI Integration (dummy key)

## OpenAI Integration
- Uses Replit AI Integrations (no separate API key needed, billed to Replit credits)
- Frontend accesses OpenAI via Vite proxy: `/openai-proxy` -> `http://localhost:1106/modelfarm/openai`
- Client configured in `chairiq/src/services/openaiClient.js`
- Used by: dentalChatService, ttsService, aiContentGenerationService, procedureEducationGeneratorService, visualDescriptionService, aiPersonalizationService, procedureAnalysisService, learningJourneySummaryService

## Recent Changes (2026-02-23)
- Fixed treatment-plan-landing page missing all text content (summary, why, steps, aftercare, whatIfNot)
  - Root cause: getEnrichedPatientPlan returned fields like `whatThisIs`, `whyRecommendedBullets` but treatment-plan-landing expected language-suffixed fields like `summaryEn`, `whyEn`, `stepsEn`
  - Fix: patientPlanService now includes both formats in the library object so both patient-plan-view and treatment-plan-landing pages render correctly
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
