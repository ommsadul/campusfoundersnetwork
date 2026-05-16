# Campus Founders Network

An exclusive directory for ambitious university founders to find co-founders, share ideas, and build the next big thing on campus.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org) (App Router)
- **Authentication:** [Supabase Auth](https://supabase.com/auth)
- **Database:** [Supabase / PostgreSQL](https://supabase.com/database)
- **Styling:** Tailwind CSS (custom "Academic Meets Silicon Valley" aesthetic)
- **Typography:** Instrument Serif, Plus Jakarta Sans, DM Mono

## Getting Started

### 1. Prerequisites

- Node.js installed
- A Supabase project

### 2. Environment Variables

Create a `.env.local` file in the root directory and add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Installation

```bash
npm ci
```

### 4. Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Quality Commands

```bash
npm run lint
npm run typecheck
npm run check
npm run build
```

## Project Structure

- `src/app`: application routes and pages
- `src/app/(app)`: authenticated application routes
- `src/components`: reusable UI components
- `src/lib/supabase`: Supabase clients and auth proxy logic
- `src/types`: shared TypeScript models
- `docs/security-checklist.md`: RLS and DB hardening checklist

## Security Notes

- Auth/session gatekeeping is handled in `src/proxy.ts` for protected routes.
- RLS policies must be configured in Supabase for `profiles` and `connections`.
- See `docs/security-checklist.md` for required policy and indexing expectations.
