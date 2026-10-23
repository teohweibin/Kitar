# Work Card 07: Rewards, Leaderboard and Admin Dashboard

## Goal

Residents see their points balance, progress to the next sample tier and their township's rank; the admin sees verified recycling data by month, township and category.

## Inputs

- `design.md` → Resident screens → Home hero, Rewards; Admin dashboard; Color / Contrast Rules
- `architecture.md` → Computed Values

## Files likely touched

`src/pages/resident/Home.jsx`, `src/pages/resident/Rewards.jsx`, `src/pages/admin/Dashboard.jsx`, `src/components/StatCard.jsx`, `src/lib/api.js`, `package.json`

## Instructions for the coding agent

1. `npm install recharts`.
2. `api.js`: `getMyPoints()` (from `unit_points`), `getLeaderboard(month)` (RPC `get_township_leaderboard`), and admin helpers: `getAdminTotals(filters)`, `getKgByMonth(filters)`, `getKgByTownship(filters)`, `getKgByCategory(filters)`, `listLatestCollections(filters)`.
3. Sample tiers, defined in one constant and labelled as sample: Bronze 0, Silver 500, Gold 1500 points.
4. **Home hero card**: points balance with gold coin icon, rank chip "#N of 3 this month", "View rewards". Replace the Card 04 placeholder.
5. **Rewards**: hero card with balance, progress bar to the next tier ("70 % to Silver"), and the line "Rewards are sample values in this prototype". **Leaderboard tab**: rows with rank, township, kg per participating unit, participation %; the resident's own township has an orange border and a "Your township" tag; empty state.
6. **Admin dashboard** per `design.md`: filters (month, township), 4 stat cards, three single-series orange charts (kg per month as an area chart, kg per township as bars, kg per category as horizontal bars), and the latest 20 collections table (unit code, no names). The CO2e card shows "Estimate" and its source tooltip, or "Add a cited factor to show this" when no category has a factor.
7. Chart styling: dark tooltips, `--text-muted` axis labels, no gridline clutter, numbers with tabular figures; respond to width (single column on a phone).

## What not to do

- Residents never see unit-level data from other units.
- No real-money language; no CO2e numbers without a cited factor.
- No export buttons (Later).

## Done when

- The resident's points equal the sum of their collections × the sample rates.
- The leaderboard shows three townships for the current month.
- The admin dashboard numbers include the collection saved in Card 06.

## Verification steps

- Compare resident 1's points with `select * from unit_points` in SQL Editor.
- Save a new collection as the collector → the resident's points, rank and the admin totals all change after a refresh.
- Security check: as resident 1, in the console, `supabase.from('unit_points').select('*')` returns only their own unit.
- Security check: the leaderboard RPC response contains no unit ids or unit codes.
- Design check: hero card rim, progress bar, leaderboard highlight, stat cards and orange charts follow `design.md`.
- Run `prompts/07-review-mirror.md` and record the result in `build-status.md`.

## Localhost test before continuing

After this card, the learner should test:

- Resident 1 → Home shows the points balance and "#N of 3 this month".
- Rewards → the progress bar and "% to Silver"; Leaderboard tab shows 3 sample townships with yours highlighted.
- Sign in as `admin@demo.test` → 4 stat cards, 3 charts and the latest collections table.
- As the collector, save 5 kg of paper for resident 1 → refresh the admin dashboard and resident 1's Home: both numbers go up.
- Narrow the admin page to phone width → everything stacks into one column.

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

Stop after verification and the review. Do not start Card 08.

## Status

Implemented; admin and resident screens checked by the agent after update 0005; Review Mirror PASS. Learner replied `continue`. Done.
