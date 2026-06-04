# NIGHTLIFT — crew edition

Self-contained nighttime strength tracker. Multi-user, cloud-synced, with a
group/social layer and a large built-in exercise bank for instant swaps.

## File

- `index.html` — the whole app. No build step, no serverless function, no API key.

## Users / codes

- Aaron — 7880   ·   Sean — 1221   ·   Abe — 7886
  Each code is its own user (own progress, stats, profile, swaps). Edit the `USERS`
  map at the top of the <script> to change codes/names.

## Replace exercise (now offline + free)

Every exercise has a ↻ Replace button. It instantly swaps in a different exercise
from a built-in bank of ~90 moves (same muscle group, your equipment only, not a
duplicate of what’s already in the day), with cues, sets/reps, a progression note,
and a matching animation. “Undo swap” reverts. No API key, no cost, works offline.

> The earlier AI version (api/replace.js + an ANTHROPIC_API_KEY env var) is no
> longer used. You can delete that file from the repo and remove the env var if
> you added it — nothing depends on them now.

## Supabase (project xcgdnzypisbzxhaooswb)

- nightlift_log — per-user daily logs (PK user_id + log_date)
- nightlift_profile — per-user height/weight/name + swap overrides
- nightlift_wall — shared taunt/support messages
  RLS on, anon read/write. URL + anon key are baked into the CONFIG block.

## Crew tab

- Weekly standings for all three; 👑 leader, 🪣 last place = “Tub-o-Shit”
  (by sessions, ties broken on total reps, resets Sundays).
- Wall: send a 🔥 taunt or 💪 support to one person or everyone.
- Profile: edit height/weight. “Switch user” to sign in as someone else.

## Deploy

Upload `index.html` to the repo → Vercel auto-redeploys. That’s the only file
needed now.

## Security note

4-digit codes + public anon key = a casual gate, not real auth. Fine for a crew’s
workout logs.