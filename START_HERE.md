# Kitar: Start Here

Kitar is a demo prototype of a household recycling module for Sime Darby Property townships. It is a concept for a pitch: it is not affiliated with or endorsed by Sime Darby Property, and every record in it is sample data.

This folder uses KDBM Lite (KrackedDevs Build Method Lite), adapted for a multi-day build with a real backend:

`Spec → Build → Check → Ship`

The AI helps with speed. You still decide the goal, confirm the plan, test the result, and own what ships.

## What changed from the classroom pack

The original pack was for one evening in class: browser-only, no database, no login, no deploy, exactly four work cards. This project needs more, so these rules are approved for it:

- **PWA**: installable web app built with Vite + React + `vite-plugin-pwa`.
- **Supabase**: Postgres database, Auth (demo accounts per role), Storage, Row Level Security.
- **Three roles**: resident, collector, admin (SDP sustainability team).
- **Deploy**: GitHub + Vercel, so judges can open the demo by scanning a QR code.
- **Eight work cards** instead of four (see `prompts/05-work-card-writer.md`).

Still not allowed: real payments, real residents' names or unit numbers, real Sime Darby logos or branding, secrets committed to code, or invented statistics presented as real.

## What this pack creates

These files are the only source of truth for progress:

- `project-brief.md`: project identity, user, scope, and success target.
- `architecture.md`: stack, structure, data model, security rules.
- `design.md`: layout, style, mobile, and anti-slop rules.
- `build-blueprint.md`: the complete builder-ready specification.
- `build-status.md`: current phase, completed work, blockers, decisions, and next instruction.
- `work-cards/*.md`: one small implementation step at a time.

The chat is not the source of truth. The files are.

`project-brief.md` and `architecture.md` are already drafted from the research and decisions made so far. The coach confirms them with you instead of starting from zero.

The Design phase is required. Do not create the Build Blueprint or Work Cards until `design.md` is specific about layout, components, mobile behaviour, and accessibility.

## Start in your coding workspace

1. Open this entire folder in VS Code, Cursor, Antigravity, Claude Code or another AI coding workspace.
2. Open its AI agent or coding chat.
3. Paste this boot prompt:

```text
Read START_HERE.md and prompts/00-run-kdbm-lite-coach.md.

Run the KDBM Lite Coach exactly as instructed.

Planning phase only:
- create or update markdown planning files only
- do not create app code yet
- do not install packages yet

Start with the Setup Gate, then confirm the drafted project-brief.md and architecture.md with me.
Ask me one question at a time.
```

## After planning is complete

Paste this into the implementation model:

```text
Read build-status.md, build-blueprint.md, design.md, and the current work card listed in build-status.md.
Implement only that work card.
Run its verification steps, update build-status.md, and stop for my check.
```

## Folder notes

- `_archive/` holds classroom-only files that do not apply to this project. Nothing reads them.
- `templates/` holds blank versions of each planning file.
