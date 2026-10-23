# Work Card 07b: Landing Page

Added after planning at the learner's request: judges who scan the pitch-slide QR code must understand Kitar before they sign in.

## Goal

A public page at `/` explains what Kitar is, who it is for, why it matters and how it would roll out, then sends visitors to the demo. Login moves to `/login`.

## Inputs

- `project-brief.md` → Problem Statement, Target User, One-Sentence Concept, Version-One Success, Assumptions
- `build-blueprint.md` → 60-Second Pitch Explanation
- `design.md` → Color / Contrast Rules, Typography Feel, Component Style, Anti-Slop Rules
- Learner's structure reference (screenshot): two sections, "The Story" and "The Proof", each a row of four numbered cards with a title and a 2–4 line body, a coloured heading with a rule under it, and a different number-badge colour per section. Borrow the structure, not the light colours: Kitar stays dark.

## Files likely touched

`src/pages/Landing.jsx`, `src/pages/Landing.css`, `src/App.jsx`, `src/lib/auth.jsx`, `src/components/SignOutButton.jsx`, `src/pages/Login.jsx`

## Instructions for the coding agent

1. **Routes**: `/` → `Landing` (public, no sign-in, no database reads). `/login` → `Login`. `RequireRole` and `SignOutButton` redirect to `/login` instead of `/`. A signed-in user who opens `/` still sees the landing page, with the button reading "Open my Kitar" and going to their role's home.
2. **Hero** (first screen at 375 px):
   - Sample pill, then "Kitar." wordmark (text only) and the line "Recycle, verified."
   - One sentence: "A recycling module for Sime Darby Property townships: residents learn to sort, every bag is weighed and recorded, and recycling becomes a measured habit."
   - Primary button "Try the demo" → `/login`; secondary text link "How it works" → scrolls to card 5.
   - Small disclaimer under the buttons: "Concept prototype for a pitch. Not affiliated with or endorsed by Sime Darby Property. All data is sample data."
3. **The Story**: heading with an orange rule under it; four numbered cards, number badges filled `--primary` with `--on-primary` numbers:
   1. **Problem**: SDP has pledged Zero Waste by 2030 and must report Scope 3, which includes waste, but community recycling still runs on manual collection and short campaigns, so nobody can measure it household by household.
   2. **Target user**: residents of SDP townships who want to recycle but are unsure how; the collectors who pick up the bags; SDP's sustainability team, who need the numbers.
   3. **Solution**: an app module where residents scan an item to learn how to sort it, drop it in a bag with their unit's QR code, and the collector weighs and scans each bag so every kilogram is recorded.
   4. **Innovation**: points come from weighed, verified collections, not self-reported photos. Townships compete, and SDP gets audit-ready recycling data instead of campaign estimates.
4. **The Proof**: heading with a rule in `--accent-text`; four numbered cards, number badges outlined in `--accent-text` (so the two sections look different without a new colour):
   5. **How it works**: Scan item → drop in QR bag → collector weighs and scans → points and township rank update → dashboard shows the kilograms. Show the five steps as a small vertical stepper with `lucide-react` icons inside the card.
   6. **Impact**: residents know what to recycle; SDP sees verified kilograms per township, per category and per month; participation lasts beyond a campaign because points and rankings update every collection. No invented percentages or tonnes.
   7. **Feasibility**: runs in the phone browser (installable, no app store); uses phones and scales collectors already have; the QR bag costs only a printed label; could sit inside SDP's existing owner app.
   8. **Implementation**: pilot one strata township for 3 months, measure kilograms per unit and participation, link points to the existing maintenance-offset pilot, then roll out across townships.
5. **Closing call to action**: a hero glass card "See it working" with the primary button "Try the demo" and one line: "Demo accounts for resident, collector and admin are on the next screen."
6. **Footer**: the disclaimer again, plus "Built with React and Supabase as a student prototype."
7. **Layout**: cards in 1 column below 640 px, 2 columns from 640 px, 4 columns from 1024 px. Page max width 1200 px. Section headings 22 px, card titles 17 px, body 14 px in `--text-muted`. Cards use `GlassCard`.

## What not to do

- No SDP logo, photos or brand colours; the name appears only in text.
- No statistics that are not sourced; the problem card states facts from `project-brief.md` without numbers unless the learner adds a cited source.
- No database calls on the landing page.
- No testimonials or fake partner logos.

## Done when

- `/` shows the landing page signed out, and "Try the demo" opens `/login`.
- All eight cards show with the right content and numbers.
- Signed-out visits to protected routes go to `/login`; sign-out goes to `/login`.
- Phone width shows one column with no sideways scroll; laptop width shows four columns.

## Verification steps

- Open `/` signed out, then signed in as each role: the button text and target change as described.
- Open `/resident/home` signed out → redirected to `/login`.
- Check the page against `project-brief.md`: no claim on the page goes beyond the brief.
- Design check: dark theme, orange-badged Story cards, outlined Proof badges, hero, CTA card and disclaimer follow `design.md` and the learner's structure reference.

## Localhost test before continuing

After this card, the learner should test:

- Open `http://localhost:5173/` without signing in → hero, "The Story" with cards 1–4, "The Proof" with cards 5–8.
- Tap "How it works" → the page scrolls to card 5.
- Tap "Try the demo" → the login page opens at `/login`.
- Sign in, then open `/` → the button now reads "Open my Kitar" and takes you to your home.
- Shrink to phone width → cards stack in one column; widen to a laptop → four in a row.

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

Stop after verification. Do not start Card 08.

## Status

Done. Redesigned as a scroll-driven page; footer disclaimer and hero sample pill removed at the learner's request; learner replied `continue`.
