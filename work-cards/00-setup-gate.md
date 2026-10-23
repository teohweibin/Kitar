# Work Card 00: Setup Gate

## Goal

Confirm the learner has a capable coding workspace, the local tools, and the accounts this project needs before planning.

## Coding workspace checklist

Use VS Code, Cursor, Antigravity, Claude Code, or an equivalent workspace.

- [ ] The workspace opens this entire project folder.
- [ ] Its AI agent can read `START_HERE.md`.
- [ ] Its AI agent can create or update a markdown file in this folder.
- [ ] A terminal opens inside this project folder.
- [ ] A browser is available for localhost tests.
- [ ] A phone (Android or iPhone) is available for camera and PWA tests later.

## Local tools checklist

- [ ] Node.js LTS installed (v20.19+ or v22.12+).
- [ ] npm working.
- [ ] Git installed.

## Accounts checklist

These are needed before Work Card 02 (Supabase) and Work Card 08 (deploy). The learner signs up themselves; the agent never enters passwords or creates accounts.

- [ ] Supabase account, with one new free project created (note the region: Singapore is closest to Malaysia).
- [ ] GitHub account.
- [ ] Vercel account, signed in with GitHub.

## Command checks

Run these yourself in the project terminal and read what they print. Do not ask the learner to type them.

```bash
node -v
npm -v
git --version
```

Each must print a version number. If Node is older than required, ask the learner to install the LTS from nodejs.org, then reopen the workspace. If you cannot run terminal commands, ask the learner once to paste what the three commands print.

Ask the learner once whether the three accounts exist. Missing accounts do not block planning; record them as blockers for Card 02 or Card 08.

## Install rescue

If npm or npx says running scripts is disabled (Windows PowerShell), ask the learner to run this once and answer Y if asked, then try again:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

## What not to do

- Do not start app code.
- Do not scaffold a project or install packages.
- Do not initialize Git.
- Do not deploy.
- Do not ask for or type any password, API key or Supabase key.

## Done when

- The workspace can read and write markdown files and run terminal commands in this folder.
- `node -v`, `npm -v` and `git --version` work.
- Account status is recorded in `build-status.md`.

## Stop condition

If the workspace, Node or npm cannot be fixed in fifteen minutes, record the blocker in `build-status.md` and stop.

## Status

Done. Tools passed (Node v24.16.0, npm 11.13.0, Git 2.53.0). Supabase, GitHub and Vercel accounts ready.
