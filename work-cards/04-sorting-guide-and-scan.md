# Work Card 04: Resident Sorting Guide and Photo Scan

## Goal

Residents can search the sorting guide in English or Malay, open an item's details, and photograph an item to get a suggested guide entry, with a manual fallback. Home gets its layout with the search bar.

## Inputs

- `design.md` → Resident screens → Home, Guide, Scan; States
- `architecture.md` → User Flows 1 and 2; `waste_items.model_labels`

## Files likely touched

`src/pages/resident/Home.jsx`, `src/pages/resident/Guide.jsx`, `src/pages/resident/Scan.jsx`, `src/lib/api.js`, `src/lib/classify.js`, `src/components/GlassCard.jsx`, `src/components/Chip.jsx`, `src/components/EmptyState.jsx`, `src/components/ErrorState.jsx`, `package.json`

## Instructions for the coding agent

1. `npm install @tensorflow/tfjs @tensorflow-models/mobilenet`.
2. `api.js`: `listCategories()`, `listWasteItems()`; cache the guide in memory and in `localStorage` (key `kitar.guide.v1`) so the guide still works offline after the first load.
3. **Home** (layout only for now): greeting with the unit code, notification icon button, a hero card placeholder ("Points appear after your first collection", filled in Card 07), "Next collection" card with a sample date, and the search bar. Submitting the search opens `/resident/guide?q=…`.
4. **Guide**: search input (matches `name_en`, `name_ms` and `keywords`, case-insensitive), horizontal category chips, item cards per `design.md`, and an item detail bottom sheet with bin colour, numbered steps and the category points rate. Empty result: "No match. Try another word, or ask your collector."
5. **Scan**:
   - `classify.js` loads TensorFlow.js and MobileNet with dynamic `import()` the first time Scan opens, and returns the top 3 predictions.
   - Camera via `getUserMedia` (rear camera, `facingMode: 'environment'`) in a full-screen view with orange corner brackets; a capture button; "Starting camera…" state.
   - After capture: progress ring "Recognising…", then match predictions against `waste_items.model_labels`. If a match is found, show the result card (name EN + BM, bin, first step, "See full guide"). If not, show "We couldn't recognise this" with the manual option.
   - Always show "Not right? Choose manually" → Guide search.
   - Camera permission denied: explain how to allow it and offer manual search.
   - Primary button: "Scan again".

## What not to do

- No cloud vision API and no API keys.
- No points or rewards for scanning: points only come from weighed collections.
- Do not build My Bag or Rewards yet.

## Done when

- Guide search returns correct items for English and Malay words.
- Scan opens the camera, classifies a photo, and either shows a matched guide entry or the manual fallback.
- The guide works after going offline once it has loaded.

## Verification steps

- Search "kotak" and "carton" → both find the drink carton item.
- Search "polystyrene" → item shows "Not recyclable here".
- Photograph a plastic bottle with the desktop webcam → suggestion links to the PET bottle entry, or the fallback appears.
- DevTools → Network → Offline, reload Guide → items still show and the offline state from `design.md` appears.
- Design check: Guide chips and item cards, Scan corner brackets, progress ring and result card follow `design.md` → Resident screens.

## Localhost test before continuing

After this card, the learner should test:

- Home → type "botol" in the search bar → Guide opens with matching bottle items.
- Guide → tap a category chip → the list filters; tap an item → the detail sheet shows the bin and steps.
- Scan → allow the camera → photograph a bottle or can → a result card or "Not right? Choose manually" appears.
- Camera on a phone needs HTTPS: test on the desktop webcam now; the phone test happens in Card 08 on Vercel.

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

Stop after verification. Do not start Card 05.

## Status

Done. Learner tested the camera, single and pile scans, and ran `supabase/updates/0004_guide_wording.sql`; replied `continue`.
