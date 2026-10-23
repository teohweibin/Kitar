# Work Card 01: Project Skeleton + PWA Shell

## Goal

A Vite + React app runs in this folder, installs as a PWA shell, uses the design tokens from `design.md`, and has placeholder pages for every route.

## Inputs

- `build-blueprint.md` → File and Folder Expectations, Implementation Rules
- `design.md` → Color / Contrast Rules, Typography Feel, Layout Rules → Every screen

## Files likely touched

`package.json`, `index.html`, `vite.config.js`, `.gitignore`, `.env.example`, `src/main.jsx`, `src/App.jsx`, `src/styles/tokens.css`, `src/components/TopBar.jsx`, `src/components/SampleBadge.jsx`, `src/components/BottomNav.jsx`, placeholder files under `src/pages/`, `public/icons/`

## Instructions for the coding agent

1. Create the app without deleting anything in this folder:
   - `npx -y create-vite@9.2.1 app-temp --template react --no-interactive`
   - Ignore the "cd app-temp" hint. Move everything inside `app-temp`, hidden files included, up into this folder next to `START_HERE.md`. Delete the empty `app-temp` folder.
   - Set `<title>` in `index.html` to `Kitar` and `"name"` in `package.json` to `kitar`.
   - Never use `--overwrite` and never choose "Remove existing files".
2. Install: `npm install react-router-dom lucide-react @fontsource/poppins` and `npm install -D vite-plugin-pwa`.
3. Remove the Vite demo content (counter, logos, `App.css` demo styles).
4. `src/styles/tokens.css`: every token from `design.md` → Color / Contrast Rules as CSS variables on `:root`, base styles (`body` background `--bg`, text `--text`, Poppins, 15 px), the warm top glow as a fixed radial gradient, focus ring, `prefers-reduced-motion` rule. Add `<meta name="theme-color" content="#0D0A08">` in `index.html`.
5. `vite.config.js`: add `VitePWA` with `registerType: 'autoUpdate'`, manifest `name: "Kitar"`, `short_name: "Kitar"`, `theme_color` and `background_color` `#0D0A08`, `display: "standalone"`, and two placeholder icons (192 and 512 px PNG, a simple orange circle with a white "K" — no logos).
6. Routes in `App.jsx` with `react-router-dom`:
   - `/` → Login placeholder
   - `/resident` with children `home`, `guide`, `scan`, `bag`, `rewards` (default `home`)
   - `/collector` with children `scan`, `weigh`, `done` (default `scan`)
   - `/admin`
   - Each placeholder shows the page title in `TopBar` and one line of text.
7. `SampleBadge`: the "Concept prototype · sample data" pill, shown in `TopBar` on every screen.
8. `BottomNav` for resident routes: Home · Guide · [Scan raised 64 px orange circle] · My Bag · Rewards, using `lucide-react` icons, fixed with safe-area padding, styled per `design.md`.
9. `.gitignore` includes `.env*` and `!.env.example`. Create `.env.example` with `VITE_SUPABASE_URL=` and `VITE_SUPABASE_ANON_KEY=` (empty values).
10. Run `npm run dev` and `npm run build`.

## What not to do

- Do not connect to Supabase yet.
- Do not build real page content; placeholders only.
- Do not use any logo from the reference or from SDP.
- Do not delete or move any planning file.

## Done when

- `npm run dev` serves the app; `npm run build` finishes without errors.
- All routes open and show their placeholder with the TopBar and sample pill.
- Resident routes show the bottom nav with the raised orange scan button.
- The page uses the dark background, warm glow and Poppins.

## Verification steps

- `npm run build` exits with no errors.
- Open each route listed above.
- `git check-ignore .env.local` would match (or `.gitignore` visibly contains `.env*`).
- Design check: background, glow, glass TopBar, sample pill, bottom nav and orange scan FAB follow `design.md` → Every screen and Resident screens.

## Localhost test before continuing

After this card, the learner should test:

- Run `npm run dev` and open `http://localhost:5173/resident` → dark screen, warm glow at the top, "Concept prototype · sample data" pill, bottom nav with an orange round Scan button in the middle.
- Tap each bottom-nav item → the title changes to Home / Guide / Scan / My Bag / Rewards.
- Open `/collector` and `/admin` → placeholders with the sample pill, no bottom nav.
- Narrow the browser to phone width (375 px) → nothing scrolls sideways.

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

Stop after verification. Do not start Card 02.

## Status

Done. Agent-verified (build, lint, routes, phone width, no console errors) and learner replied `continue`.
