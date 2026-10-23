# Kitar: 3-Minute Demo Script

## Setup (before the pitch)

| Device | Signed in as | Screen to leave open |
|---|---|---|
| Phone A (presenter) | `resident1@demo.test` | My Bag (QR code), screen brightness up |
| Phone B (teammate) | `collector1@demo.test` | Collector → Scan bag |
| Laptop on the projector | `admin@demo.test` | Sustainability dashboard, Month = this month |

- Open the live Vercel URL on every device the day before (wakes the free Supabase project and caches the app and the scan model).
- On Phone A, open Scan once so the photo model is already downloaded.
- Have a drink carton and an aluminium can on the table.
- Put the QR code of the Vercel URL on the pitch slide.

## The flow

| Time | Who / device | Do | Say (one line) |
|---|---|---|---|
| 0:00 | Slide → judges' phones | Judges scan the slide QR; the landing page opens | "Kitar turns township recycling into a measured habit, here's the five-step loop." |
| 0:20 | Laptop | Scroll the landing page to "How it works", then press "Try the demo" | "Residents, collectors and SDP each have their own screen." |
| 0:35 | Phone A | Resident Home → Scan → One item → photograph the drink carton | "On-device AI says it's a carton, and shows the bin and how to prepare it, in English and Malay." |
| 1:00 | Phone A | Switch to "A pile" → photograph the can and the carton together | "Most people bring a pile; Kitar sorts the whole pile by bin." |
| 1:20 | Phone A | My Bag → show the QR code | "Every unit has a QR bag label. No names, just a random code." |
| 1:35 | Phone B | Scan Phone A's QR → Plastic → 2.4 → Save → Confirm | "The collector weighs and scans. This is the step that makes it verified." |
| 2:00 | Phone B | Done screen: "+24 points for this unit" | "Points only come from weighed bags, never from photos." |
| 2:10 | Phone A | Rewards → History, then Leaderboard | "The resident sees the 2.4 kg, their points and their township's rank." |
| 2:30 | Laptop | Refresh the dashboard | "SDP sees verified kilograms by township, category and month, ready for Zero Waste 2030 tracking." |
| 2:50 | Laptop | Back to the landing page "Start with one township" | "We propose a 3-month pilot in one strata township." |

## Backup plan

| Problem | Do this instead |
|---|---|
| Camera won't open | Scan → "Upload a photo" with a photo saved on the phone; Collector → "Type unit code instead" → `SAMPLE-A-0101` |
| Photo scan gets it wrong | Tap "Not right? Choose manually" and say: "residents can always pick it from the guide" |
| Slow or no Wi-Fi | Use a phone hotspot; the guide works offline, but saving a collection needs a connection |
| Live demo fails completely | Play the screen recording of this script (record it on Phone A and Phone B the day before) |
| Someone asks about the numbers | "Everything here is sample data. With SDP's real data, the dashboard fills itself." |

## Reset after rehearsals

Every rehearsal saves a real collection. That's fine for the demo (points and kilograms go up). To remove rehearsal rows, delete them in Supabase → Table Editor → `collections` (sort by `collected_at`, newest first). Running `supabase/updates/0005_reseed_sample_collections.sql` again only regenerates the Saturday sample rows; it does not remove collections saved through the app.
