# Build Status

## Project

- Name: Kitar (confirmed)
- Build shape: Supabase-backed PWA (approved expansion)
- Shape confirmation: Confirmed
- Current KDBM Lite stage: Build
- Current phase: Ready to Build
- Current work card: `work-cards/08-pwa-deploy-demo.md`

## Completed

- [x] 00 Setup Gate
- [x] Project Brief: confirmed
- [x] Architecture: confirmed
- [x] Design: confirmed (dark premium style from the learner's references, dark orange `#C8641E` accent)
- [x] Build Blueprint
- [x] Work Cards 01–08 written
- [x] 01 Project skeleton + PWA shell
- [x] 02 Supabase schema, RLS and seed data
- [x] 03 Demo login and role routing
- [x] 04 Resident: sorting guide and photo scan
- [x] 05 Resident: QR bag and history
- [x] 06 Collector: scan QR and record weight
- [x] 07 Rewards, leaderboard and admin dashboard
- [x] 07b Landing page (added at the learner's request; `/` becomes the landing page, login moves to `/login`)
- [ ] 08 PWA polish, deploy and demo script

## In progress

- [ ] Work Card 08: app polish, README, demo script and first local commit done; waiting for the learner's go-ahead to create the GitHub repo and deploy on Vercel

### Work Card 08 notes (so far)

- `OfflineBanner` (global, sticky, gold) and `InstallCard` (app routes only; from the 2nd visit; Install button where the browser offers it, "Share → Add to Home Screen" on iPhone; "Not now" remembered).
- Service worker: precaches the app shell, icons and Poppins (`js, css, html, svg, png, woff2`; ~2.2 MB, 21 entries); the 27 MB ONNX `.wasm` is runtime-cached on first scan; `navigateFallback` to `index.html`; Supabase calls are never cached.
- `vercel.json` rewrites all paths to `/index.html`.
- Icons kept: the existing orange rounded square with a white "K" (192, 512, maskable 512, apple-touch 180) already meet the card's spec.
- `README.md` rewritten (what Kitar is, roles, stack, local run, DB setup order including updates 0004 and 0005, scan-label regeneration, deploy steps). `demo-script.md`: device setup, a 3-minute timed flow (landing → single and pile scan → QR bag → collector save → resident history and leaderboard → admin dashboard → rollout), backup plan and how to clean up rehearsal rows.
- Agent checks: offline banner appears on an `offline` event and hides on `online`; build passes.
- Secret check before the first commit: no `service_role` key, no JWT-shaped or `sb_` keys and no Supabase project URL anywhere outside the git-ignored `.env.local`; only `.env.example` (empty values) is staged.
- `git init -b main` and first commit `5c8a702` (141 files) using the learner's existing Git identity. Not pushed. GitHub CLI is signed in as `teohweibin`.

### Work Card 07b notes

- Routes: `/` → `Landing` (public), `/login` → `Login` (now has a back button to `/`). `RequireRole` and `SignOutButton` send signed-out users to `/login`. PWA `start_url` is `/login`, so the installed app opens straight to sign-in (signed-in users are forwarded to their home).
- Landing: hero ("Kitar." wordmark, "Recycle, verified.", one-sentence pitch, primary button, "How it works" link, disclaimer); The Story cards 1–4 with filled orange badges and an orange rule; The Proof cards 5–8 with outlined badges and a light-orange rule; card 5 is a 5-step icon stepper; "See it working" call-to-action card; footer with the disclaimer and "Built with React and Supabase as a student prototype". No database reads, no numbers beyond the brief, no SDP logo.
- Primary button: signed out "Try the demo" → `/login`; signed in "Open my Kitar" → role home.
- Agent checks (signed in as resident 1): 375 px → 1 column, no sideways scroll, button "Open my Kitar → /resident/home"; 1100 px → 4 columns per section, matching the learner's reference structure; "How it works" scrolls to card 5. Build passes.
- Not checked by the agent: the signed-out view (needs signing out of the learner's session).

### Work Card 07b redesign: scroll-driven landing page

- Learner feedback: the page should not copy the reference grid card for card; it should be a normal product landing page (what Kitar is, what it does, how it works, impact…) with a scroll-driven, interactive layout. Second reference: a dark hero with a centred headline, a glowing 3D shape and floating glass stat cards.
- New sections: sticky blurred pill nav (brand, How it works / Impact / Rollout links from 900 px, Log in, primary pill); hero "Recycling, verified." with lead, primary button and "See how it works", plus a CSS-only glowing orange orb (morphing, rotating ring) with three floating glass cards showing sample UI ("Plastic · 2.4 kg · Verified", "#1 of 3 townships", "+24 points"), all labelled sample; Problem statement with three tiles; How it works with a sticky phone mockup whose screen changes as each of the 5 steps scrolls past (dots show progress); Who it's for (residents, collectors, SDP team); Impact (4 points); Feasibility & rollout timeline (Month 0 → Months 1–3 → Month 4 → Then); closing "See it working" call to action; footer disclaimer.
- Motion: `useReveal` (IntersectionObserver fades sections in), `useScrollVars` (scroll position → CSS variables for a top progress bar and hero parallax, one update per frame), `useActiveStep` (which step is in the reading zone; lower zone on phones because the sticky phone covers the top). All motion is off under `prefers-reduced-motion`.
- `LandingPhone`: five HTML/CSS mini screens (scan result, QR bag, collector weigh, points, township bars), no screenshots.
- Content stays within the brief; no invented statistics; no SDP logo. The sample pill ("Concept prototype · sample data") was also removed from the landing hero at the learner's request (it stays on every in-app screen); the footer (disclaimer + "Built with React and Supabase as a student prototype") was removed at the learner's request.
- Agent checks: 960 px and 375 px — no sideways scroll; steps 1–5 switch the phone screen 1–5 in order on both widths; on phones the step text sits below the sticky phone; problem and impact sections reveal when scrolled to; the progress bar fills. Build passes.

### Work Card 07 notes

- Installed `recharts` 3.10.1. Loaded the dataviz skill: single-series charts, no legend, 2 px line / 4 px rounded bar ends, recessive grid, hover tooltips, text in text tokens. Validator: `#C8641E` passes lightness, chroma and contrast on the dark card surface (the CVD "fail" is only against its own hover shade, which is a state, not a series).
- `api.js`: `getMyPoints` (`unit_points`), `getLeaderboard` (RPC, this calendar month), `getAdminData` (all collections + units; RLS lets only admins see all); `getMyUnit` now also returns `township_id`.
- `src/lib/tiers.js`: sample tiers Bronze 0 / Silver 500 / Gold 1500; progress floored (1499 shows 99 %).
- `useResidentRewards` hook; `PointsHero` card (gold coin balance, "#N of 3 this month" chip, progress bar with glowing handle, "Rewards are sample values in this prototype").
- Home: points hero replaces the placeholder. Rewards: hero with progress above the tabs; Leaderboard tab ranks townships by kg per taking-part unit, shows participation % and total kg, highlights "Your township"; empty state when the month has no collections.
- Admin dashboard: month + township filters, "All figures come from sample data"; 4 stat cards (total kg, units taking part %, collections, CO2e estimate shown as "–" with "Add a cited emission factor…" because the seed has no cited factors); charts: kg per month (area, ignores the month filter), kg per township (columns), kg per category (horizontal bars); latest 20 collections table with unit code, township, category, kg and a short collector code (no names). Layout 1 column on phones, 2 at ≥ 640 px, 4 stat columns and 2 chart columns at ≥ 1024 px.
- `src/lib/dashboard.js` aggregation tested in Node on a small fixture (totals, participation 2/3 = 67 %, month and township filters, month trend unaffected by the month filter, latest-row shape); tier logic tested.
- Live checks as collector1: `/admin` redirects to `/collector/scan`; the leaderboard RPC returns only township-level columns (no unit ids or codes).
- Admin check (learner signed in as admin@demo.test in the pane): at 1024 px the 4 stat cards sit in one row and the charts in two columns with the month chart full width; at 375 px everything stacks, no page-level sideways scroll, the table scrolls inside its card. Filters work: all time 982.1 kg / 650 collections / 18 of 30 units; October 2026 253.4 kg / 164; October + Taman Sample Damai 87.8 kg / 55 / 6 of 10 units. CO2e shows "–" with the cited-factor note. Admin can read all 4 profiles and 30 units, but insert is blocked and update/delete change 0 rows.
- Bug found in the sample data: in Postgres the seed's bare `random()` filters were evaluated once per input table, so only 18 of 30 units had data (exactly 36 rows each) and only paper, plastic and metal appeared. Fixed `seed.sql` (random draws in LATERAL subqueries tied to the outer row) and added `supabase/updates/0005_reseed_sample_collections.sql`, which deletes only the old seed-pattern rows (collector1, Saturday 10:00–13:00 in the session time zone) and re-inserts. Tested on PGlite: fresh seed → 573 rows, 30 units, 8 categories, 4–33 rows per unit; 0005 on top keeps an app-made Friday row and replaces the sample rows.
- The current month on the trend chart is labelled "(so far)" so its partial total does not read as a decline.

### Review Mirror after Card 07

- First pass: NEEDS FIX (data only).
- Second pass, after the learner ran update 0005 and signed in as resident 1: PASS. Leaderboard per month now varies (e.g. October: Hijau 10/10 units 9.79 kg/unit, Indah 6/10 6.58, Damai 10/10 5.52; August and September have all three townships active). Resident 1 has 24 collections across 6 categories; the app-made 2.4 kg Plastic row of 23 Oct was kept. Home: 281 points, "#1 of 3 this month". Rewards: "Bronze · 56% to Silver" (281/500), leaderboard with "Your township" on Hijau, no sideways scroll at 375 px.
- 1. Sample data looked artificial (fixed in code; the learner must run update 0005 in Supabase).
- 2. Resident points hero and leaderboard not yet seen by the agent signed in as a resident.
- 3. Minor: the Scan lint warning (`set-state-in-effect`) is a known false positive.
- Security: RLS holds for all three roles (resident, collector and admin checks above); no secrets in code; no SDP branding; every screen has the sample pill.

### Work Card 06 notes

- Installed `html5-qrcode` 2.3.8.
- `api.js`: `findUnitByToken`, `findUnitByCode` (uppercased), `listCategories`, `insertCollection` (sets `collector_id` to the signed-in user; RLS does the real check), `countMyCollectionsToday`.
- `CollectorHeader`: top bar with sign-out, Scan → Weigh → Done step indicator, "Today: N bags" chip. `CollectorLayout` applies the outdoor rules (solid cards, white text, 16 px base).
- Scan bag: rear-camera QR reader inside an orange frame; unknown QR → "This QR is not a Kitar bag" (1.5 s pause before re-checking); camera blocked/unavailable → message and the manual form opens; "Type unit code instead" → lookup by unit code. The unit (id, code, township, no names) is passed to Weigh through router state.
- Weigh: unit code in 30 px monospace, 8 category tiles (2 columns), 56 px weight display, `Keypad` (64 px keys), "Save collection" enabled only with a category and a valid weight, confirm sheet "Save 2.4 kg Plastic for SAMPLE-A-0101?" with "Saved collections can't be edited", Confirm disabled while saving (no double insert). Opening Weigh or Done directly (e.g. after a refresh) returns to Scan.
- Done: green check, "Saved", unit · category · kg, "+N points for this unit", "Scan next bag".
- `src/lib/weight.js` keypad rules tested in Node: "2.4" ok; a second "." is ignored; "51" is refused (stays "5"); max 2 decimals; "07" becomes "7"; "." first gives "0."; "2." and "0" are not valid weights.
- Agent checks in the preview pane (signed in as resident 1): `/collector/scan` redirects to the resident home; a resident insert into `collections` from the console is blocked by RLS. Build passes; lint shows only the known Scan warning.
- After the learner signed in as collector1 in the preview pane, the agent tested at 375 px: unknown code "sample-z-9999" → "No unit called SAMPLE-Z-9999…"; "sample-a-0101" → Weigh shows SAMPLE-A-0101 · Taman Sample Hijau; Plastic + keypad 2 . 4 → confirm sheet "Save 2.4 kg Plastic for SAMPLE-A-0101?" → Done "+24 points for this unit", "Today: 1 bag". This saved one real test collection (2.4 kg Plastic, SAMPLE-A-0101) in the learner's Supabase project.
- Collector security checks from the console: the saved row has `collector_id` = the collector; inserting with another collector's id is blocked by RLS; 60 kg is blocked by the check constraint; update and delete change 0 rows (weight still 2.4); only the collector's own profile is visible.
- Fixes after the test: "Save collection" now sits in an opaque sticky footer (reachable without scrolling, never covers a key once scrolled to the bottom); category tiles have `aria-label`s.
- Still not tested: scanning a real bag QR with a camera (the pane has none).

### Work Card 05 notes

- Installed `qrcode`. `QrCard` renders the unit's `qr_token` only (error correction M) as an SVG on a white card with "Kitar recycling bag", the unit code in monospace and the township name.
- My Bag: QR card, instruction, "Print label" (`window.print()`), screen-brightness tip; loading skeleton and error with retry.
- `src/styles/print.css`: printing shows only `.print-label`, on A6, QR 70 mm wide.
- `api.js`: `listMyCollections()` (newest first, category names, points = kg × sample rate, rounded).
- Rewards: History | Leaderboard tabs (`?tab=leaderboard`); history cards with category icon, "Plastic · 2.5 kg", date, gold points, "Verified" chip; empty state with "Show my QR"; leaderboard tab says "Coming soon" until Card 07.
- Agent checks as resident 1 (preview pane, 375 px): My Bag shows the QR with SAMPLE-A-0101 · Taman Sample Hijau; History lists the unit's sample collections (e.g. Metal 0.7 kg → 11 points at the sample 15/kg). Console checks: `units` returns only SAMPLE-A-0101, `collections` returns 36 rows from 1 unit, `profiles` returns only the resident's own row.
- Not checked by the agent: scanning the QR with a phone camera (the pane has no camera and no BarcodeDetector), print preview, and resident 2's view.

### Work Card 04 notes

- (Superseded by the MobileCLIP follow-up below) Originally used MobileNet via TensorFlow.js.
- `api.js`: `getMyUnit()` and `listGuide()`; the guide is saved to `localStorage` (`kitar.guide.v1`) and used when the network fails.
- `src/lib/guide.js`: search across EN/BM names, keywords and category names (every word must match); MobileNet prediction → guide item matching via `model_labels`; bin labels.
- New components: `CategoryIcon`, `Chip` + `BinDot`, `BottomSheet`, `ItemDetail`, `StateViews` (empty, error, skeleton list); hook `useGuide`.
- Home: greeting with unit code and township, hero card placeholder for points (filled in Card 07), search bar → Guide, next collection card (next Saturday 9:00 AM, labelled sample).
- Guide: search, category chips (plus "Not recyclable"), item cards, detail bottom sheet; search, filter and open item live in the URL (`?q=`, `?cat=`, `?item=`).
- Scan: rear camera with orange corner brackets, Take photo → "Recognising…" ring → result card (best match, bin, first step, "See full guide", other possible matches) or "We couldn't recognise this" with the model's guess; camera denied / unavailable messages; extra "Upload a photo" option (works where the camera is blocked); "Not right? Choose manually" always visible.
- Agent checks: build passes; lint passes with one warning (`set-state-in-effect` on the Scan mount effect; state is only set after the camera answers, so it is a false positive); search logic tested ("kotak" → drink carton + cardboard, "carton" → drink carton, "polystyrene" → not recyclable, "botol plastik" → PET bottle); MobileNet loads and classifies in the browser (about 15 s on the first load in dev).
- For Card 08: the precache is about 1.3 MB; the 27 MB ONNX WebAssembly runtime is excluded from precache and runtime-cached on first scan.

### Work Card 04 follow-up: switched photo scan to MobileCLIP

- Why: MobileNet (ImageNet) has no "can" class, so drink cans and many guide items could never match; the learner also got a black camera frame classified as "candle".
- Removed `@tensorflow/tfjs` and `@tensorflow-models/mobilenet`; added `@huggingface/transformers` 4.3.1.
- `src/data/scanLabels.json`: 1–4 English prompts per guide item (keyed by `waste_items.name_en`) plus "not a waste item" prompts (face, hand, room, table, pet, blurry).
- `scripts/build-scan-embeddings.mjs` (`npm run build:scan-embeddings`): computes normalised MobileCLIP text embeddings in Node with the fp32 text model and writes `src/data/scanEmbeddings.json` (64 prompts × 512 dims). Phones never download the text model.
- `src/lib/scanScoring.js`: cosine similarity × 100 → softmax → probability per item; accept the best item at ≥ 35 %; average-brightness check (< 25/255 = too dark).
- `src/lib/classify.js`: loads the MobileCLIP vision model (fp16, ~23 MB) and the embeddings with dynamic `import()`, reports download progress.
- Tested in Node on 8 public Wikimedia Commons photos: q8 vision model was unusable (all wrong), fp16 matched fp32. fp16 results: aluminium cans 99 %, Tetra Pak cartons 75 %, mobile phone 100 %, plastic water bottle 74 %, glass beer bottles split PET 52 % / glass 47 % (wrong but close), hard plastic container 77 %; photos of a person and a skateboarder were rejected.
- Tested in the browser: cans → Aluminium drink can 96 % (Orange bin), cartons → Drink carton 74 % (Blue bin); about 0.7 s per photo after the model loads; a near-black photo shows "This photo is too dark".
- Fixed a display bug: the hidden camera `<video>` stayed visible (CSS `display: block` overrode `hidden`) and covered the photo, which is likely why the learner saw a black frame.
- Still untested: a real camera capture (the preview pane blocks cameras) and accuracy on Malaysian packaging.
- Learner's own tin-can photo: Food tin 100 % (Aluminium drink can 0 %).

### Guide wording update (0004)

- `supabase/updates/0004_guide_wording.sql` (run after `seed.sql`; safe to re-run): adds `waste_items.prep_steps_ms`; rewrites all 31 items' steps in English and Malay; e-waste, textiles and cooking oil end with "bring it to your township recycling point and hand it to the collector (keep it out of your QR bag)"; drink cartons go in the QR bag and the collector sorts them (category `carton` bin → `qr-bag`).
- App: bin labels now "QR bag (collector sorts)" and "Hand to collector" (was "Drop-off point"); the item detail shows each Malay step under the English one; pile groups include the QR-bag group; offline guide cache key bumped to `kitar.guide.v2`.
- Tested on PGlite: all 31 items have Malay steps with matching counts; re-running is harmless. The app works before and after the update is run.

### Work Card 04 follow-up: "A pile" scan mode

- Learner asked for scanning several items in one photo.
- `scanScoring.js`: `gridCrops()` (3×3 overlapping half-size crops), `mergePileScores()` (keep each crop's best item at ≥ 50 %, highest probability per item), `PILE_MIN_CONFIDENCE`.
- `classify.js`: `classifyPile(canvas, onStep)` scores the whole photo plus 9 crops (10 passes) and reports progress.
- Scan screen: "One item | A pile" toggle; pile tip "Spread the items out…"; progress "Checking part N of 10…"; pile photos kept at up to 768 px.
- `PileResult` component: "Found N items", groups Blue bin → Orange bin → Brown bin → Drop-off point → Not recyclable, each item links to its guide entry and has a 44 px remove button; "Add an item we missed…" select. Nothing is saved.
- Node experiment before building: a 2×2 composite (can, water bottle, phone, tin) gave only "Aluminium drink can" on the whole photo but all four with the grid.
- Browser test (composite of cans, water bottle, phones, Tetra Pak shelf): 6.1 s on a laptop; found drink carton, aluminium can, PET bottle, mobile phone, plus one wrong "Used batteries" (from the cans), which the remove button cleared; adding "Food tin" from the select placed it under Orange bin.
- Limits: tested on tidy composites, not on real overlapping piles; small items (caps, straws) are often missed; expect slower runs on phones.
- After the learner signed in as resident 1 in the preview pane, the agent checked the signed-in screens at 375 px: Home shows `SAMPLE-A-0101 · Taman Sample Hijau`; Guide loads live data from Supabase ("kotak" → cardboard box, drink carton, greasy pizza box) and the detail sheet shows the bin, sample rate and numbered steps; Scan shows the "Camera permission is off" notice (the preview pane blocks cameras) with the upload and manual options.
- Small fixes after the review: Home hero text no longer mentions work cards; the camera retry button reads "Try the camera again" until a photo has been taken.
- Still untested: a real camera photo and the upload flow (needs the learner's own browser).

### Work Card 03 notes

- `src/lib/authContext.js` (context, `useAuth`, `homeFor`) and `src/lib/auth.jsx` (`AuthProvider`, `RequireRole`), split so the lint rule for component-only files stays clean.
- Session from `getSession` + `onAuthStateChange`; profile loaded from `profiles` per user id; a signed-in account without a profile sees `NoProfileScreen`.
- `/resident/*`, `/collector/*` and `/admin` are wrapped in `RequireRole`; wrong role → own home; signed out → `/`.
- Login page per design.md: "Kitar." wordmark (text only), tagline, email + password, error alert, disabled button until both are filled, demo account list (emails only, tap to fill the email).
- `SignOutButton` in the top bar of resident Home, collector Scan bag and the admin dashboard.
- Shared `src/styles/controls.css`: buttons, inputs, alert, skeleton shimmer. `LoadingScreen` for auth loading.
- Removed the Card 02 `SupabaseCheck` test.
- Agent checks: build and lint pass; signed out, `/resident/home`, `/admin` and `/collector/weigh` all redirect to `/`; demo account tap fills the email; no horizontal scroll at 375 px. The agent did not sign in (it has no demo passwords and does not enter passwords).

### Work Card 02 notes

- `supabase/migrations/0001_schema.sql`, `0002_rls.sql`, `0003_views_functions.sql`, `supabase/seed.sql` written.
- Small change from architecture.md: `waste_items.prep_steps` is `text[]` (numbered steps) instead of `text`; `waste_items.name_en` is unique so the seed can be re-run; explicit grants added so the tables work even if the project does not auto-expose new tables.
- Agent tested all SQL on a local PGlite database with a stub `auth` schema: migrations and seed run (3 townships, 30 units, 8 categories, 31 guide items, 4 profiles, ~680 sample collections); seed refuses to run before the demo users exist and is safe to re-run.
- RLS checks passed locally: anon reads nothing; resident 1 sees only unit SAMPLE-A-0101 and its collections and only their own profile; resident cannot insert; collector can insert only as themselves; update/delete denied; weight over 50 kg rejected; leaderboard returns township totals only and is denied to anon.
- `src/lib/supabase.js` (anon key from env; exposes `window.supabase` in dev only), `src/lib/api.js` (`listTownships`), temporary `SupabaseCheck` on the login page.
- `.env.local` created with empty values (git-ignored); the learner pasted the Project URL and anon key (agent checked: URL is a supabase.co project, key role is `anon`).
- Learner ran 0001 (chose "Run and enable RLS"), 0002, 0003, created the four demo users, and ran the seed.
- Live checks against the learner's Supabase project, signed out: connection works; every table and `unit_points` return 0 rows; the leaderboard RPC is denied; an insert into `collections` is blocked by RLS.

### Work Card 01 notes

- Scaffolded with create-vite 9.2.1 (React 19, Vite 8), moved into the project root; package name `kitar`.
- Installed: react-router-dom, lucide-react, @fontsource/poppins (Latin subsets), vite-plugin-pwa.
- Added: `src/styles/tokens.css` (all design.md tokens, warm glow, focus ring, reduced motion), `TopBar`, `SampleBadge`, `BottomNav` (raised orange Scan button), `GlassCard`, `PlaceholderScreen`, `ResidentLayout`, `CollectorLayout`, placeholder pages for every route.
- PWA manifest and service worker via vite-plugin-pwa; placeholder icons (orange square, white "K") in `public/icons/`.
- `.gitignore` covers `.env*` except `.env.example`; `.env.example` lists the two variable names with empty values.
- `.claude/launch.json` added for the preview pane (`npm run dev` on port 5173).
- Agent checks passed: `npm run build`, `npm run lint`, all routes render, bottom nav links work, no horizontal scroll at 375 px, no console errors.
- Small deviation from design.md: the sample pill sits on its own row above the title (right-aligned) because it does not fit beside a centred title at 375 px.

## Blockers

- None recorded yet

## Decisions made

- Stack: Vite + React PWA, Supabase (DB, Auth, RLS), Vercel hosting
- Data model: 6 tables, RLS on all, leaderboard via aggregate-only function
- Roles: resident, collector, admin
- Photo scan: MobileCLIP (Hugging Face `Xenova/mobileclip_s0`, fp16 vision model) in the browser, zero-shot against precomputed guide-item prompt embeddings; dark-photo check; manual fallback (switched from MobileNet at the learner's request)
- Design: dark premium, glass cards, Poppins, dark orange accent, gold points, no wallet language
- Deployment target: Vercel
- Later (decided, not built): Hybrid photo scan: keep on-device MobileCLIP first; when it is unsure, in "A pile" mode, or when the resident taps "Ask AI", call a cloud vision model (Gemini, Grok or Claude, provider to be chosen) through a Supabase Edge Function with the key in Supabase Secrets, the guide item list in the prompt, JSON-only answers (item id or "unknown" + material), a per-user daily limit, and a notice that the photo is sent to a third party.
- Judge access (learner decision, revised): password-free. The "Try as Resident / Collector / Admin" buttons on `/login` call `supabase.auth.signInAnonymously()` and then the `start_demo_session(role)` RPC from `supabase/updates/0006_demo_sessions.sql`, which gives the anonymous user a demo profile (resident → unit SAMPLE-A-0101, collector, or admin). The RPC refuses non-anonymous users, so real and seeded accounts cannot be changed. No password or key is added to the bundle. The earlier shared-password idea (`VITE_DEMO_PASSWORD`) was dropped. Trade-offs: anyone with the link can open any role (admin is read-only; collector can add collections up to 50 kg); each tap creates an anonymous auth user; switching anonymous sign-ins off ends the demo.
- Password-free demo verified live (after the learner turned on and saved "Allow anonymous sign-ins" and ran update 0006): Supabase reports `anonymous_users: true`. "Try as Resident" → `/resident/home`, anonymous, profile "Demo resident", only unit SAMPLE-A-0101, 281 points, "#1 of 3 this month". "Try as Collector" → `/collector/scan`, "Demo collector", "Today: 0 bags"; unit lookup SAMPLE-A-0101 opens Weigh with 8 categories (no collection saved). "Try as Admin" → `/admin`, 749.1 kg / 30 of 30 units / 575 collections; insert blocked; `start_demo_session('superuser')` rejected. Each tap adds one anonymous user and profile (7 profiles visible to admin after the test).
- Login page (learner decision): the e-mail/password form and the presenter account list were removed; `/login` now only offers the three password-free "Try as …" buttons. The four seeded demo accounts still exist in Supabase (the agent and the demo script no longer need them to sign in), and `signIn` stays in the auth context for later use.
- Sample labels (learner decision): the "Concept prototype · sample data" pill was removed from every screen (`SampleBadge` deleted; `TopBar` has no badge row), and the landing page's floating cards and phone mockup no longer say "sample". This overrides the pill rule in `design.md`. Still present: "All figures come from sample data." on the admin dashboard, "Rewards are sample values in this prototype." under the points progress bar, "(sample)" after the next-collection place on resident Home, and the `SAMPLE-` unit codes.
- Guide accuracy (learner decision): the sorting guide stays as sample content written from general knowledge, judged on available information, logic and whether residents understand it. No "unverified" label in the demo. Official SWCorp / council verification happens only if Kitar reaches the finalists, when SDP can supply accurate data. Agent's partial check: separation-at-source states, DOE/MCMC e-waste drop-off and used-cooking-oil schemes have news sources; orange = plastic/metal, brown = glass, Tetra Pak in the blue bin, polystyrene not recyclable and all preparation steps are unconfirmed.
- Work cards: nine (01–08 plus 07b Landing page, added after planning; brief, architecture, blueprint and card-writer prompt updated)

## Last verified state

- Coding workspace: file read/write and terminal working
- Node: v24.16.0
- npm: 11.13.0
- Git: 2.53.0.windows.2
- Supabase account: Ready
- GitHub account: Ready
- Vercel account: Ready
- Localhost: running at http://localhost:5173 (Work Card 01 shell)
- Live URL: None yet
- Build: `npm run build` passes

## Next instruction for AI

Read `build-status.md`, `build-blueprint.md`, `design.md`, and `work-cards/08-pwa-deploy-demo.md`. Implement only Work Card 08. Stop after verification and update `build-status.md`.
