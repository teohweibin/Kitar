# Prompt 05: Work Card Writer

Goal: create one markdown file per work card under `work-cards/`.

Read:

- `project-brief.md`
- `architecture.md`
- `design.md`
- `build-blueprint.md`

Write exactly these eight files:

```text
work-cards/01-project-skeleton.md
work-cards/02-supabase-schema.md
work-cards/03-login-and-roles.md
work-cards/04-sorting-guide-and-scan.md
work-cards/05-qr-bag-and-history.md
work-cards/06-collector-scan-and-weigh.md
work-cards/07-rewards-leaderboard-dashboard.md
work-cards/07b-landing-page.md
work-cards/08-pwa-deploy-demo.md
```

Card 07b was added after planning, at the learner's request, so judges understand Kitar before signing in.

What each card holds:

| Card | Holds |
|---|---|
| 01 Project skeleton + PWA shell | Vite + React app in this folder; `vite-plugin-pwa` with manifest and placeholder icons; routes for `/`, `/resident`, `/collector`, `/admin` showing placeholder pages; the "Concept prototype · sample data" label; `.gitignore` covers `.env*` |
| 02 Supabase schema, RLS and seed data | SQL migration files for every table in `architecture.md`, RLS policies, views for points and leaderboard, seed data (fictional townships, units, waste guide items, demo accounts); `src/lib/supabase.js` client reading env vars; a test page that lists townships |
| 03 Demo login and role routing | Supabase email + password login; on login, read the user's role from `profiles` and redirect; route guards so a resident cannot open `/collector` or `/admin`; sign-out; a "demo accounts" hint on the login page listing the seeded demo emails only, never passwords |
| 04 Resident: sorting guide and photo scan | Search the `waste_items` guide (EN + BM names) with the bin colour and preparation steps; photo scan as described in `architecture.md` (v1: camera photo → classification → matching guide entry, with a "not right? choose manually" fallback) |
| 05 Resident: QR bag and my recycling history | The resident's unit QR code shown large and printable; a list of that unit's collections (date, category, kg, points) from Supabase; empty state |
| 06 Collector: scan QR and record weight | Camera QR scan with `html5-qrcode`; shows the matched unit label (no personal names); choose category; enter kg with large number keys; save inserts a `collections` row; success screen; manual unit-code entry as a fallback |
| 07 Rewards, leaderboard and admin dashboard | Resident points balance from the points view; township leaderboard for the current month; admin dashboard: total kg, kg per township, kg per category, CO2e estimate (labelled as an estimate with its factor source), collections over time chart |
| 07b Landing page | Public page at `/` with a hero, a Story section (problem, target user, solution, innovation) and a Proof section (how it works, impact, feasibility, implementation) as numbered cards, "Try the demo" → `/login`, disclaimer footer; login route moves to `/login` and guards redirect there |
| 08 PWA polish, deploy and demo script | Real app icons, offline fallback page, install prompt; phone-width check on every screen; push to GitHub; deploy on Vercel with env vars set there; add the Vercel URL to Supabase Auth redirect URLs; real-phone test; write `demo-script.md` with the 3-minute demo flow |

Card 01 must tell the coding agent how to create the app without deleting anything in this folder:

- Create the Vite + React app in a temporary subfolder: `npx -y create-vite@9.2.1 app-temp --template react --no-interactive`
- Ignore the scaffolder's "cd app-temp" hint. Move everything inside `app-temp`, hidden files included, up into this project folder, next to `START_HERE.md`. Then delete the empty `app-temp` folder.
- Set the `<title>` in `index.html` and the `"name"` in `package.json` to `kitar`, not `app-temp`.
- Run `npm install`, then `npm run dev`.
- Never run a scaffolder with `--overwrite`, and never choose "Remove existing files": that empties this folder and deletes the planning files, `prompts/`, `templates/` and `work-cards/`.

Card 02 must tell the learner exactly which values to copy from the Supabase dashboard (Project URL and anon public key) into `.env.local`, and must warn never to copy the `service_role` key into the app.

Each work card must use this structure:

```md
# Work Card NN: Title

## Goal

## Inputs

## Files likely touched

## Instructions for the coding agent

## What not to do

## Done when

## Verification steps

## Localhost test before continuing

## Stop condition

## Status
Not started
```

Each Work Card must include a `Design check` line under Verification steps, referencing `design.md`, for example:

```text
Design check: collector scan screen uses the large number keys, confirmation state and outdoor-contrast rules from design.md.
```

Cards 02, 03, 05, 06 and 07 must also include a `Security check` line, for example:

```text
Security check: signed in as resident A, the history list does not show any collection from resident B's unit.
```

Every Work Card must include a `## Localhost test before continuing` section written for that card:

```md
## Localhost test before continuing

After this card, the learner should test:

- [Specific test for this card]
- [Specific test for this card]
- [Specific test for this card]

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.
```

Rules for the generated tests:

- If the card scaffolds the app, test that `npm run dev` starts and the app shell loads.
- If the card creates visible UI, test that the expected UI is visible.
- If the card writes to Supabase, test that the row appears in the Supabase Table Editor and in the app after a refresh.
- If the card adds a permission rule, test it from the wrong role and confirm it is blocked.
- If the card uses the camera, say it needs HTTPS on a phone: test on desktop with a webcam on localhost, or on a phone through the Vercel preview or a tunnel.
- If the card adds styling, test at phone width and confirm nothing is cut off.
- If no browser preview exists yet, say: `No meaningful browser preview yet. Continue after the command/file checks pass.`

Do not write generic implementation-only cards. Every card includes learner QA.

After writing the cards, update `build-status.md`:

- Current phase: Ready to Build
- Current KDBM Lite stage: Build
- Current work card: `work-cards/01-project-skeleton.md`
- Completed planning files list
- Next instruction for AI:
  `Read build-status.md, build-blueprint.md, and work-cards/01-project-skeleton.md. Implement only Work Card 01. Stop after verification and update build-status.md.`

Stop. Do not implement.
