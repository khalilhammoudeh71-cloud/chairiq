# ChairIQ - Dental Treatment Planning App

## Overview
ChairIQ is a React-based Single Page Application (SPA) designed for dental professionals and their patients. It facilitates the creation of comprehensive dental treatment plans, educates patients on procedures, enables secure sharing of plans, and provides administrative analytics. The project aims to enhance patient engagement and streamline the treatment planning process through intuitive design and AI-powered content generation.

## User Preferences
I prefer iterative development with a focus on understanding the current architecture before proposing major changes. Please ask before making any significant modifications to existing code or introducing new dependencies. I value clear, concise explanations and prefer to review changes in smaller, manageable pull requests or development cycles.

## System Architecture
ChairIQ utilizes a React 18 frontend with Vite, an Express backend, and Redux Toolkit for state management. Styling is handled with TailwindCSS, and navigation with React Router v6. Supabase provides authentication and database services. Data visualization is achieved with D3.js/Recharts, and animations with Framer Motion. Google Gemini AI and OpenAI are integrated for content generation and other AI services, while Nodemailer handles email delivery.

The project structure separates frontend concerns into `src/` (pages, components, contexts, services, lib, data, styles) and backend logic into `server/` (Express server, mailer). UI/UX decisions prioritize a premium feel with a dark theme, consistent design tokens for colors and spacing, and accessible focus states. Key features like patient plan sharing use secure, expiring links, and the system includes admin dashboards for analytics and visual content management. Error states and empty states are designed for clarity and user guidance.

## ADA/CDT Procedure Code Coverage
The system supports 22 canonical procedure types with comprehensive bilingual (EN/ES) educational content:
- **Existing (with Gold Standard content):** crown, root-canal, extraction, srp, filling, bridge, dental-crown, scaling-root-planing, simple-extraction, wisdom-teeth-education, valplast-education
- **Expanded (March 2025):** implant, cleaning, veneer, whitening, orthodontics, night-guard, bone-graft, sinus-lift, dental-sealant, fluoride-treatment, inlay-onlay, core-buildup, gum-graft, sedation, exam, denture

**Data architecture:** ADA codes → `canonical_slug` → `procedure_library` (educational content). Multiple ADA codes share one canonical slug. ~200+ ADA codes mapped across all categories. Three layers of code resolution: (1) `ada_codes` Supabase table, (2) `procedureNormalization.js` ADA_CODE_FAMILIES, (3) `adaCodeMappings.js` granular mappings. All three layers must stay consistent.

**Migration files for expansion:**
- `20260305_comprehensive_ada_codes.sql` — canonical procedures + ADA code mappings
- `20260305_procedure_library_batch1.sql` — implant, cleaning, veneer, whitening, orthodontics content
- `20260305_procedure_library_batch2.sql` — night-guard, bone-graft, sinus-lift, dental-sealant, fluoride-treatment content
- `20260305_procedure_library_batch3.sql` — inlay-onlay, core-buildup, gum-graft content
- `20260305_procedure_library_exam_denture.sql` — exam and denture content

## External Dependencies
- **Supabase**: For user authentication, database management (PostgreSQL), and storage (for treatment images).
- **Google Gemini AI**: Used for content generation services.
- **OpenAI**: Integrated via Replit AI Integrations for various AI functionalities including chat, TTS, content generation, and personalization.
- **Nodemailer**: For sending emails via SMTP (configured with Zoho SMTP).
- **D3.js/Recharts**: For data visualization on analytics dashboards.
- **Framer Motion**: For declarative animations throughout the application.
- **Vite**: As the build tool for the React frontend.
- **Express**: As the backend server for API routes and middleware.
- **Redux Toolkit**: For state management.
- **TailwindCSS**: For utility-first CSS styling.
- **React Router v6**: For client-side routing.