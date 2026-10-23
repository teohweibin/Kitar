# Prompt 04: Build Blueprint Writer

Goal: combine the confirmed planning files into one comprehensive `build-blueprint.md`.

Read these files first:

- `project-brief.md`
- `architecture.md`
- `design.md`

Before writing `build-blueprint.md`, verify `design.md` exists and is specific. If `design.md` is missing or vague, stop and run the Design Coach again.

Create `build-blueprint.md` with this structure:

```md
# Build Blueprint

## Source Files

## Project Identity

## Build Shape

## Version-One Promise

## Scope Lock

### Now

### Later

### Never

## Architecture Summary

## Data / Security Rules

## Design Direction Summary

## Implementation Rules

## File and Folder Expectations

## Work Card Plan

## Review Mirror

## Proof Ladder

## 60-Second Pitch Explanation

## Guardrails for the Coding Agent
```

In the Design Direction Summary, summarise what the build borrows from the design inspiration and what must not be copied, including the SDP brand rule.

The Work Card Plan lists exactly eight cards, in this order, each with one line on what it holds:

1. 01 Project skeleton + PWA shell
2. 02 Supabase schema, RLS and seed data
3. 03 Demo login and role routing
4. 04 Resident: sorting guide and photo scan
5. 05 Resident: QR bag and my recycling history
6. 06 Collector: scan QR and record weight
7. 07 Rewards, leaderboard and admin dashboard
8. 08 PWA polish, deploy and demo script

`prompts/05-work-card-writer.md` says what each card holds.

Fill these sections this way:

- **Review Mirror:** run `prompts/07-review-mirror.md` after Card 07 and after Card 08.
- **Proof Ladder:** (1) localhost works for all three roles; (2) Vercel URL works on a real phone, including QR scanning; (3) a 3-minute demo script runs end to end: resident scans an item → shows QR bag → collector scans and weighs → points and leaderboard update → admin dashboard shows the new kilograms.
- **60-Second Pitch Explanation:** problem (SDP's recycling is campaign-based and unmeasured), solution (the six-step loop: learn, drop, verify, reward, compete, report), proof (the live demo), and what is next (the Later list).

Guardrails for the Coding Agent must include:

- read `build-status.md`, `build-blueprint.md`, and the current work card before editing;
- implement only the current work card;
- do not jump ahead;
- stop after verification;
- update `build-status.md` after each work card;
- never put the Supabase `service_role` key or any secret in frontend code or Git; only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in a git-ignored `.env.local`;
- every new table has RLS enabled before it is used;
- schema changes go in numbered SQL files under `supabase/migrations/`, never only clicked in the dashboard;
- do not invent claims, testimonials, logos, or real numbers; sample data is labelled;
- no SDP logos or brand assets;
- never run a scaffolder with `--overwrite` or "Remove existing files".

Then update `build-status.md`:

- Current phase: Work Cards
- Completed: Build Blueprint
- Next instruction: Generate work cards

Go straight on to the work cards.
