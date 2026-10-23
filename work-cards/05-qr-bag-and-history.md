# Work Card 05: Resident QR Bag and Recycling History

## Goal

Residents see their unit's QR code large and can print it, and see a list of their unit's verified collections.

## Inputs

- `design.md` → Resident screens → My Bag, Rewards (History tab); Component Style → List items, Status chips; States → Empty
- `architecture.md` → User Flow 3; Row Level Security for `units` and `collections`

## Files likely touched

`src/pages/resident/Bag.jsx`, `src/pages/resident/Rewards.jsx`, `src/components/QrCard.jsx`, `src/lib/api.js`, `src/styles/print.css`, `package.json`

## Instructions for the coding agent

1. `npm install qrcode`.
2. `api.js`: `getMyUnit()` (reads the resident's unit: `unit_code`, `qr_token`, township name) and `listMyCollections()` (newest first, with category names).
3. **My Bag**: `QrCard` renders the unit's `qr_token` as a QR code (error correction level M) on a white card, at least 240 px; unit code under it in large monospace; township name; the instruction text from `design.md`; primary "Print label"; tip "Turn your screen brightness up for scanning".
4. **Print**: `print.css` with `@media print` that prints only the QR card, unit code and "Kitar recycling bag" on white, sized for an A6 label.
5. **Rewards → History tab**: pill tabs "History | Leaderboard" (Leaderboard shows "Coming in the next card" for now). History cards per `design.md`: category icon tile, "Plastic · 2.4 kg", date, points in gold, "Verified" chip. Empty state with "Show my QR" button.
6. Loading skeletons and error state with "Try again".

## What not to do

- The QR code encodes only `qr_token`: no names, no unit code, no URL with personal data.
- Do not compute the points balance or leaderboard yet (Card 07).

## Done when

- My Bag shows a scannable QR for the signed-in resident's unit.
- Print preview shows only the label.
- History lists that unit's sample collections, newest first.

## Verification steps

- Scan the on-screen QR with a phone camera app: it reads the token text (a UUID).
- Print preview (Ctrl+P) shows only the label.
- Security check: sign in as `resident1@demo.test` and note the history; sign in as `resident2@demo.test` → a different unit's history; none of resident 1's rows appear.
- Security check: as resident 1, in the console, `supabase.from('units').select('*')` returns only one unit.
- Design check: white QR card, monospace unit code, history cards, Verified chip and empty state follow `design.md`.

## Localhost test before continuing

After this card, the learner should test:

- Sign in as resident 1 → My Bag → a big QR code with `SAMPLE-A-0101` under it.
- Point your phone camera at the screen → it reads a long code.
- Click "Print label" → the print preview shows only the label.
- Rewards → History → a list of sample collections with kg, dates and points.
- Sign in as resident 2 → History shows different records.

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

Stop after verification. Do not start Card 06.

## Status

Done. Agent-checked as resident 1; learner tested QR scanning, printing and resident 2, and replied `continue`.
