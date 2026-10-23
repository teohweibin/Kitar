# Kitar

**Recycling, verified.** A concept prototype of a household recycling module for Sime Darby Property (SDP) townships, built for a pitch.

Residents learn how to sort (search or photo scan), drop recyclables in a bag that carries their unit's QR code, and a collector weighs and scans each bag so every kilogram is recorded to that unit. Residents earn points and townships compete on a monthly leaderboard; SDP's sustainability team sees verified kilograms on a dashboard.

> Concept prototype. Not affiliated with or endorsed by Sime Darby Property. All townships, units, people and numbers are sample data.

## Roles

| Role | What they do |
|---|---|
| Resident | Sorting guide (EN/BM), photo scan (one item or a pile), QR bag, history, points, township leaderboard |
| Collector | Scan a bag's QR (or type the unit code), pick a category, enter the weight, confirm, save |
| Admin | Sustainability dashboard: kg by month, township and category, participation, latest collections |

## Stack

Vite + React PWA · Supabase (Postgres, Auth, Row Level Security) · MobileCLIP via transformers.js for the in-browser photo scan · Recharts · Vercel hosting.

## Run locally

Requires Node 20.19+ or 22.12+.

```bash
npm install
cp .env.example .env.local   # then fill in the two values below
npm run dev                  # http://localhost:5173
```

`.env.local` (never committed):

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Use the Project URL and the **anon public** key from Supabase → Project Settings → API. Never put the `service_role` key in this project.



## Set up the database

In Supabase → SQL Editor, run these in order:

1. `supabase/migrations/0001_schema.sql`
2. `supabase/migrations/0002_rls.sql`
3. `supabase/migrations/0003_views_functions.sql`
4. Create four users in Authentication → Users (tick "Auto Confirm User"): `resident1@demo.test`, `resident2@demo.test`, `collector1@demo.test`, `admin@demo.test`. Choose the passwords yourself; they are not stored in this repo.
5. `supabase/seed.sql`
6. `supabase/updates/0004_guide_wording.sql`
7. `supabase/updates/0005_reseed_sample_collections.sql` (only needed for projects seeded before the seed fix; harmless otherwise, it replaces the sample collections)
8. Authentication → Sign In / Providers → turn on **Allow anonymous sign-ins**, then run `supabase/updates/0006_demo_sessions.sql`. This powers the password-free "Try as Resident / Collector / Admin" buttons on the login page.

### Password-free demo

The "Try as …" buttons sign the visitor in anonymously and give them a demo role through `start_demo_session()`: a demo resident shares unit SAMPLE-A-0101, a demo collector can record collections, a demo admin sees the dashboard (read-only). Row Level Security still applies. Each tap creates an anonymous user in Supabase; Supabase rate-limits anonymous sign-ins per IP. To switch the demo off after the pitch, turn anonymous sign-ins off again.

## Photo scan labels

The scanner recognises the items described in `src/data/scanLabels.json`. After editing that file, regenerate the text embeddings:

```bash
npm run build:scan-embeddings
```

