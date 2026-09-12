# AI-Powered Customer Support System

This project is a production-oriented scaffold for a responsive customer support web app that accepts user support requests and returns AI-generated replies using Google Gemini (Generative Language). It uses Next.js (App Router + Route Handlers), Supabase (Postgres), and Tailwind CSS.

Key files and structure

- `app/` — Next.js App Router pages and API route handlers
- `components/SupportForm.tsx` — client-side form component (submits to `/api/support`)
- `components/RequestList.tsx`, `components/RequestCard.tsx` — dashboard UI
- `lib/supabaseClient.ts` — Supabase client (browser) and `createAdminSupabase()` factory for server-side operations
- `lib/gemini.ts` — Gemini client wrapper (reads `GEMINI_API_KEY`)
- `db/migrations/001_create_support_requests.sql` — SQL migration
- `.env.local.example` — environment variable examples

Getting started (local)

1. Install dependencies

```bash
npm install
```

2. Create `.env.local` based on `.env.local.example` and fill values:

- `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key (for client)
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (server-side admin; keep secret)
- `GEMINI_API_KEY` — your Google Generative API key

3. Run the app locally

```bash
npm run dev
```

Database migration (Supabase)

1. Open your Supabase project, go to "SQL" → "New query".
2. Copy the contents of `db/migrations/001_create_support_requests.sql` and run it.

This will create the `support_requests` table and a trigger to keep `updated_at` current. The migration also ensures `pgcrypto` is available for `gen_random_uuid()`.

How the AI integration works

- When a user submits the form, the Next.js route handler `/api/support` inserts a `support_requests` row with `status='pending'` using the server-side Supabase client (service role key required).
-- The handler calls Google Gemini via the REST Generative Language API and requests a structured JSON response: `{ response, category, urgency }`. The wrapper will retry once if JSON parsing fails and falls back to storing the raw answer.
- On success, the row is updated with `ai_response`, `category`, `urgency`, and `status='ai_responded'`.

Deployment (GitHub → Vercel)

1. Push this repo to GitHub.
2. In Vercel, import the repo and set environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`).
3. In Supabase, configure the DB and run the migration as above.

Notes and security

- Keep `SUPABASE_SERVICE_ROLE_KEY` and `GEMINI_API_KEY` secret — set them as server environment variables in Vercel (do not expose them to the browser).
- The app uses Next.js Route Handlers (serverless functions) for AI calls to simplify deployment on Vercel and avoid running a separate server. If you expect very high AI throughput with separate scaling needs, consider extracting a dedicated backend service.

Architecture summary

- Frontend: Next.js App Router + TypeScript, Tailwind CSS for responsive UI.
- Backend: Next.js Route Handlers (serverless) using `createAdminSupabase()` for server-side DB writes and Gemini REST API calls for AI.
- Database: Supabase (Postgres) with a single `support_requests` table that stores messages, AI responses, category, urgency, and status.

Why Route Handlers?

- Simpler deployment to Vercel (no separate server required).
- Co-located code with the frontend reduces complexity for smaller teams.

Next steps (optional)

- Add background job retry for failed AI calls (e.g., using Supabase Functions or a cron worker).
- Add authentication and an agent UI for staff to reply manually.

If you want, I can now:

- Add filters by category or an agent inbox view.
- Wire up email notifications when AI responds.

