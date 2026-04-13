# Swift Designz Admin Portal

## Tech Stack
- Next.js 15 (App Router) + TypeScript + Tailwind CSS 4
- Supabase (PostgreSQL + Auth + RLS + Storage)
- Lucide React for icons
- Framer Motion (light use)
- @react-pdf/renderer for invoice PDFs

## Build
- `npm run dev` — runs on localhost:3000
- `npm run build` — production build

## Database
- Supabase project ID: nxuvzdrqgrmureejigpf
- Schema SQL: supabase/schema.sql
- Money values stored as integer cents (R2,500 = 250000)
- All enums: see src/types/database.ts

## Auth
- Supabase Auth (email/password)
- Middleware redirects unauthenticated users to /login
- Roles: admin (full CRUD) and viewer (read-only)
- Profile auto-created on signup via database trigger

## Brand
- Colors: #30B0B0 (teal), #303030 (dark), #101010 (background)
- Dark theme only — professional admin aesthetic
- Glassmorphism cards with teal glow accents
- No emojis, no faith references, no boilerplate

## Domain
- admin.swiftdesignz.co.za (Netlify)
- Main site: swiftdesignz.co.za (separate repo)

## API
- POST /api/leads — public endpoint for main site to submit leads

