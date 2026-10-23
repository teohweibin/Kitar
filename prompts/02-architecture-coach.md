# Prompt 02: Architecture Coach

Goal: confirm the drafted `architecture.md` and make sure it is safe to build.

Read `project-brief.md` first. If its Build Shape is not confirmed, return to Prompt 01.

## Confirm the draft

`architecture.md` is already drafted. Read it and show a summary of at most eight short lines:

- the stack;
- the three roles and what each can do;
- the tables and their main fields;
- the RLS rule for each table in one phrase;
- how the QR code links a recycling bag to a unit;
- how points and the leaderboard are calculated;
- where the app lives (this folder, beside `START_HERE.md`);
- what is not built in this version.

Ask once: `Looks right? Reply yes, or tell me one change.` Apply the change, then save.

## Must be covered in the file

- every table, its fields, and which role can select / insert / update / delete it;
- RLS enabled on every table, with no policy that lets a resident read another unit's records;
- seed data: fictional townships, units and demo accounts, marked as sample;
- which values are computed (points, leaderboard, CO2e estimate) and where: SQL view or frontend;
- environment variables: names only, never values;
- how phone-camera features are tested over HTTPS;
- what happens with no network (PWA offline behaviour).

## Default stack

Unless the learner changes it:

- Vite + React (JavaScript);
- `react-router-dom` for routes per role;
- plain CSS, or Tailwind if the learner prefers it;
- `vite-plugin-pwa` for the manifest and service worker;
- `@supabase/supabase-js` for database, auth and storage;
- `html5-qrcode` for QR scanning and `qrcode` for generating bag labels;
- Vercel for hosting, Supabase free tier for the backend.

## Scope rescue

If the learner asks for real payments, a real e-wallet, WhatsApp integration, a custom-trained AI model or IoT smart bins, record it under Later in `project-brief.md` and keep the architecture on the current version.

## File structure

```md
# Architecture

## Build Shape

## Stack Decision

## Structure Overview

## Roles and Permissions

## Data Model

## Row Level Security

## Computed Values

## Seed / Sample Data

## User Flows

## File Expectations

## Environment Variables

## Constraints

## Technical Non-Goals

## Verification Notes
```

Then update `build-status.md`:

- Current phase: Design
- Completed: Architecture
- Decisions made: stack, data model, storage and security decisions

Go straight on to Design.
