# Build Blueprint

## Source Files

- `project-brief.md` (confirmed)
- `architecture.md` (confirmed)
- `design.md` (confirmed)

If anything here conflicts with those files, those files win. Update this blueprint to match.

## Project Identity

**Kitar**: a recycling module concept for Sime Darby Property townships. Demo prototype for a pitch, not affiliated with or endorsed by SDP. Every screen shows "Concept prototype · sample data".

## Build Shape

Supabase-backed PWA (approved expansion): Vite + React installable web app, Supabase Postgres + Auth + RLS, three roles (resident, collector, admin), deployed on Vercel.

## Version-One Promise

On a real phone, through the Vercel URL, a 3-minute demo runs end to end with no errors:

1. Resident logs in, photographs a drink carton, gets the right guide entry.
2. Resident opens My Bag and shows the QR code.
3. Collector logs in on a second phone, scans that QR code, picks a category, enters 2.4 kg, confirms, saves.
4. Resident refreshes: the collection is in History, points went up, the township leaderboard updated.
5. Admin opens the dashboard on a laptop: totals include the new 2.4 kg.

## Scope Lock

### Now

- Public landing page at `/` (Story + Proof, "Try the demo" → `/login`)
- Demo login for three roles with route guards
- Sorting guide search (EN + BM), about 30 sample items
- Photo scan with MobileCLIP (Hugging Face, in the browser) matched against the guide items, plus dark-photo check and "choose manually" fallback
- "A pile" scan mode (3×3 crop grid), results grouped by bin with remove / add
- Unit QR code, large and printable
- Collector: scan QR → category → weight → confirm → save; manual unit-code entry
- Resident history and points
- Township leaderboard for the current month (kg per participating unit)
- Admin dashboard: kg by month, township, category; participation; CO2e estimate only with a cited factor
- Installable PWA on Vercel, plus `demo-script.md`

### Later

Hybrid photo scan: keep on-device MobileCLIP first; when it is unsure, in "A pile" mode, or when the resident taps "Ask AI", call a cloud vision model (Gemini, Grok or Claude, provider to be chosen) through a Supabase Edge Function with the key in Supabase Secrets, the guide item list in the prompt, JSON-only answers (item id or "unknown" + material), a per-user daily limit, and a notice that the photo is sent to a third party · Custom Malaysian waste model · Reduce guide · monthly challenges · pickup booking · buy-back prices · WhatsApp bot · SDP owner-app integration · real maintenance-fee offset · reward redemption · collector offline queue · ESG export · full UI translation.

### Never

Real payments or fee deductions · real residents' data · SDP logos or brand assets · secrets in frontend code or Git · invented statistics shown as real · money symbols or wallet language.

## Architecture Summary

- Routes: `/` landing (from Card 07b) · `/login` · `/resident/*` (Home, Guide, Scan, Bag, Rewards) · `/collector/*` (Scan, Weigh, Done) · `/admin`.
- Tables: `townships`, `units`, `profiles`, `waste_categories`, `waste_items`, `collections`.
- Computed: view `unit_points` (security_invoker), function `get_township_leaderboard(month)` (security definer, aggregates only), admin queries grouped by month, township and category.
- Libraries: `react-router-dom`, `@supabase/supabase-js`, `vite-plugin-pwa`, `html5-qrcode`, `qrcode`, `@huggingface/transformers` (MobileCLIP `Xenova/mobileclip_s0`), `recharts`, `lucide-react`, `@fontsource/poppins`.

## Data / Security Rules

- RLS enabled on every table before the app reads it.
- Helpers `public.my_role()` and `public.my_unit()` are `security definer`, `stable`, with `set search_path = public`.
- Residents read only their own unit and its collections. Collectors insert collections only with `collector_id = auth.uid()` and read only what they inserted. Admins read everything. Nobody updates or deletes collections from the app.
- The leaderboard function returns township-level aggregates only.
- `weight_kg` is checked in the database: greater than 0, at most 50.
- Env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` in `.env.local` (git-ignored) and in Vercel. The `service_role` key is never used.
- Demo account passwords are set by the learner in the Supabase dashboard and never written in the repo.

## Design Direction Summary

Borrowed from the learner's reference: dark premium look, warm glow behind the top of the screen, glass cards with thin borders, hero balance card, bottom nav with a raised centre scan button, full-screen camera with corner brackets, pill segmented tabs, history cards with an icon tile.

Changed: the accent is dark orange `#C8641E` instead of teal; points use gold `#F2B544`; small orange text uses `#F29A55`.

Not copied: wallet, money, withdraw or transfer; world map; stock photos; avatars; the reference's branding; any SDP branding. Tokens, component specs and per-role layouts are in `design.md`.

## Implementation Rules

- JavaScript (not TypeScript), React function components and hooks.
- One CSS file for tokens and base styles (`src/styles/tokens.css`), plus a CSS file per page or component. No CSS framework unless the learner asks.
- Supabase calls go through small functions in `src/lib/` (`supabase.js`, `api.js`), not scattered in components.
- Every network call has loading, empty and error states as described in `design.md`.
- Load transformers.js, the MobileCLIP vision model and the prompt embeddings only on the Scan page (dynamic `import()`), so other pages stay fast. Re-run `npm run build:scan-embeddings` after editing `src/data/scanLabels.json`.
- Schema changes live in `supabase/migrations/NNNN_name.sql` and are run in the Supabase SQL Editor in order.
- Sample data is clearly fictional: township names start with "Taman Sample", unit codes start with `SAMPLE-`.

## File and Folder Expectations

```
index.html
package.json
vite.config.js            vite-plugin-pwa config
vercel.json               SPA rewrite (Card 08)
.env.example              variable names only
.env.local                git-ignored, learner fills in
public/icons/             PWA icons
src/
  main.jsx  App.jsx
  styles/tokens.css
  lib/supabase.js  lib/api.js  lib/auth.jsx  lib/classify.js
  components/              TopBar, SampleBadge, BottomNav, GlassCard, StatCard, Chip, Keypad, QrCard, EmptyState, ErrorState, OfflineBanner
  pages/Landing.jsx        (Card 07b)
  pages/Login.jsx
  pages/resident/          Home, Guide, Scan, Bag, Rewards
  pages/collector/         ScanBag, Weigh, Done
  pages/admin/Dashboard.jsx
supabase/
  migrations/0001_schema.sql
  migrations/0002_rls.sql
  migrations/0003_views_functions.sql
  seed.sql
demo-script.md            (Card 08)
```

Planning files (`START_HERE.md`, `prompts/`, `templates/`, `work-cards/`, the five planning `.md` files, `_archive/`) stay in place and are never deleted.

## Work Card Plan

1. **01 Project skeleton + PWA shell**: Vite + React in this folder, PWA plugin, design tokens, routes with placeholder pages, sample pill.
2. **02 Supabase schema, RLS and seed data**: three migrations, demo users, seed, Supabase client, a temporary townships test list.
3. **03 Demo login and role routing**: email/password login, role from `profiles`, route guards, sign-out.
4. **04 Resident: sorting guide and photo scan**: Home shell, Guide search and detail, Scan with MobileCLIP, dark-photo check and manual fallback.
5. **05 Resident: QR bag and my recycling history**: My Bag QR card and print, Rewards → History tab.
6. **06 Collector: scan QR and record weight**: Scan → Weigh (categories, keypad, confirm) → Done.
7. **07 Rewards, leaderboard and admin dashboard**: points balance and progress, leaderboard tab, Home hero data, admin stat cards, charts and table.
8. **07b Landing page**: public page at `/` telling the Story (problem, target user, solution, innovation) and the Proof (how it works, impact, feasibility, implementation) with "Try the demo"; login moves to `/login`.
9. **08 PWA polish, deploy and demo script**: icons, offline banner, install card, phone-width pass, GitHub, Vercel, real-phone test, `demo-script.md`.

## Review Mirror

Run `prompts/07-review-mirror.md` after Card 07 and after Card 08.

## Proof Ladder

1. Localhost works for all three roles, and the landing page explains Kitar without signing in.
2. Vercel URL works on a real phone, including QR scanning and the photo scan.
3. `demo-script.md` runs end to end in 3 minutes, recorded on a phone.

## 60-Second Pitch Explanation

- **Problem**: SDP has pledged Zero Waste 2030 and must report Scope 3, but its community recycling is campaign-based, manual and unmeasured.
- **Solution**: Kitar turns recycling into a measured habit in six steps: learn (guide + photo scan), drop (unit QR bag), verify (collector weighs and scans), reward (points), compete (township leaderboard), report (admin dashboard).
- **Proof**: live demo on two phones and a laptop.
- **Difference**: points come from weighed, verified collections, not self-reported photos.
- **Next**: integrate with the SDP owner app, connect points to the maintenance-offset pilot, train a Malaysian waste model.

## Guardrails for the Coding Agent

- Read `build-status.md`, `build-blueprint.md`, `design.md`, `architecture.md` and the current work card before editing.
- Implement only the current work card; do not jump ahead.
- Run the card's verification steps, then stop and wait for the learner.
- Update `build-status.md` after each work card.
- Never put the Supabase `service_role` key or any secret in frontend code or Git.
- Every new table has RLS enabled before it is used; schema changes go in `supabase/migrations/`.
- Do not invent claims, testimonials, logos or real numbers; sample data is labelled.
- No SDP logos or brand assets; no money symbols or wallet language.
- Never run a scaffolder with `--overwrite` or "Remove existing files".
