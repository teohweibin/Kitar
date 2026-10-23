# Kitar

**Verified recycling for the Township of Tomorrow.** AI tells residents what to do. Kitar proves they did it.

Kitar is a working prototype of a household recycling module for Sime Darby Property (SDP) townships, built by team **GURLSSS POWERRR** (Universiti Malaya) for the SDP University Hackathon. Every recycling bag is QR-scanned and weighed, so each kilogram is tied to a unit and Zero Waste 2030 becomes a number SDP can see, report and grow.
## The problem

Bandar Bukit Raja shows that residents will recycle: 27 residents' associations have sorted and sold recyclables with SDP since 2017. Yet SDP still can't see, scale or prove that habit.

| | |
|---|---|
| **6,570 tonnes** | community recycling SDP targets every year by 2030 |
| **~35 tonnes** | recycled in Bandar Bukit Raja's award-winning programme, 2017–2020 |
| **RM291m** | value of recyclables Malaysia lost to landfill in 2023 (SWCorp) |

Why it stalls:

1. **It runs on campaigns.** Drives and festive collections spike, then stop, so there's no habit and no baseline.
2. **The results are invisible.** Manual tallies and a council-owned app give no unit-level data for Zero Waste 2030 or for Bursa Scope 3 (waste) disclosure.
3. **AI can't fix it alone.** AI can classify and predict, but it cannot prove a household actually recycled.

**Problem statement:** SDP needs a low-cost, always-on way to turn recycling campaigns into a verified household habit, measured unit by unit, to reach Zero Waste 2030 and report it with confidence.

## Who it's for

| User | Role | Today |
|---|---|---|
| Residents | Primary user | Confusing rules (bins, cartons, e-waste); no feedback or reward; ~40% of strata owners struggle with maintenance fees* |
| Collectors and RA volunteers | Operator | Paper logs, no proof per household, slow collection days |
| SDP sustainability and township teams | Buyer | No baseline for Zero Waste 2030, Scope 3 disclosure required by Bursa, campaign spend with no measurable return |

*Industry estimate of 2.8m strata units, reported by Bernama, March 2025.

## The solution

Kitar turns recycling into a verified, community-led habit:

- **Mobile guidance.** Search the sorting guide in English or Bahasa Melayu, or scan an item or a whole pile with the on-device AI.
- **QR bag linking.** Each unit has a QR-labelled bag with a random code and no names.
- **Verified collection.** The collector scans the bag, picks a category and weighs it: 3 taps.
- **Unit traceability.** One bag becomes one verified record: unit, category, kg, time and collector.
- **Resident progress.** Residents earn points, tiers and a monthly township leaderboard, with points designed to become maintenance-fee credits.
- **Admin data.** SDP gets a live dashboard of kg by township, category and month.

## What's new

| | Recycling campaigns today | Photo-reward and AI-only apps | **Kitar** |
|---|---|---|---|
| Proof of recycling | Manual tallies | Self-reported photo | **Weighed and QR-scanned, per bag** |
| Runs continuously | Weeks per campaign | Yes | **Yes, inside weekly collection** |
| Data for SDP | Township totals at best | Held by the app vendor | **Unit, category, kg, date: owned by SDP** |
| AI cost per scan | None used | Cloud AI per photo | **RM0: AI runs on the phone** |
| Pays residents back | Lucky-draw prizes | Points | **Maintenance-fee credits** |

## How it works

1. **Scan.** The resident snaps an item or a pile, and the on-device AI shows the bin and how to prepare each item.
2. **Drop.** Recyclables go into the unit's QR-labelled bag at the township recycling point.
3. **Verify.** The collector scans the QR, picks the category and weighs the bag.
4. **Reward.** Points land in the resident's app, and the township climbs the monthly leaderboard.
5. **Report.** SDP's dashboard updates live: kg by township, category and month.

## Impact

- **Community and behaviour.** Weekly collection with visible points and township rankings turns campaigns into a habit and gives SDP a measurable sustainability story.
- **Operations and ESG.** Guidance at home means less contamination. Accurate kg tracking per unit supports Zero Waste 2030 and Scope 3 (waste) disclosure.
- **Environment.** Less waste goes to landfill and more material stays in the circular economy. Verified weights give any future carbon estimate a real base.
- **Value.** At SDP's 2030 goal, the recyclables are worth roughly **RM2–3.3m a year**, which Kitar routes back to residents as maintenance-fee credits.

## Feasibility

**Already built and tested**

- Working prototype with live resident, collector and SDP views
- AI scan on sample photos: cans 96–99%, phones ~100%, drink cartons ~75%
- Access control tested: residents see only their own unit, and saved records can't be edited

**Built on what SDP has**

- Bandar Bukit Raja recycling network (27 RAs since 2017)
- Maintenance-offset recycling pilot (2 strata, Bandar Bukit Raja)
- SDP owner app and township teams
- Collection partners already active in SDP townships

**Pilot cost (500 units, estimate):**

| Item | Cost |
|---|---|
| Cloud hosting, 12 months | ~RM2,500 |
| 10 digital hanging scales | ~RM1,500 |
| 2,000 QR bag labels | ~RM400 |
| **Total** | **< RM5,000** |

The estimate excludes staff time; partners collect as they do today.

**Risks and mitigations**

| Risk | Mitigation |
|---|---|
| Low participation | Points, fee credits and township ranking |
| AI mistakes | Points come only from weighed bags, and residents can pick the item manually |
| Privacy | No names, random QR codes and role-based access |

## 12-month roadmap

| Quarter | Stage | What happens |
|---|---|---|
| Q1 (months 1–3) | Pilot | One strata block at the Bandar Bukit Raja maintenance-offset site: print QR labels, train collectors, set a baseline |
| Q2 (months 4–6) | Prove | Weekly collections on Kitar; points linked to maintenance-fee credits; go/no-go review with SDP |
| Q3 (months 7–9) | Integrate | Embed in the SDP owner app with single sign-on; extend to 3 townships (e.g. Bandar Bukit Raja, Serenia City, Elmina) |
| Q4 (months 10–12) | Scale | Roll out to SDP-managed strata; feed verified kg into the annual sustainability report |

**Pilot success measures** (to agree with SDP):

- ≥ 30% of units taking part by month 3
- ≥ 4 kg per taking-part unit per month
- 100% of bags recorded digitally
- Break-even: material value covers the running cost

## Try the prototype

Open the app's `/login` page and tap **Try as Resident**, **Try as Collector** or **Try as Admin**. No password is needed.

| Role | What to try |
|---|---|
| Resident | Home (points and rank) → Guide (search "kotak") → Scan → **A pile** → My Bag QR → Rewards and Leaderboard |
| Collector | **Type unit code instead** → `SAMPLE-A-0101` → pick a category → enter the weight → Save → Confirm |
| Admin | Dashboard: total kg, participation, kg by month, township and category, latest collections |

The demo resident is unit **SAMPLE-A-0101** in Taman Sample Hijau, so a collection saved as the collector shows up in the resident's points and on the admin dashboard.

## Team

**GURLSSS POWERRR**, Universiti Malaya: Tang Yong Chun (team lead), Teoh Wei Bin, Lim Wan Yee, Khor Chek Lin, Yeoh Yee Syuen.

---

## For developers

### Stack

Vite + React PWA · Supabase (Postgres, Auth, Row Level Security) · MobileCLIP via transformers.js for the in-browser photo scan · Recharts · Vercel hosting.

### Run locally

Requires Node 20.19+ or 22.12+.

```bash
npm install
cp .env.example .env.local   # then fill in the two values below
npm run dev                  # http://localhost:5173
```

`.env.local` (never committed):

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Use the Project URL and the **anon public** key from Supabase → Project Settings → API. Never put the `service_role` key in this project.

### Set up the database

In Supabase → SQL Editor, run these in order:

1. `supabase/migrations/0001_schema.sql`
2. `supabase/migrations/0002_rls.sql`
3. `supabase/migrations/0003_views_functions.sql`
4. Create four users in Authentication → Users (tick "Auto Confirm User"): `resident1@demo.test`, `resident2@demo.test`, `collector1@demo.test`, `admin@demo.test`. Choose the passwords yourself; they are not stored in this repo. The seed attaches the sample data to these users.
5. `supabase/seed.sql`
6. `supabase/updates/0004_guide_wording.sql`
7. `supabase/updates/0005_reseed_sample_collections.sql` (only needed for projects seeded before the seed fix; harmless otherwise, since it replaces the sample collections)
8. Authentication → Sign In / Providers → turn on **Allow anonymous sign-ins**, then run `supabase/updates/0006_demo_sessions.sql`. This powers the password-free "Try as" buttons on the login page.

### Password-free demo

The "Try as" buttons sign the visitor in anonymously and give them a demo role through `start_demo_session()`:

- A demo resident shares unit SAMPLE-A-0101.
- A demo collector can record collections.
- A demo admin sees the dashboard (read-only).

Row Level Security still applies. Each tap creates an anonymous user in Supabase, and Supabase rate-limits anonymous sign-ins per IP. To switch the demo off after the pitch, turn anonymous sign-ins off again.

### Photo scan labels

The scanner recognises the items described in `src/data/scanLabels.json`. After editing that file, regenerate the text embeddings:

```bash
npm run build:scan-embeddings
```

## Sources

- SDP Zero Waste 2030 target and the Bandar Bukit Raja programme: Sime Darby Property sustainability pages and SDG report
- RM291m of recyclables lost to landfill in 2023: SWCorp, reported by Malay Mail (December 2023)
- ~40% of strata owners struggling with maintenance fees: industry estimate reported by Bernama (March 2025)
- Costs and material value are team estimates based on published cloud plan prices, typical Malaysian retail prices and scrap rates
