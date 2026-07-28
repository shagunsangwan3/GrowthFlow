# GrowthFlow

An AI-powered Growth Operating Platform that helps businesses plan, launch, optimize, automate, and scale digital marketing campaigns.

## Tech Stack

- **Framework:** Next.js 13 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui (Radix primitives)
- **Forms:** react-hook-form + zod
- **Charts:** recharts
- **Backend (planned):** Supabase (`@supabase/supabase-js` is installed; not yet wired up — the app currently runs on mock data)
- **Deployment:** Netlify (`netlify.toml` configured)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

Other scripts:

```bash
npm run build      # production build
npm run start      # run production build
npm run lint       # lint
npm run typecheck  # TypeScript check with no emit
```

## Environment Variables

Copy `.env.example` to `.env` and fill in the values before wiring up Supabase:

```bash
cp .env.example .env
```

## Project Structure

```
app/                    Next.js App Router routes (one folder per page/section)
components/
  ui/                   shadcn/ui generated primitives — do not hand-edit, regenerate via CLI
  shared/               Custom, reusable components shared across routes
layouts/
  dashboard-layout/      Dashboard shell, sidebar, topbar, command palette, floating actions
config/                 App-wide config and navigation definitions
hooks/                  Shared React hooks
lib/                    Framework/vendor-level helpers (e.g. `cn()` class-merge utility)
utils/                  App-specific formatting/domain helpers
services/               Data layer — currently mock data, will hold real API/service calls
types/                  Shared TypeScript types
public/                 Static assets (favicon, robots.txt, OG images)
```

## Notes

- All data is currently sourced from `services/mock-data.ts`. Supabase integration is planned but not yet implemented.
- `components/ui` is shadcn/ui-managed — prefer regenerating via the shadcn CLI over manual edits to keep it in sync with upstream.
