# ChairIQ - Dental Treatment Planning App

## Overview
ChairIQ is a React-based Single Page Application (SPA) designed for dental professionals and their patients. It facilitates the creation of comprehensive dental treatment plans, educates patients on procedures, enables secure sharing of plans, and provides administrative analytics. The project aims to enhance patient engagement and streamline the treatment planning process through intuitive design and AI-powered content generation.

## User Preferences
I prefer iterative development with a focus on understanding the current architecture before proposing major changes. Please ask before making any significant modifications to existing code or introducing new dependencies. I value clear, concise explanations and prefer to review changes in smaller, manageable pull requests or development cycles.

## System Architecture
ChairIQ utilizes a React 18 frontend with Vite, an Express backend, and Redux Toolkit for state management. Styling is handled with TailwindCSS, and navigation with React Router v6. Supabase provides authentication and database services. Data visualization is achieved with D3.js/Recharts, and animations with Framer Motion. Google Gemini AI and OpenAI are integrated for content generation and other AI services, while Nodemailer handles email delivery.

The project structure separates frontend concerns into `src/` (pages, components, contexts, services, lib, data, styles) and backend logic into `server/` (Express server, mailer). UI/UX decisions prioritize a premium feel with a dark theme, consistent design tokens for colors and spacing, and accessible focus states. Key features like patient plan sharing use secure, expiring links, and the system includes admin dashboards for analytics and visual content management. Error states and empty states are designed for clarity and user guidance.

## Admin UI
- **Procedure Library Management** (`/procedure-library-management`): Lists all procedures with search, category filter, status filter, content completeness indicators, bilingual badges, publish toggle, duplicate, and delete with confirmation.
- **Markdown Content Editor** (`/markdown-content-editor`): Full bilingual (EN/ES) editor for all procedure_library fields — slug, category, title, summary, why, what_if_not, steps (with image keys), anesthesia, risks, aftercare, FAQs, time/visit estimates. Supports create and edit modes, markdown preview, save draft, and publish. Connected via DentistNavigation "Content Library" link.

## ADA/CDT Procedure Code Coverage
The system supports 34+ canonical procedure types with comprehensive bilingual (EN/ES) educational content:
- **Core procedures:** crown, root-canal, extraction, srp, filling, bridge, dental-crown, scaling-root-planing, simple-extraction, wisdom-teeth-education, valplast-education
- **Expanded:** implant, cleaning, veneer, whitening, orthodontics, night-guard, bone-graft, sinus-lift, dental-sealant, fluoride-treatment, inlay-onlay, core-buildup, gum-graft, sedation, exam, denture
- **Gap fills:** filling (Gold Standard upgrade), sedation, denture-reline, root-canal-retreatment, full-mouth-debridement, periodontal-maintenance
- **New procedures:** pulpotomy, apicoectomy, frenectomy, crown-lengthening, space-maintainer, tmj-treatment, sleep-apnea-appliance, emergency-palliative

**Data architecture:** ADA codes → `canonical_slug` → `procedure_library` (educational content). Multiple ADA codes share one canonical slug. ~250+ ADA codes mapped across all categories. Three layers of code resolution: (1) `ada_codes` Supabase table, (2) `procedureNormalization.js` ADA_CODE_FAMILIES, (3) `adaCodeMappings.js` granular mappings. All three layers must stay consistent.

**Critical mapping rules:**
- D3346-D3348 → `root-canal-retreatment` (NOT root-canal)
- D4355 → `full-mouth-debridement` (NOT srp)
- D4910 → `periodontal-maintenance` (NOT srp)
- D7951/D7952 → `sinus-lift`; D7950/D7953/D4263/D4264 → `bone-graft`
- D1355 → `fluoride-treatment`; D9210-D9248 → `sedation`

**Migration files for expansion:**
- `20260305_comprehensive_ada_codes.sql` — canonical procedures + ADA code mappings (initial 14)
- `20260305_expanded_ada_codes.sql` — 8 additional canonical procedures + ADA code mappings
- `20260305_procedure_library_batch1.sql` — implant, cleaning, veneer, whitening, orthodontics content
- `20260305_procedure_library_batch2.sql` — night-guard, bone-graft, sinus-lift, dental-sealant, fluoride-treatment content
- `20260305_procedure_library_batch3.sql` — inlay-onlay, core-buildup, gum-graft content
- `20260305_procedure_library_exam_denture.sql` — exam and denture content
- `20260305_procedure_library_gap_fills.sql` — filling, sedation, denture-reline, root-canal-retreatment, full-mouth-debridement, periodontal-maintenance content
- `20260305_procedure_library_batch4.sql` — pulpotomy, apicoectomy, frenectomy, crown-lengthening content
- `20260305_procedure_library_batch5.sql` — space-maintainer, tmj-treatment, sleep-apnea-appliance, emergency-palliative content

## iOS App (chairiq-ios/)
A native Swift/SwiftUI iOS port of ChairIQ lives in `chairiq-ios/`. It is a standalone Swift Package (Package.swift) targeting iOS 17+, ready to open in Xcode.

**Architecture:**
- **Models/** — Codable structs matching the Supabase schema (Patient, TreatmentPlan, PlanProcedure, ProcedureLibraryItem, ProcedureVisual, ADACode, UserProfile, SMSMessage) with snake_case CodingKeys
- **Services/** — Singleton service layer: SupabaseManager (client), AuthService, PatientPlanService, ProcedureLibraryService, SMSService, EmailService, AIContentGenerationService, AIPersonalizationService, TTSService
- **ViewModels/** — @Observable classes: AuthViewModel, PatientPlanViewModel, AdminDashboardViewModel, CreatePlanViewModel, ProcedureLibraryViewModel, AIContentViewModel
- **Views/** — SwiftUI views organized by role:
  - Auth/ — LoginView, SignUpView
  - Patient/ — PatientPlanView, TreatmentPlanLandingView, StepByStepTreatmentView, ProcedureDetailView, TreatmentCompletionView
  - Admin/ — AdminDashboardView, AdminTabView, AnalyticsDashboardView, CreatePatientPlanView, ProcedureLibraryView, AIContentGenerationView
  - Components/ — LoadingSpinner, PriorityBadge, LanguageToggle, ProcedureCard, StatCard, ImageViewer, SearchBar
- **Utils/** — Theme.swift (color palette, typography, spacing matching web app's Tailwind tokens)

**Dependencies:** Supabase Swift SDK (2.0+), Kingfisher (7.10+)

**Configuration:** Set SUPABASE_URL and SUPABASE_ANON_KEY in Info.plist or environment. Optional: OPENAI_API_KEY, GEMINI_API_KEY, API_BASE_URL.

**Deep Links:** Handles `chairiq://chairiq/p/{publicToken}` URLs to open patient plan views directly.

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
