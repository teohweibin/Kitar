# Work Card 02: Supabase Schema, RLS and Seed Data

Use the strongest available model for this card.

## Goal

The Supabase database has all six tables with RLS, the points view and leaderboard function, fictional seed data and three demo accounts; the app connects with the anon key and lists townships.

## Inputs

- `architecture.md` → Data Model, Row Level Security, Computed Values, Seed / Sample Data
- `build-blueprint.md` → Data / Security Rules

## Files likely touched

`supabase/migrations/0001_schema.sql`, `supabase/migrations/0002_rls.sql`, `supabase/migrations/0003_views_functions.sql`, `supabase/seed.sql`, `src/lib/supabase.js`, `src/lib/api.js`, a temporary test component, `package.json`

## Instructions for the coding agent

1. `npm install @supabase/supabase-js`.
2. `0001_schema.sql`: create `townships`, `units`, `profiles`, `waste_categories`, `waste_items`, `collections` exactly as in `architecture.md` → Data Model, with foreign keys, `unique` on `units.unit_code` and `units.qr_token`, `check (role in ('resident','collector','admin'))`, `check (weight_kg > 0 and weight_kg <= 50)`, and indexes on `collections(unit_id)`, `collections(collected_at)`.
3. `0002_rls.sql`:
   - `public.my_role()` and `public.my_unit()`: `language sql stable security definer set search_path = public`, reading `profiles` for `auth.uid()`.
   - `alter table … enable row level security` on all six tables.
   - Policies exactly as in `architecture.md` → Row Level Security. No update or delete policies on `collections`.
4. `0003_views_functions.sql`:
   - `unit_points` view with `with (security_invoker = true)`: per unit, total kg and points (`sum(weight_kg * points_per_kg)`).
   - `get_township_leaderboard(p_month date)`: `security definer`, `set search_path = public`, returns township id, name, total kg, participating units, total units, kg per participating unit for that calendar month, ordered by kg per participating unit. Grant execute to `authenticated`.
5. `seed.sql`:
   - 3 townships: "Taman Sample Hijau", "Taman Sample Damai", "Taman Sample Indah", `is_sample = true`.
   - 10 units each, codes `SAMPLE-A-0101` … (A, B, C per township), `qr_token` from `gen_random_uuid()::text`.
   - 8 categories with EN/BM names, bin colour, sample `points_per_kg` (for example 10). Leave `co2e_kg_per_kg` and `co2e_source` null; the learner fills them only with a cited source.
   - About 30 `waste_items` in English and Malay (for example drink carton / kotak air, PET bottle / botol plastik, aluminium can / tin aluminium, newspaper / surat khabar, polystyrene box / bekas polistirena (not recyclable here), used cooking oil / minyak masak terpakai), with `prep_steps`, `keywords`, and `model_labels` holding MobileNet class names that should map to each item (for example `water bottle`, `pop bottle`, `beer bottle`, `carton`, `can`… use only real ImageNet class names).
   - Profiles for the demo users, linked by email from `auth.users`: `resident1@demo.test` → unit `SAMPLE-A-0101`, `resident2@demo.test` → `SAMPLE-B-0101`, `collector1@demo.test`, `admin@demo.test`.
   - About 3 months of sample `collections` spread across units and categories, with `collector_id` = the demo collector.
6. `src/lib/supabase.js`: `createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)`; throw a clear error if either is missing.
7. `src/lib/api.js`: `listTownships()` as the first helper.
8. Temporary test: on the Login placeholder, show the township list (will need a signed-in user once RLS is on, so show the error message plainly if it is empty or blocked; Card 03 removes this test).

## Steps for the learner (the agent tells them exactly, one at a time)

1. Supabase dashboard → your project → **Project Settings → API**: copy **Project URL** and the **anon public** key into `.env.local` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. **Never copy the `service_role` key.**
2. **SQL Editor**: run `0001`, then `0002`, then `0003`, pasting each file in full.
3. **Authentication → Users → Add user**: create the four demo accounts with "Auto Confirm User" ticked. Choose passwords yourself and keep them outside the repo.
4. **SQL Editor**: run `seed.sql`.
5. Restart `npm run dev` so the new env vars load.

## What not to do

- No `service_role` key anywhere in the project.
- No table without RLS.
- No real townships, units or people; no real CO2e factors without a source.
- Do not build login UI yet (Card 03).

## Done when

- All three migrations and the seed run without errors.
- Table Editor shows 3 townships, 30 units, 8 categories, about 30 items, 4 profiles and the sample collections.
- Every table shows "RLS enabled".
- The app reads from Supabase using only the anon key.

## Verification steps

- In SQL Editor: `select count(*) from collections;` returns the sample count.
- In SQL Editor: `select * from get_township_leaderboard(date_trunc('month', now())::date);` returns 3 rows.
- Search the project for `service_role`: no results.
- Security check: in the browser console on localhost, without signing in, `supabase.from('collections').select('*')` returns no rows.
- Design check: the temporary test list uses `GlassCard` styling from `design.md`, or plain text, and is removed in Card 03.

## Localhost test before continuing

After this card, the learner should test:

- Supabase Table Editor shows the six tables, each with RLS enabled.
- Table Editor → `collections` has sample rows; `profiles` has 4 rows with the right roles.
- `npm run dev` starts with no "missing env var" error.
- No meaningful in-app data yet without login; the test list either shows nothing or a clear "not signed in" message. That is expected.

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

Stop after verification. Do not start Card 03.

## Status

Done. SQL tested locally; learner ran the dashboard steps; live signed-out checks passed (no rows readable, RPC denied, insert blocked).
