# NIGHTLIFT

Self-contained nighttime strength tracker. One file (`index.html`), no build step.
Cloud-synced to your Supabase, cached locally so it works offline too.

## Already wired
- **Login code:** 7880 (client-side gate; stored after first unlock)
- **Supabase project:** xcgdnzypisbzxhaooswb
- **Table:** public.nightlift_log  (created, RLS on, anon read/write policy)
- URL + anon key are already in the CONFIG block at the top of the <script>.

## Deploy to Vercel
1. vercel.com → Add New → Project
2. Drop this folder. Framework preset: **Other**. Deploy.
No env vars, no npm install. Open it on your phone AND laptop — same data.

## How sync works
Every change upserts that day's row to Supabase and caches to localStorage.
On open it pulls the cloud copy (cloud wins for shared dates, local-only days
get pushed up). The dot by the date shows: cloud synced / syncing / offline.

## Heads up on security
A 4-digit code + a public anon key is a casual gate, not real auth — the key
ships in the page source and the table is readable by anyone who has both the
URL and key. Fine for personal workout logs (low sensitivity). If you ever want
real per-user auth, that's a Supabase Auth add-on I can wire later.

## Change the code
Edit `const GATE_CODE = "7880"` near the top of the <script>.
