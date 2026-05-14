# Campus Founders Network

An exclusive directory for ambitious university founders to find co-founders, share ideas, and build the next big thing on campus.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org) (App Router)
- **Authentication:** [Supabase Auth](https://supabase.com/auth)
- **Database:** [Supabase / PostgreSQL](https://supabase.com/database)
- **Styling:** Tailwind CSS (Custom "Academic Meets Silicon Valley" Aesthetic)
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
npm install
```

### 4. Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

- `src/app`: Application routes and pages
- `src/app/(app)`: Authenticated application routes (Dashboard, etc.)
- `src/components`: Reusable UI components
- `src/lib/supabase`: Supabase clients and middleware
- `public`: Static assets

## Design Philosophy

The project follows a unique "Academic meets Silicon Valley" aesthetic:
- **High Contrast:** Parchment backgrounds with deep ink blue text.
- **Bold Accents:** Vibrant orange highlights.
- **Brutalist Elements:** Sharp edges, solid shadows, and monochromatic technical details.
- **Editorial Typography:** Elegant serifs for storytelling mixed with technical monospaced fonts for data.
