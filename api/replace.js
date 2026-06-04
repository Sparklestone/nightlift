// NIGHTLIFT — AI exercise replacement (Vercel serverless function)
// Keeps your Anthropic API key server-side. Set ANTHROPIC_API_KEY in your
// Vercel project: Settings → Environment Variables. Never put the key in the
// client. Costs a few cents of API usage per swap (separate from Claude.ai).

async function readBody(req) {
  if (req.body !== undefined && req.body !== null) return req.body;
  return await new Promise((resolve) => {
    let d = "";
    req.on("data", (c) => (d += c));
    req.on("end", () => { try { resolve(JSON.parse(d || "{}")); } catch { resolve({}); } });
    req.on("error", () => resolve({}));
  });
}

module.exports = async (req, res) => {
  if (req.method !== "POST") { res.status(405).json({ error: "POST only" }); return; }
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) { res.status(500).json({ error: "ANTHROPIC_API_KEY is not set in Vercel → Settings → Environment Variables" }); return; }

  try {
    let ctx = await readBody(req);
    if (typeof ctx === "string") { try { ctx = JSON.parse(ctx); } catch { ctx = {}; } }
    if (!ctx || typeof ctx !== "object") ctx = {};

    const system =
`You are an expert strength & conditioning coach for a minimalist at-home program.
Replace ONE exercise with a fresh, effective alternative.
Hard constraints:
- The ONLY equipment is: one 25 lb kettlebell, two 10 lb dumbbells, and bodyweight. Never suggest anything requiring other equipment.
- The replacement MUST train the same muscle group as the exercise being replaced.
- It must NOT duplicate any exercise already in the day's list (the "avoid" array).
- Joint-friendly and appropriate for a regular adult. With light loads, favor higher reps, a slow lowering tempo, and taking the final set close to failure.
Return ONLY a single minified JSON object — no prose, no markdown fences — with EXACTLY these keys:
{"name":string,"musc":string (e.g. "Quads · glutes"),"load":string (must be one of: "25 KB","2×10 DB","Bodyweight"),"sets":integer 2-4,"reps":string (e.g. "12–15" or "10–12 / side" or "to failure" or "30–60 sec"),"cues":[exactly 3 short imperative form-cue strings],"tech":string (one coaching sentence),"prog":string (one progression sentence),"pattern":one of ["squat","hinge","lunge","splitsquat","press","overhead","row","curl","raise","rearfly","swing","pushup","plank","calf","renegade"],"amrap":boolean (true if the last set should go to failure)}`;

    const userMsg = "Context:\n" + JSON.stringify(ctx) + "\n\nReturn the replacement exercise as strict JSON only.";

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 700,
        system,
        messages: [{ role: "user", content: userMsg }]
      })
    });

    const data = await r.json();
    if (!r.ok) {
      res.status(502).json({ error: (data && data.error && data.error.message) || ("Anthropic API error " + r.status) });
      return;
    }

    const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("").trim();
    let j = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    const a = j.indexOf("{"), b = j.lastIndexOf("}");
    if (a >= 0 && b >= 0) j = j.slice(a, b + 1);
    const out = JSON.parse(j);
    res.status(200).json(out);
  } catch (e) {
    res.status(500).json({ error: String((e && e.message) || e) });
  }
};
