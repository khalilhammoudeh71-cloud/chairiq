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

## Recent Changes (2026-02-08)
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
