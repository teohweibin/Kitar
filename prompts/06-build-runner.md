# Prompt 06: Build Runner

Use this after planning is complete.

Paste this into the implementation model:

```text
Read build-status.md, build-blueprint.md, design.md, architecture.md, and the current work card listed in build-status.md.

Implement only the current work card.

Rules:
- Follow design.md. If design.md is missing or vague, stop and ask me to complete the Design phase first.
- Do not copy external brand identity, logos, testimonials, stats, or images. No Sime Darby Property logos or brand assets.
- Do not start the next work card.
- Do not change the project scope.
- Never put the Supabase service_role key or any secret in frontend code or Git. Only VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, in .env.local.
- Every new table has RLS enabled. Schema changes go in supabase/migrations/.
- Run the verification steps from the work card, including the Security check if it has one.
- After finishing, update build-status.md with what changed, what passed, what failed, and the next work card.
- Stop and wait for my approval.
```

Recommended model strategy:

- planning: strongest available model;
- implementation: a cheaper/faster model is okay because the files are now the source of truth. Use the strongest model again for Card 02 (database and RLS).

## Required output after every Work Card

After completing a Work Card, do not just stop. Output this learner checkpoint:

### Work Card NN complete

**What changed**
- Briefly list what was created or updated.

**Local preview**
- If the dev server is not running, tell the learner to run:
  `npm run dev`
- Tell them to open the localhost URL shown in the terminal, usually:
  `http://localhost:5173`
- If the dev server is already running, tell them to refresh the browser.
- If this card needs the Supabase dashboard (for example, running a migration), say exactly where to click.
- If this card has no meaningful browser preview yet, say so and explain which command or file check proves it passed.

**Test before moving on**
- Give 2 to 5 specific tests for this Work Card.
- The tests must match the feature or setup completed in this card.
- Do not say only "check that it works."

**Choose next action**
- If all tests pass, say: `continue`
- If anything fails, say: `fix` and paste the error or describe what you see.

Do not start the next Work Card until the learner chooses `continue`.

## Required output after the final Work Card

### All Work Cards are complete

**Final review**
- Open the Vercel URL on a real phone.
- Run `demo-script.md` from start to finish with all three demo accounts.
- Check phone width on every screen.
- Check there is no red error screen and no console errors.
- Search the repo for `service_role` and for any key that is not the anon key: there must be none.
- Check every sample number carries a sample label and every real figure has its source.
- Check there is no SDP logo or brand asset.

**Next: Improve**
The learner keeps improving the app one change at a time, inside the scope lock. Run `prompts/07-review-mirror.md` for the final review.

Update `build-status.md` to the Improve stage and stop.
