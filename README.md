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

## Resist tab (beat the graze)

A tab to open *when you’re tempted to snack*. Tap what you’re craving from a grid of
~24 common culprits. Then three behavior-tuned paths:

- **⏱ Ride it out (10 min):** an urge-surf countdown ring with rotating distraction
  prompts (water, walk, breathe, taunt the crew). Cravings fade in ~10 min; you wait
  *with* it, then bank the win. Beat it early anytime.
- **Skip it now — bank it:** instant win for when you don’t need the timer.
- **I had it:** a no-shame give-in log (“no big deal”) so the data stays honest and
  one slip doesn’t blow up the habit.
  Wins build a **resist streak** (loss-aversion: “don’t break your streak”) alongside
  skips this week, calories resisted, sugar dodged, and an all-time “≈ lb not gained”
  (cal ÷ 3500). Slips are counted gently and never punished. The Crew board shows each
  person’s calories resisted this week (wins only). Framing stays swap-and-water, not
  skip-real-meals; numbers are labeled estimates.

## Day rollover at 4 AM + multiple sessions per day

- The app’s “day” rolls over at **4 AM local**, so a workout logged at 1 AM counts
  for the night before, not the next morning.
- The Tonight tab has a **session bar**: tap **＋ Session** to log a second (or third)
  workout the same day, switch between them, or remove one. Each session has its own
  focus (A/B/C/D), sets, and Log button. Streak, the Progress stats/heatmap/volume
  chart, and the Crew weekly standings all count every session.

## Custom equipment + auto-scaled reps  (Crew → Your profile)

Each user lists the kettlebells and dumbbells they own (e.g. `10, 25`). Every
exercise then shows the right load from their gear and **scales the reps**:
heavier weight → fewer reps, lighter → more (compounds use your heaviest, isolation
moves like raises/curls use your lightest). Timed and to-failure work isn’t scaled.
If someone lacks an implement, it falls back gracefully (KB move → DBs, etc.).

## Gear coach

A card on the Crew tab recommends what to buy next based on what you own and your
logged reps — if you’re routinely pushing past ~18 reps a set, it nudges you to
add the next size up (with concrete kettlebell/dumbbell suggestions).

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