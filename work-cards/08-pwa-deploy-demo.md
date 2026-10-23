# Work Card 08: PWA Polish, Deploy and Demo Script

## Goal

Kitar installs on a phone, behaves sensibly offline, is live on Vercel, works end to end on real phones, and has a 3-minute demo script.

## Inputs

- `design.md` → States (Offline, PWA install), Mobile Rules, Design Verification Checklist
- `prompts/08-github-vercel-proof.md`
- `project-brief.md` → Version-One Success

## Files likely touched

`public/icons/`, `vite.config.js`, `src/components/OfflineBanner.jsx`, `src/components/InstallCard.jsx`, `src/App.jsx`, `vercel.json`, `demo-script.md`, `README.md`, `build-status.md`

## Instructions for the coding agent

1. Icons: final 192, 512 and maskable 512 px PNGs (orange `#C8641E` rounded square with a simple white "K" or recycling arrow; no logos copied from anywhere). Add an `apple-touch-icon`.
2. Service worker: precache the app shell; runtime-cache Poppins (cache-first); the ONNX `.wasm` runtime is already runtime-cached and the MobileCLIP weights are cached by transformers.js so Scan works faster on later visits; network-only for Supabase API calls.
3. `OfflineBanner` using `navigator.onLine` and the `online`/`offline` events, text from `design.md`.
4. `InstallCard`: listen for `beforeinstallprompt`; show after the second visit (count in `localStorage`); on iPhone show "Share → Add to Home Screen" instructions instead.
5. Phone-width pass at 375 px on every screen; fix anything cut off or scrolling sideways.
6. `README.md`: what Kitar is, the concept-prototype disclaimer, how to run locally, env var names, how to run the migrations, the seed and then `supabase/updates/` in order. No secrets, no passwords.
7. Ship by following `prompts/08-github-vercel-proof.md` step by step: secret check → Git → GitHub → Vercel with env vars → `vercel.json` SPA rewrite → Supabase Auth URL configuration.
8. `demo-script.md`: the 3-minute flow from `project-brief.md` → Version-One Success, with who holds which device, what to say at each step (one line), and a backup plan (manual unit code entry, pre-loaded browser tabs, screen recording) if Wi-Fi or the camera fails.
9. Run `prompts/07-review-mirror.md` for the final review.

## What not to do

- No new features: polish and ship only.
- Do not commit `.env.local` or any key other than what Vercel holds in its settings.
- Do not use real people in the demo script.

## Done when

- The Vercel URL opens on Android and iPhone, signs in, and runs the full demo.
- The app installs to the home screen (Android) or can be added to the home screen (iPhone).
- Offline: the app opens, the guide works, and the offline banner shows.
- `demo-script.md` exists and has been run once end to end.

## Verification steps

- Lighthouse (Chrome DevTools) → PWA installable checks pass.
- `git log -p | grep -i service_role` returns nothing.
- On the live URL, refresh `/resident/rewards` → the page loads (no 404).
- Security check: on the live URL, repeat the Card 05 and Card 06 security checks.
- Design check: every item in `design.md` → Design Verification Checklist is ticked.

## Localhost test before continuing

After this card, the learner should test:

- Open the Vercel URL on your phone → sign in as resident 1 → Scan a real bottle with the phone camera.
- On a second phone (or a friend's), sign in as the collector → scan resident 1's QR → save 2.4 kg.
- Resident phone: pull to refresh Rewards → the new entry, points and rank update.
- Laptop: admin dashboard shows the new kilograms.
- Turn on airplane mode on the resident phone → open Kitar from the home screen → the guide works and the offline banner shows.
- Read `demo-script.md` aloud while doing it → it fits in 3 minutes.

If all tests pass, reply `continue`.
If anything fails, reply `fix` and paste the error or describe what you see.

## Stop condition

Stop after the final review. Update `build-status.md` with the live URL, the GitHub URL, the Proof Ladder level reached and `Current KDBM Lite stage: Shipped`.

## Status

Not started
