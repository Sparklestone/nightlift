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

## Plateau detector (opt-in rotation)

The program stays fixed on purpose — progressive overload on the same lifts is what
builds muscle and lets the app track progress. But when a lift’s total reps go flat
or decline across its **last 3 logged sessions**, that exercise shows a gold
**⚠ PLATEAU** badge and auto-opens with a prompt: **Rotate it** (pulls a fresh
variation from the bank) or **Keep pushing it** (snoozes the prompt 14 days). It only
fires after 3+ logged sessions of that lift and never swaps anything automatically —
variety exactly when the data says you’ve stalled, not before. Dismissals are stored
per device.

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

## Food tracker (protein & carbs)

A new **Food** tab tracks daily protein and carbs against goals.

- **Common foods** — catalog of staples across Protein/shakes, Meat, Fruit, Veg, Carbs, and Dairy. Tapping one opens a quick editor pre-filled with that food’s protein/carbs/calories so you can **adjust the numbers before logging** (brands differ — e.g. one yogurt’s protein vs another) and pick a **servings** multiplier (×1–20, with a live total). You can also rename it to your brand.
- **Manual** — type protein, carbs, and (optional) calories for anything not in the list.
- **Scan label** — snap the Nutrition Facts panel; on-device OCR (Tesseract.js, lazy-loaded from CDN, fully client-side, no API key) reads protein/carbs/calories. Always shown for you to confirm/correct before saving; if OCR can’t read it, you just type the numbers.
- **Goals** — three daily bars: protein (≈0.9 g/lb, a target to hit), carbs (a target to hit), and a **calorie cap** (a ceiling to stay *under*, default ≈12.5×bodyweight). The calorie bar shows headroom left while you’re under and flips to a warning when you go over. All three editable via “Edit goals”; stored per device.
- Daily totals reset on the 4am logical-day boundary like everything else; entries sync to Supabase (`nightlift_food`) and cache locally. Tap ✕ on any entry to remove it.

New table `nightlift_food` (RLS on, anon policy) was migrated automatically.

## Day navigation + move a workout (fixes wrong-day logging)

The 4am rule only helps if you log *during* the midnight–4am window. If you train at 1am but log it later in the day, it lands on the new day with no way to fix it — and there was previously no way to view or log into a past day. Now the Tonight tab has a day bar at the top:

- **◀ / ▶** step to previous/next day (next stops at today — no future logging). Opening a past day lets you log a missed session directly into it.
- **Move this workout** — one tap sends the active session to the previous day (“Did this last night?”) or, when viewing a past day, forward a day. Reps, sets, and done-state move with it; the view follows so you see it land. Both days re-sync to Supabase.
- **Today** jumps back to the current day. Tapping the Tonight tab always returns to today.

## Timezone of the 4am cutoff

The logical day (and the 4am rollover) is now pinned to **Mountain time (`America/Denver`)**, not the device’s timezone — so the day a workout counts toward is identical whether you open the app at home or while traveling. This anchors `today()`, both workout/crew streaks, and the resist-day mapping. `America/Denver` follows daylight saving (MST in winter, MDT in summer), so the cutoff is always 4am by the Mountain wall clock. If you actually want fixed MST year-round (Arizona, no DST), change the single constant `APP_TZ` to `America/Phoenix`.