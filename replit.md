# ChairIQ - Dental Treatment Planning App

## Overview
ChairIQ is a React-based Single Page Application (SPA) designed for dental professionals and their patients. It facilitates the creation of comprehensive dental treatment plans, educates patients on procedures, enables secure sharing of plans, and provides administrative analytics. The project aims to enhance patient engagement and streamline the treatment planning process through intuitive design and AI-powered content generation.

## User Preferences
I prefer iterative development with a focus on understanding the current architecture before proposing major changes. Please ask before making any significant modifications to existing code or introducing new dependencies. I value clear, concise explanations and prefer to review changes in smaller, manageable pull requests or development cycles.

## System Architecture
ChairIQ utilizes a React 18 frontend with Vite, an Express backend, and Redux Toolkit for state management. Styling is handled with TailwindCSS, and navigation with React Router v6. Supabase provides authentication and database services. Data visualization is achieved with D3.js/Recharts, and animations with Framer Motion. Google Gemini AI and OpenAI are integrated for content generation and other AI services, while Nodemailer handles email delivery.

The project structure separates frontend concerns into `src/` (pages, components, contexts, services, lib, data, styles) and backend logic into `server/` (Express server, mailer). UI/UX decisions prioritize a premium feel with a dark theme, consistent design tokens for colors and spacing, and accessible focus states. Key features like patient plan sharing use secure, expiring links, and the system includes admin dashboards for analytics and visual content management. Error states and empty states are designed for clarity and user guidance.

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