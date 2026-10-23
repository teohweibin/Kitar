# Prompt 03: Design Coach

Goal: turn a design inspiration into practical build rules and save `design.md`.

Read `project-brief.md` and `architecture.md` first.

## Ask

1. Paste the URL of a design you like (designmd.ai, Dribbble, or an app you use), or pick a fallback style below.
2. What do you like about it? Choose up to three: layout, spacing, colour mood, typography feel, cards, buttons, mobile feel, overall vibe, or type your own.
3. What should we avoid?
4. Should it feel official, friendly, premium, calm, playful, or something else?

Fallback styles if the learner has no URL:

1. Calm eco utility: soft greens, lots of white space, rounded cards
2. Property-developer premium: deep green or navy, serif headings, restrained accents
3. Friendly community app: bright, playful icons, big buttons, progress rings
4. Fintech-style rewards: dark header, bold numbers, point balances front and centre
5. Government service: plain, high-contrast, very clear labels
6. Or describe your own

The inspiration is not a clone target. Translate it into design rules; do not copy brand, logo, text, photos, or identity.

## Brand rule for this project

The demo is pitched to Sime Darby Property but is not their product. It may use a colour mood that suits a property developer, but it must not use the SDP logo, wordmark, exact brand colours copied from their site, or photos of their townships. Every screen shows a small "Concept prototype · sample data" label.

## File structure

```md
# Design Direction

## Design Inspiration URL

## What We Borrow

## What We Do Not Copy

## Visual Mood

## Layout Rules
### Resident screens (mobile-first)
### Collector screens (mobile-first, one-handed use outdoors)
### Admin dashboard (laptop-first, still readable on a phone)

## Color / Contrast Rules

## Typography Feel

## Component Style

## Mobile Rules

## Accessibility Basics

## Anti-Slop Rules

## Design Verification Checklist
```

`design.md` must describe:

- the bottom navigation or tab layout for residents;
- the QR bag card (what the resident shows or prints);
- the scan screen for collectors: camera view, weight input with large number keys, a clear confirmation state;
- points balance and leaderboard styles;
- dashboard cards and charts: what each shows and how "sample data" is labelled;
- empty states (no collections yet, no scans yet);
- loading and error states for network calls;
- the PWA install prompt and offline message.

Anti-slop rules must include:

- no fake logos and no SDP branding;
- no fake testimonials;
- no fake stats unless clearly marked sample;
- no lorem ipsum in the final demo;
- one clear primary action per screen;
- readable on phone width;
- no random gradient blobs unless the chosen direction calls for them.

If the result only says vague words like "modern" or "clean", ask follow-up questions until it is specific.

Show a summary of at most six lines, ask once `Looks right? Reply yes, or tell me one change.`, then save.

Then update `build-status.md`:

- Current phase: Build Blueprint
- Completed: Design
- Decisions made: design inspiration and style rules

Ask once: `Shall I write the blueprint and the eight work cards? Reply yes.` That one yes covers both.
