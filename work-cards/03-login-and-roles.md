# Work Card 03: Demo Login and Role Routing

## Goal

Users sign in with email and password, land on the screen for their role, cannot open other roles' screens, and can sign out.

## Inputs

- `architecture.md` → Roles and Permissions
- `design.md` → Component Style (inputs, buttons), States

## Files likely touched

`src/lib/auth.jsx`, `src/pages/Login.jsx`, `src/App.jsx`, `src/components/TopBar.jsx`, `src/lib/api.js`

## Instructions for the coding agent

1. `src/lib/auth.jsx`: an `AuthProvider` that tracks the Supabase session (`getSession` + `onAuthStateChange`), loads the user's `profiles` row (role, unit_id, display_name), and exposes `{ session, profile, loading, signIn, signOut }`.
2. `RequireRole` component: shows a loading skeleton while loading; redirects to `/` when signed out; redirects to the user's own home when the role does not match.
3. Wrap `/resident/*` in `RequireRole role="resident"`, `/collector/*` in `collector`, `/admin` in `admin`.
4. `Login.jsx` per `design.md`: app name "Kitar", one line "Recycle, verified.", email and password inputs, primary "Sign in" button, error state for wrong credentials, and a small "Demo accounts" note listing the four demo emails only (never passwords).
5. After sign-in, redirect by role: resident → `/resident/home`, collector → `/collector/scan`, admin → `/admin`. A signed-in user who opens `/` is redirected the same way.
6. Sign-out: in the resident Home top bar (icon button with `aria-label`), collector top bar, and admin top bar.
7. Remove the Card 02 temporary townships test.

## What not to do

- No sign-up page, no password reset, no social login.
- No passwords in code or on screen.
- Do not build real page content yet beyond the login screen.

## Done when

- Each demo account lands on its own area after sign-in.
- Wrong roles are redirected away from protected routes.
- Signing out returns to the login screen and protected routes redirect there.

## Verification steps

- Sign in as each of the four demo accounts.
- Security check: signed in as `resident1@demo.test`, type `/collector/scan` and `/admin` in the address bar → redirected to `/resident/home`.
- Security check: signed out, open `/resident/home` → redirected to `/`.
- Design check: login screen inputs, primary button, error state and sample pill follow `design.md`.

## Localhost test before continuing

After this card, the learner should test:

- Sign in as `resident1@demo.test` → lands on Resident Home.
- While signed in as the resident, type `localhost:5173/admin` → you are sent back to Resident Home.
- Sign out → back to login; type `/resident/home` → sent back to login.
- Sign in as `collector1@demo.test` → lands on the collector Scan page; as `admin@demo.test` → lands on the dashboard placeholder.
- Enter a wrong password → a clear error message, no crash.

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

Stop after verification. Do not start Card 04.

## Status

Done. Agent-checked while signed out; learner tested sign-in for each role and replied `continue`.
