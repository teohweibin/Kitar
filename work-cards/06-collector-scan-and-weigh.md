# Work Card 06: Collector Scans QR and Records Weight

## Goal

A collector scans a bag's QR code (or types the unit code), picks a category, enters the weight on a large keypad, confirms, and saves a verified collection to that unit.

## Inputs

- `design.md` → Collector screens; Outdoor rules; Component Style
- `architecture.md` → User Flow 4; Row Level Security for `units` and `collections`

## Files likely touched

`src/pages/collector/ScanBag.jsx`, `src/pages/collector/Weigh.jsx`, `src/pages/collector/Done.jsx`, `src/components/Keypad.jsx`, `src/lib/api.js`, `package.json`

## Instructions for the coding agent

1. `npm install html5-qrcode`.
2. `api.js`: `findUnitByToken(token)`, `findUnitByCode(code)`, `insertCollection({ unit_id, category_id, weight_kg })` (sets `collector_id` to the signed-in user), `countMyCollectionsToday()`.
3. Collector layout: step indicator Scan → Weigh → Done, "Today: N bags" chip, sign-out, solid cards and larger text per the outdoor rules. No bottom nav.
4. **ScanBag**: `Html5Qrcode` with the rear camera, orange corner brackets, "Point at the QR code on the bag". On a successful read, stop the camera, look up the unit, go to Weigh. Unknown code: "This QR is not a Kitar bag" and keep scanning. Link "Type unit code instead" opens an input (uppercase, for example `SAMPLE-A-0101`).
5. **Weigh**: unit code in very large text, township under it; 8 category tiles (2 × 4); weight display; `Keypad` (1–9, ".", 0, backspace; keys at least 64 px; max one decimal point; max 50). "Save collection" opens a confirm sheet: "Save 2.4 kg Plastic for SAMPLE-A-0101?" → Confirm / Change.
6. On confirm: insert, then go to **Done**: green check, summary with points (`kg × points_per_kg`), primary "Scan next bag". On error: error card, keep the entered values, "Try again".
7. Prevent double-submit: disable the confirm button while saving.

## What not to do

- No names or personal details on collector screens: unit code and township only.
- No edit or delete of saved collections.
- No offline queue (Later).

## Done when

- Scanning a resident's QR code leads to Weigh for the right unit.
- Saving inserts one row in `collections` with the signed-in collector's id.
- Manual code entry works when the camera cannot read the code.

## Verification steps

- Show resident 1's QR on one screen (or a printed label) and scan it with the collector account on the laptop webcam.
- Enter 2.4 kg Plastic, confirm → Done screen; Table Editor shows the new row with the right `unit_id` and `collector_id`.
- Keypad rejects a second "." and values above 50.
- Security check: as the resident, in the console, try `supabase.from('collections').insert({...})` → blocked by RLS.
- Security check: as the collector, `supabase.from('collections').update(...)` and `.delete()` → blocked.
- Design check: step indicator, category tiles, 64 px keypad keys, confirm sheet and Done screen follow `design.md` → Collector screens.

## Localhost test before continuing

After this card, the learner should test:

- Sign in as resident 1 in one browser (or a phone) and open My Bag.
- Sign in as `collector1@demo.test` in another browser (an incognito window works) → point the webcam at the QR → the Weigh screen shows `SAMPLE-A-0101`.
- Choose Plastic, type 2.4, Save, Confirm → the Done screen shows "+24 points" (with a sample rate of 10).
- Back on resident 1, refresh Rewards → History → the new 2.4 kg Plastic entry is at the top.
- Tap "Type unit code instead" and enter `SAMPLE-B-0101` → it also works.

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

Stop after verification. Do not start Card 07.

## Status

Done. Agent tested the manual flow and security as collector1; learner tested real QR scanning and replied `continue`.
