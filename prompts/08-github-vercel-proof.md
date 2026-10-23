# Prompt 08: GitHub + Vercel Proof

Use this in Work Card 08, after the app works on localhost for all three roles.

## Before the first commit: secret check

1. Confirm `.gitignore` contains `.env*` (with `!.env.example` if an example file is kept).
2. Search the project for `service_role` and for long keys starting with `eyJ` outside `.env.local`. There must be none.
3. `.env.example` may list the variable names with empty values, never real values.

## GitHub push guidance

1. Confirm Git works:
   `git --version`
2. Confirm Git identity:
   `git config --global user.name`
   `git config --global user.email`
3. If identity is missing, set it:
   `git config --global user.name "Your Name"`
   `git config --global user.email "your-email@example.com"`
4. Initialize and commit:
   `git init`
   `git add .`
   `git status` (check that no `.env.local` is listed)
   `git commit -m "build: kitar demo prototype"`
5. Create an empty GitHub repo. Do not add README, license or gitignore in GitHub.
6. Add the remote and push:
   `git branch -M main`
   `git remote add origin <repo-url>`
   `git push -u origin main`

## Vercel deploy guidance

1. Open Vercel → Add New Project → import the GitHub repo.
2. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
3. Under Environment Variables, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with the same values as `.env.local`.
4. Add a `vercel.json` with a rewrite of all paths to `/index.html`, so refreshing `/resident` or `/collector` does not 404.
5. Deploy.
6. In Supabase → Authentication → URL Configuration, set Site URL to the Vercel URL and add it to Redirect URLs.
7. Open the live URL on a real phone: log in with each demo account, scan a QR code with the collector account, and confirm the admin dashboard updates.
8. Generate a QR code for the Vercel URL to put on your pitch slide.

## Proof submission

Submit the strongest proof available:

- Strong: live Vercel URL + GitHub URL + a recording of `demo-script.md` on a real phone.
- Good: GitHub URL + localhost screen recording + short explanation.
- Minimum: localhost screenshots + explanation of what worked and what blocked deployment.

After proof is captured, update `build-status.md` with the proof used, the live and repository links, and `Current KDBM Lite stage: Shipped`.
