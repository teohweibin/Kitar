# Architecture

> Status: **CONFIRMED** by the learner.

## Build Shape

Supabase-backed PWA with three roles: resident, collector, admin.

## Stack Decision

| Layer | Choice | Why |
|---|---|---|
| Frontend | Vite + React (JavaScript) | Fast dev server, simple to deploy |
| Routing | `react-router-dom` | One route group per role |
| Styling | Plain CSS with variables (Tailwind if the learner prefers) | Follows `design.md` tokens |
| PWA | `vite-plugin-pwa` | Manifest, icons, service worker, install prompt |
| Backend | Supabase: Postgres, Auth, RLS | Free tier, no server code to write |
| QR scan | `html5-qrcode` | Works in mobile browsers |
| QR generate | `qrcode` | Renders the unit's bag label |
| Photo scan | `@huggingface/transformers` running MobileCLIP (`Xenova/mobileclip_s0`, vision model fp16 ≈ 23 MB) in the browser, zero-shot against precomputed text embeddings of the guide items (`src/data/scanEmbeddings.json`) | Free, no API key, recognises any item we describe in text (MobileNet had no "can" class), works offline after the first load |
| Charts | `recharts` | Admin dashboard |
| Hosting | Vercel | HTTPS URL for phone camera tests and the pitch QR code |

## Structure Overview

```
/                     → public landing page (no sign-in needed, no database reads)
/login                → sign in (until Work Card 07b, login lives at /)
/resident             → tabs: Guide · Scan · My Bag · History · Rewards
/collector            → Scan bag → Record weight → Done
/admin                → Dashboard
```

The app lives in this folder, beside `START_HERE.md`. Planning files stay where they are.

## Roles and Permissions

| Role | Can do |
|---|---|
| resident | Read guide; read own unit, own unit's collections, own points; read leaderboard aggregates |
| collector | Read guide; look up a unit by QR token; insert collections as themselves; read collections they inserted |
| admin | Read everything; no writes from the app in v1 (data changes go through migrations or seed) |

## Data Model

`townships`
- `id` uuid pk, `name` text, `is_sample` boolean default true

`units`
- `id` uuid pk, `township_id` fk, `unit_code` text unique (for example `SAMPLE-A-0101`), `qr_token` text unique (random, printed in the QR)

`profiles`
- `id` uuid pk = `auth.users.id`, `role` text check in (`resident`, `collector`, `admin`), `unit_id` fk null (residents only), `display_name` text (fictional)

`waste_categories`
- `id` text pk (`paper`, `plastic`, `metal`, `glass`, `carton`, `ewaste`, `textile`, `cooking_oil`)
- `name_en`, `name_ms`, `bin_colour` (`blue`, `orange`, `brown`, `qr-bag` = goes in the QR bag and the collector sorts it, `drop-off` = hand to the collector separately), `points_per_kg` int (sample value)
- `co2e_kg_per_kg` numeric null, `co2e_source` text null: CO2e is shown only when both are filled with a cited source

`waste_items`
- `id` uuid pk, `name_en`, `name_ms`, `category_id` fk null (null = not recyclable here), `prep_steps` text[], `prep_steps_ms` text[] (Malay, same order; added by `supabase/updates/0004_guide_wording.sql`), `keywords` text[], `model_labels` text[] (unused since the switch to MobileCLIP; prompts now live in `src/data/scanLabels.json`)

`collections`
- `id` uuid pk, `unit_id` fk, `collector_id` fk → profiles, `category_id` fk, `weight_kg` numeric check (> 0 and <= 50), `collected_at` timestamptz default now()
- Append-only in v1: no update or delete from the app

## Row Level Security

RLS is enabled on every table. A helper `public.my_role()` (SECURITY DEFINER, reads `profiles` for `auth.uid()`) avoids recursive policies.

| Table | select | insert | update / delete |
|---|---|---|---|
| townships, waste_categories, waste_items | any signed-in user | none | none |
| units | resident: own unit · collector, admin: all | none | none |
| profiles | own row · admin: all | none | none |
| collections | resident: `unit_id` = own unit · collector: `collector_id = auth.uid()` · admin: all | collector only, with `collector_id = auth.uid()` | none |

## Computed Values

- **Points**: view `unit_points` (`security_invoker = true`) = sum(`weight_kg` × `points_per_kg`) per unit. RLS on `collections` keeps residents to their own unit.
- **Leaderboard**: function `get_township_leaderboard(month date)` (SECURITY DEFINER) returns only aggregates per township: total kg, participating units, kg per participating unit. No unit-level rows, so residents cannot see other households.
- **Admin dashboard**: queries on `collections` joined to `units` and `townships`, grouped by township, category and month.
- **CO2e estimate**: kg × `co2e_kg_per_kg` per category, shown with "estimate" and the source. Hidden for categories without a cited factor.

## Seed / Sample Data

`supabase/seed.sql`:

- 3 fictional townships (for example "Taman Sample Hijau"), each marked sample
- 10 units per township with random `qr_token`s
- 8 categories, about 30 guide items in English and Malay
- About 3 months of sample collections so the dashboard and leaderboard are not empty
- Demo accounts are created by the learner in Supabase → Authentication (for example `resident1@demo.test`, `collector1@demo.test`, `admin@demo.test`), then linked in `profiles` by the seed. Passwords are never written in the repo.

## User Flows

1. **Learn**: resident → Guide → search "kotak susu" → sees the Carton category, bin colour, "rinse and flatten".
2. **Scan**: resident → Scan → takes a photo → dark-photo check → MobileCLIP image embedding compared with each guide item's prompt embeddings → best item above 35 % confidence → guide entry, or "Not right? Choose manually".
2b. **Scan a pile**: resident → Scan → "A pile" → photo (kept at up to 768 px) → whole photo + 3×3 grid of overlapping half-size crops each scored with MobileCLIP → items whose best crop is ≥ 50 % confident → grouped by bin → resident removes wrong items or adds missed ones (nothing is saved; points still come only from weighed collections).
3. **Drop**: resident → My Bag → large QR code of their unit's `qr_token`.
4. **Verify**: collector → Scan bag → camera reads QR → shows `unit_code` → chooses category → enters kg → Save → inserts into `collections`.
5. **Reward / Compete**: resident → Rewards → points from `unit_points`, township rank from `get_township_leaderboard`.
6. **Report**: admin → Dashboard → totals, charts, CO2e estimate.

## File Expectations

```
src/
  lib/supabase.js          client from env vars
  lib/auth.jsx             session + role context, route guards
  pages/Landing.jsx        public story + proof page
  pages/Login.jsx
  pages/resident/*.jsx     Guide, Scan, MyBag, History, Rewards
  pages/collector/*.jsx    ScanBag, RecordWeight, Done
  pages/admin/Dashboard.jsx
  components/              shared UI (SampleBadge, BottomNav, StatCard…)
supabase/
  migrations/0001_schema.sql
  migrations/0002_rls.sql
  migrations/0003_views_functions.sql
  seed.sql
public/icons/              PWA icons
.env.example               variable names only
vercel.json                SPA rewrite
demo-script.md             3-minute demo flow (Card 08)
```

## Environment Variables

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Both live in `.env.local` (git-ignored) and in Vercel project settings. The `service_role` key is never used by the app.

## Constraints

- Camera APIs need HTTPS. `localhost` works on a desktop webcam; phones need the Vercel preview URL or a tunnel.
- MobileCLIP recognises items described in `scanLabels.json`; Malaysian-specific packaging still needs testing and better prompts, so the manual fallback is required. The q8 quantized vision model gives wrong answers for this model; use fp16 or fp32.
- Supabase free tier pauses inactive projects: open the project the day before the pitch.

## Technical Non-Goals

- No custom backend server or Edge Functions in v1 (planned later: a `classify-waste` Edge Function for the hybrid cloud AI scan, see project-brief.md → Later)
- No real payments or billing integration
- No offline queue for collectors (Later)
- No editing or deleting collections from the app
- No push notifications

## Verification Notes

- Signed in as a resident, query `collections` from the browser console: only own-unit rows come back.
- Signed in as a resident, open `/collector` and `/admin`: redirected away.
- Insert a collection as a collector: it appears in the resident's history and in the admin totals after a refresh.
- Lighthouse PWA check passes; the app installs on Android and shows a message when offline.
