# Project Brief

> Status: **CONFIRMED** by the learner (name changed to Kitar; everything else kept).

## Project Identity

- Name: **Kitar** (confirmed; "kitar" is from *kitar semula*, Malay for recycling)
- Type: demo prototype for a pitch to Sime Darby Property (SDP)
- Label on every screen: "Concept prototype · sample data". Not affiliated with or endorsed by SDP.

## One-Sentence Concept

A recycling module for SDP townships: residents learn how to sort, drop recyclables in a bag carrying their unit's QR code, collectors scan and weigh each bag so every kilogram is recorded to that unit, residents earn points and compete by township, and SDP sees verified recycling data on a dashboard.

## Problem Statement

Sime Darby Property has pledged Zero Waste by 2030 and must report Scope 3 emissions, which include waste, to Bursa Malaysia. Its community recycling still depends on manual collection, residents' association volunteers, time-limited campaigns and tracking tools owned by the local council, and its owner app has no recycling feature. As a result, SDP cannot measure recycling unit by unit or township by township, cannot keep residents taking part once a campaign ends, and cannot scale pilots such as the Maintenance Offset Community Recycling Program without adding cost while construction costs are rising.

Figures behind this statement (around 35 t recycled at Bandar Bukit Raja 2017–2020 against a target of about 6,570 t a year by 2030) come from SDP web pages around 2020 and do not fully agree across sources. Verify them in SDP's latest sustainability report before the pitch.

## Target User

- **Resident** (primary): a household in an SDP township or strata development who is willing to recycle but unsure how to sort, and gets nothing back for doing it.
- **Collector**: an appointed recycler or residents' association volunteer who collects bags at a township recycling point, using a phone and a scale.
- **Admin**: SDP's sustainability team, who need verified kilograms per township for Zero Waste 2030 tracking and ESG reporting.
- **Demo audience**: pitch judges and SDP staff watching the live demo.

## User Goal

- Resident: search or photograph an item and see which bin it goes in and how to prepare it; show their unit's QR bag; see their recycling history, points, and their township's rank.
- Collector: scan a bag's QR code, pick the category, enter the weight, save, and move on to the next bag in seconds.
- Admin: see total kilograms, kilograms per township, per category and per month, participation rate, and an estimated CO2e saving, all coming from the same records.

## Build Shape

Supabase-backed PWA (approved expansion of the classroom pack): Vite + React installable web app, Supabase database and Auth, three roles, deployed on Vercel.

## Shape Confirmation

Confirmed. The learner chose PWA + Supabase.

## Version-One Success

On a real phone, through the Vercel URL, the 3-minute demo runs end to end with no errors:

0. A judge scans the QR code on the pitch slide and the landing page explains what Kitar is and why it matters, then "Try the demo" opens the login page.
1. Resident logs in, photographs a drink carton and gets the right sorting guide entry.
2. Resident opens their QR bag.
3. Collector logs in on a second phone, scans that QR code, chooses a category, enters 2.4 kg, saves.
4. Resident refreshes: the collection appears in their history, points go up, the township's leaderboard position updates.
5. Admin logs in on a laptop: the dashboard totals include the new 2.4 kg.

## Now / Later / Never

### Now

- Public landing page at `/` that explains Kitar to residents and judges (problem, users, solution, innovation, how it works, impact, feasibility, implementation) with a "Try the demo" button to `/login`
- Demo login for three roles (resident, collector, admin) with route guards
- Sorting guide search in English and Malay, about 30 sample items with bin colour and preparation steps
- Photo scan in the browser (pre-trained model) that suggests a guide entry, with a "choose manually" fallback
- "A pile" scan mode: one photo of several items, results grouped by bin; residents remove wrong items and add missed ones
- Unit QR code shown large and printable
- Collector QR scan → category → weight → save, with manual unit-code entry as a fallback
- Resident history and points balance
- Township leaderboard for the current month (kg per participating unit)
- Admin dashboard: kg by township, by category, by month; participation; CO2e estimate only where a cited factor exists
- Installable PWA, deployed on Vercel, with a 3-minute demo script

### Later

- Hybrid photo scan: keep on-device MobileCLIP first; when it is unsure, in "A pile" mode, or when the resident taps "Ask AI", call a cloud vision model (Gemini, Grok or Claude, provider to be chosen) through a Supabase Edge Function with the key in Supabase Secrets, the guide item list in the prompt, JSON-only answers (item id or "unknown" + material), a per-user daily limit, and a notice that the photo is sent to a third party
- Object detection for piles (find each item, then name it) instead of the 3x3 crop grid
- Model trained on Malaysian waste items (public waste-photo datasets plus local photos)
- "Reduce" guide with Malaysian zero-waste alternatives
- Monthly challenges
- Pickup booking for bulky items and e-waste
- Nearby buy-back centre prices
- WhatsApp bot entry point
- Integration with the SDP owner app
- Maintenance-fee offset linked to real strata billing
- Reward redemption with vouchers at SDP malls
- Collector offline queue when the recycling point has no signal
- ESG report export (CSV / PDF)
- Full UI translation (Malay, Chinese)

### Never

- Real payments, e-wallet transfers or real maintenance-fee deductions
- Real residents' names, unit numbers, phone numbers or addresses
- SDP logos or brand assets, or anything presented as an official SDP product
- Secrets (Supabase `service_role` key or others) in frontend code or Git
- Invented statistics shown as real

## Assumptions

- SDP or the residents' association would provide QR-labelled bags and a recycling point per township.
- Collectors have a smartphone and a weighing scale.
- The points rate is a sample value for the demo, not a real offer.
- The pre-trained photo model recognises common items (bottles, cans, cartons) well enough for a demo; Malaysian-specific items need the Later model.

## Proof Target

Live Vercel URL opened by QR code from the pitch slide, plus a phone screen recording of the demo script.

## Learner Notes

- Main difference from typical recycling apps: points come from weighed, verified collections, not from self-reported photo scans.
