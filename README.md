# NIGHTLIFT — crew edition

Self-contained nighttime strength tracker. Now multi-user, cloud-synced, with a
group/social layer and optional AI exercise swaps.

## Files

- `index.html` — the whole app (no build step)
- `api/replace.js` — serverless function for the “Replace exercise” AI feature

## Users / codes

- Aaron — 7880
- Sean — 1221
- Abe — 7886
  Each code logs in a separate user with their own progress, stats, profile, and
  exercise swaps. Codes live in the CONFIG block at the top of the <script> (the
  `USERS` map) — edit there to change.

## Already wired (Supabase project xcgdnzypisbzxhaooswb)

- `nightlift_log`  — per-user daily logs (primary key user_id + log_date)
- `nightlift_profile` — per-user height/weight/name + AI exercise swaps
- `nightlift_wall` — shared taunt/support messages
  All have RLS on with an anon read/write policy. URL + anon key are baked into the
  CONFIG block.

## Deploy

Already on Vercel via the GitHub repo. To update: upload both files to the repo
(put `replace.js` inside an `api/` folder) and Vercel auto-redeploys.

GitHub web tip for the function: use **Add file → Create new file**, name it
`api/replace.js` (typing the slash makes the folder), paste the contents, commit.

## Turn on the AI “Replace exercise” feature

This is the only part that needs setup. On a public site you can’t use a Claude.ai
subscription — you need an **Anthropic API key** (separate, pay-per-use):

1. Get a key at console.anthropic.com → API Keys.
1. Vercel → your `nightlift` project → **Settings → Environment Variables**.
1. Add `ANTHROPIC_API_KEY` = your key. Apply to Production. Redeploy.
1. Make sure `api/replace.js` is in the repo.

The key stays server-side (in the function) — users never see it. Each swap costs
a few cents of API usage. Without the key, everything else works; tapping Replace
just shows a friendly error.

## Crew tab

- This-week standings for all three; 👑 leader, 🪣 last place = “Tub-o-Shit”.
  Ranked by sessions completed, ties broken by total reps. Resets Sundays.
- Message wall: send a 🔥 taunt or 💪 support to one person or everyone.
- Profile: edit your height/weight (used for stats and to tailor AI swaps).
- “Switch user” logs out so a different code can sign in on the same device.

## Security note (unchanged)

The 4-digit codes + public anon key are a casual gate, not real auth. Fine for a
crew’s workout logs. Real per-user auth would be a Supabase Auth add-on.