# Prompt 01: Project Brief Coach

Goal: confirm the drafted `project-brief.md` with the learner and lock the scope.

## Confirm the draft, do not interview from zero

`project-brief.md` was drafted from the learner's earlier research: SDP's Zero Waste 2030 commitment, Scope 3 reporting and campaign-based recycling.

Read it, then show the learner a summary in ONE message, numbered:

1. **What are you building?** From One-Sentence Concept.
2. **Who is it for?** From Target User.
3. **What should they be able to do?** From User Goal, written as what they see and do on the screen.
4. **What makes the demo "done enough"?** From Version-One Success.
5. **What must it not become?** From Now / Later / Never → Never.

Then ask exactly one question:

`Which of these five would you change? Reply keep if all are right.`

Apply any change. If the learner wants something from Later moved into Now, ask once which Now item it replaces or whether the timeline allows it, so scope does not only grow.

## If project-brief.md is missing

Ask these one at a time, then create the file with the structure below:

1. What are you building?
2. Who is it for?
3. What should that person be able to do?
4. What would make the demo "done enough"?
5. What must this project not become?

## Build shape

The shape is **Supabase-backed PWA** (see `prompts/00-run-kdbm-lite-coach.md`). Confirm it once: `This is a Supabase-backed PWA with three roles. Is that right?`

## File structure

```md
# Project Brief

## Project Identity

## One-Sentence Concept

## Problem Statement

## Target User

## User Goal

## Build Shape

## Shape Confirmation

## Version-One Success

## Now / Later / Never

### Now

### Later

### Never

## Assumptions

## Proof Target

## Learner Notes
```

Keep sample data as sample data: illustrative examples only, never real records.

Then update `build-status.md`:

- Name and build shape: confirmed
- Shape confirmation: Confirmed
- Current phase: Architecture
- Completed: Project Brief
- Decisions made: project name, build shape, proof target

Go straight on to Architecture.
