# Design Direction

> Status: **CONFIRMED** by the learner.

## Design Inspiration URL

Learner-supplied screenshots (five images) of a dark recycling app concept on Dribbble: Home with wallet balance and recycle reminder, Wallet with points and goal progress, Scan Product camera view, History list, Map, Profile and Statistic screens. The original uses teal-green as its main colour; the learner asked for the same premium feel with **dark orange** instead of green.

## What We Borrow

- **Layout**: a hero balance card at the top of Home; stacked glass cards; a bottom navigation bar with a raised round scan button in the centre; full-screen camera with corner brackets and a result card sliding up from the bottom; segmented tabs (pill toggle) to switch lists.
- **Spacing**: generous padding (20 px screen edges, 16–20 px inside cards), 12 px gaps between cards, dashed dividers inside cards.
- **Colour mood**: near-black background with a soft coloured glow behind the top of the screen; semi-transparent cards with thin light borders; one bright accent used sparingly.
- **Typography feel**: geometric sans-serif, medium weight for titles, large bold numbers for balances.
- **Card / button style**: 24 px rounded cards, pill-shaped buttons and tabs, round icon buttons for back and notifications, thin progress bar with a dot handle.
- **Mobile feel**: one-thumb reach, primary action at the bottom, list items with an icon tile on the left and a status on the right.

## What We Do Not Copy

- **Brand / logo**: no logo from the reference, and no Sime Darby Property logo, wordmark, brand colours or township photos.
- **Content / copy**: no "Wallet", "$", "Withdraw" or "Transfer". Kitar has points only, never money.
- **Stats**: no world map or "municipal waste recycled" figures. Every number in Kitar is from the app's own sample records and labelled sample.
- **Photos / identity**: no stock photos of people or bin stations, no avatar photos. Users show as initials in a circle.
- **Exact layout**: screens follow Kitar's own user flow (below), not the reference screen by screen.

## Visual Mood

Premium, warm, calm, night-time, confident.

## Layout Rules

### Every screen

- Top bar: round back button (when not a tab root), title centred, small pill on the right reading **"Concept prototype · sample data"**.
- Background: `--bg` with a warm ember glow (radial gradient of `--primary` at about 18 % opacity) behind the top 300 px.
- One primary action per screen, in orange, at the bottom or as the hero button.

### Resident screens (mobile-first)

Bottom navigation, five items: **Home · Guide · [Scan] · My Bag · Rewards**. Scan is a raised 64 px orange circle in the centre, the same pattern as the reference.

1. **Home**
   - Greeting: "Selamat datang" + unit code (for example `SAMPLE-A-0101`), notification button on the right.
   - Hero glass card with an orange top rim: **points balance** (gold coin icon + big number), township rank chip ("#2 of 3 this month"), and "View rewards" link.
   - "Next collection" card (from the reference's Recycle Reminder): date, time and recycling point name, all sample.
   - Search bar "What do you want to throw away?", which opens Guide with the query.
   - "Recent" list: last 2 collections, then "See all".
2. **Guide**
   - Search bar on top (English or Malay names).
   - Horizontal category chips: All, Paper, Plastic, Metal, Glass, Carton, E-waste, Textile, Cooking oil.
   - Item cards: category icon tile, name in English and Malay underneath, bin colour dot + label, and a "Not recyclable here" chip when it does not belong to any category.
   - Item detail sheet: bin, numbered preparation steps, category points rate.
3. **Scan**
   - Full-screen camera with four orange corner brackets.
   - While classifying: round progress ring in orange with "Recognising…".
   - Result card slides up: item name (EN + BM), bin colour, top preparation step, "See full guide". Secondary link: **"Not right? Choose manually"**, which opens Guide search.
   - Primary button: "Scan again".
4. **My Bag**
   - Large QR code on a **white** card (QR codes need a light background to scan reliably), at least 240 px square.
   - Unit code under it in large monospace text.
   - Instruction: "Show this to the collector, or stick the printed label on your recycling bag."
   - Buttons: "Print label" (primary) and "Make screen brighter" tip.
5. **Rewards**
   - Hero card: points balance, goal progress bar to the next sample reward tier ("70 % to Silver"), line "Rewards are sample values in this prototype".
   - Segmented tabs: **History | Leaderboard**.
   - History cards (from the reference's History): category icon tile, "Plastic · 2.4 kg", date on the right in `--accent-text`, points in gold underneath, "Verified" chip with a check.
   - Leaderboard rows: rank number, township name, kg per participating unit, participation %. The resident's own township has an orange border and a "Your township" tag.

### Collector screens (mobile-first, one-handed use outdoors)

A three-step flow with a step indicator at the top: **Scan → Weigh → Done**. No bottom navigation; a small "Today: 14 bags" chip in the top bar.

1. **Scan bag**: full-screen camera with orange corner brackets and the text "Point at the QR code on the bag". Link at the bottom: "Type unit code instead".
2. **Weigh**
   - Matched unit code in very large text (no names), township name under it.
   - Category grid: 8 large tiles (2 columns × 4 rows), icon + label, selected tile filled orange.
   - Weight display: huge digits with "kg", maximum 50 kg.
   - Custom number keypad: 3 × 4 keys, each at least 64 px tall: 1–9, ".", 0, backspace.
   - Full-width primary button "Save collection", disabled until category and weight are set.
3. **Done**: large check in a green circle, summary line ("SAMPLE-A-0101 · Plastic · 2.4 kg · +24 points"), full-width primary "Scan next bag". No undo: collections are append-only in v1, so the Weigh screen shows a confirm step ("Save 2.4 kg Plastic for SAMPLE-A-0101?") before inserting.

Outdoor rules: on collector screens, use solid `--bg-elev` cards instead of glass blur, pure white text, and text one size larger.

### Admin dashboard (laptop-first, still readable on a phone)

- Top bar: "Kitar · Sustainability dashboard", sample pill, month and township filters.
- Row of 4 stat cards: Total kg recycled, Participating units (%), Collections this month, Estimated CO2e avoided (labelled "estimate", with a source tooltip; hidden if no cited factor).
- Charts, all single-series in orange on dark: kg per month (area line), kg per township (bars), kg per category (horizontal bars).
- Table: latest 20 collections: date, unit code, township, category, kg, collector code. No personal names.
- Layout: 4-column stat row and 2-column chart grid at ≥ 1024 px; single column on a phone.

## Color / Contrast Rules

Dark only. Defined as CSS variables on `:root`:

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0D0A08` | page background |
| `--bg-elev` | `#17120F` | solid cards (collector), sheets |
| `--surface` | `rgba(255, 240, 225, 0.05)` | glass cards |
| `--surface-strong` | `rgba(255, 240, 225, 0.09)` | hover, selected rows |
| `--border` | `rgba(255, 240, 225, 0.10)` | 1 px card borders, dashed dividers |
| `--text` | `#F7F1EA` | main text |
| `--text-muted` | `#A99D92` | secondary text |
| `--primary` | `#C8641E` | dark orange: buttons, scan FAB, selected tabs, chart bars, corner brackets |
| `--primary-hover` | `#DA7430` | button hover / pressed |
| `--on-primary` | `#1A0E05` | text and icons on orange buttons |
| `--accent-text` | `#F29A55` | small orange text and links on dark (higher contrast than `--primary`) |
| `--gold` | `#F2B544` | points coin icon and point numbers only |
| `--success` | `#4CC38A` | "Verified" chip and Done check only |
| `--danger` | `#E5484D` | errors and "Not recyclable here" |

Rules:

- `--primary` is for buttons, icons and large numbers; never for small body text (use `--accent-text`).
- Text on orange buttons uses `--on-primary`, not white.
- Status is never shown by colour alone: chips always have an icon and a word.
- The QR card is the only white surface in the app.

## Typography Feel

- Font: **Poppins** (geometric, like the reference), self-hosted with `@fontsource/poppins` so it works offline.
- Weights: 400 body, 500 labels, 600 titles, 700 big numbers.
- Sizes: body 15 px, small 13 px, card title 17 px, screen title 20 px, hero numbers 32–40 px, collector weight display 56 px.
- All numbers use `font-variant-numeric: tabular-nums`.
- Unit codes use a monospace font.

## Component Style

- **Buttons**: primary is filled `--primary`, 52 px tall, 16 px radius, `--on-primary` text, full width on mobile. Secondary is `--surface-strong` fill with a `--border` outline. Icon buttons are 44 px round glass circles.
- **Cards**: `--surface` fill, 1 px `--border`, 24 px radius, `backdrop-filter: blur(16px)` only on the hero card and the bottom nav (blur is expensive on low-end Android). The hero card has a 1 px orange top rim (gradient from `--primary` to transparent).
- **Inputs**: 52 px tall, `--surface` fill, 16 px radius, search icon on the left, orange 2 px focus ring.
- **Segmented tabs**: pill container in `--surface`; active tab filled `--primary` with `--on-primary` text.
- **Status chips**: 999 px radius, 12 px text, icon + word: Verified (success), Not recyclable here (danger), Sample (muted outline).
- **List items**: 48 px icon tile with an 8 % orange tint, title + subline on the left, value on the right, dashed divider before the footer row.
- **Progress bar**: 6 px track in `--surface-strong`, orange fill, 12 px round handle with a glow.
- **Icons**: `lucide-react` outline icons, 20–24 px. Category icons sit in tinted tiles; no 3D or stock images.

## Mobile Rules

- Design at 375 px wide first; nothing scrolls sideways except the category chip row.
- Bottom nav is fixed and respects `env(safe-area-inset-bottom)`; page content gets matching bottom padding.
- Primary actions sit in the bottom third of the screen.
- Tap targets are at least 44 × 44 px (64 px on the collector keypad).
- Bottom sheets take at most 85 % of the screen height and close by swipe or a close button.

## States

- **Loading**: skeleton cards with a slow shimmer in `--surface-strong`; camera shows "Starting camera…".
- **Empty**: History shows "No collections yet. Drop your first bag at the recycling point" with a "Show my QR" button. Leaderboard shows "No collections this month yet".
- **Error**: card with a danger icon, plain sentence, "Try again" button. Camera permission denied shows how to allow it, plus the manual fallback.
- **Offline**: thin banner under the top bar: "You're offline. The guide still works; collections need a connection."
- **PWA install**: after the second visit, a bottom card: "Add Kitar to your home screen" with Install and Not now.

## Accessibility Basics

- Text contrast at least 4.5:1 (`--text` and `--text-muted` on `--bg` both pass); `--primary` only for large text, icons and buttons.
- Visible 2 px orange focus ring on every interactive element.
- Every icon button has an `aria-label`; the scan FAB is labelled "Scan an item".
- The camera result is announced through an `aria-live` region.
- Animations last 150–250 ms and are turned off under `prefers-reduced-motion`.

## Anti-Slop Rules

- no fake logos and no Sime Darby Property logos or brand assets;
- every screen shows the "Concept prototype · sample data" pill;
- no fake testimonials;
- no fake stats; sample numbers are labelled, CO2e shows its source or is hidden;
- no money symbols or wallet language;
- no lorem ipsum in the final demo;
- one clear primary action per screen;
- readable on phone width;
- glow only behind the top of the screen and on the hero card rim; no random gradient blobs.

## Design Verification Checklist

- [ ] Home's first screen shows the dark background, warm glow, hero points card and bottom nav with the orange scan button.
- [ ] Resident, collector and admin screens follow their layout rules above.
- [ ] Collector flow works one-handed at 375 px with keypad keys at least 64 px.
- [ ] QR code sits on a white card and scans from another phone.
- [ ] No small body text is set in `--primary`.
- [ ] Phone width (375 px) is readable on every screen.
- [ ] Nothing copies the reference's branding, photos or wallet language; no SDP branding.
