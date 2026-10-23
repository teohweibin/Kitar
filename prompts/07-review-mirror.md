# Prompt 07: Review Mirror

Use this after Work Card 07 and again after Work Card 08.

```text
Read project-brief.md, architecture.md, design.md, build-blueprint.md, build-status.md, and the latest implemented work card.

Review the current app against the brief, architecture, design, and blueprint.

Check:
1. Does it match the project goal and the problem statement?
2. Does the full demo loop work: scan item → QR bag → collector scans and weighs → points and leaderboard update → admin dashboard updates?
3. Security: is RLS on for every table? Can a resident see another unit's data? Can a resident open collector or admin pages? Is any secret in the code or Git history?
4. Is it readable and usable at phone width, and does the collector screen work one-handed?
5. Does it follow design.md?
6. Are there fake claims, fake logos, unlabelled sample stats, or lorem ipsum?
7. Does anything use Sime Darby Property logos or brand assets, or look like an official SDP product?
8. Is there one clear primary action on each screen?
9. Does it install as a PWA and show a sensible message when offline?

Return:
- PASS / NEEDS FIX / REDRAFT
- top 1 to 3 issues, security issues first
- the single smallest useful fix

Do not redesign the whole project.
```

## After the final review

When the review after Card 08 is PASS, update `build-status.md` to say Check is complete and the Proof Ladder level reached.
