// test/difficulty.mjs — a difficulty PROBE (not a pass/fail test).
//
// Where balance.mjs runs every level with unlimited energy and only asks "can
// SOME strategy win?", this plays each level under the REAL economy (startEnergy
// + incomePerGen, buying towers across generations as income arrives) with a
// "competent player" policy, and measures how *hard* the level actually is.
//
// For each level it finds the best of several plausible strategies and reports a
// difficulty score in [0,1]:
//   0.0  trivial — a competent player always wins with lots of room to spare
//   0.5  winnable but every run is a nail-biter
//   1.0  effectively impossible even with good play
//
// It then prints a per-mode curve and flags where difficulty DROPS as the levels
// advance (the "sawtooth" we're trying to remove). Run:  node test/difficulty.mjs
//   --mode=extinction   limit to one mode
//   --trials=8          trials per strategy (default 6)
//   --verbose           per-level breakdown

const noopCtx = new Proxy({}, { get: () => () => {}, set: () => true });
const canvas = { width: 800, height: 600, getContext: () => noopCtx };
globalThis.performance = globalThis.performance || { now: () => Date.now() };
globalThis.requestAnimationFrame = () => 0;
globalThis.cancelAnimationFrame = () => {};

const base = new URL("../js/", import.meta.url);
const { Game } = await import(new URL("game.js", base));
const { LEVELS } = await import(new URL("levels.js", base));
const { TOWER_TYPES } = await import(new URL("tower.js", base));
const { meanTrait, hueDistance } = await import(new URL("genetics.js", base));

// An adaptive defender's pick: counter whatever defense the CURRENT (evolved)
// population leans on. This is the core skill the mode teaches — switching tools
// as prey adapt — without it the probe walls the instant prey out-evolve a fixed
// mix, which is a probe artifact, not real difficulty.
function adaptivePick(g, allowed, n) {
  const has = (t) => allowed.includes(t);
  const armor = meanTrait(g.genomes, "armor");
  const toxin = meanTrait(g.genomes, "toxinResistance");
  const camo = hueDistance(meanTrait(g.genomes, "hue"), g.env) < 28; // hawk blind to camouflaged prey
  if (n % 4 === 3 && has("frost")) return "frost";            // every 4th: slow them
  if (has("famine") && armor > 0.22) return "famine";          // area drain melts armored prey
  if (has("venom") && armor > 0.18 && toxin < 0.55) return "venom"; // venom ignores armor
  if (has("hawk") && !camo) return "hawk";                     // hunter only if prey are visible
  return "claw";
}

const args = process.argv.slice(2);
const opt = (name, def) => {
  const a = args.find((x) => x.startsWith(`--${name}=`));
  return a ? a.split("=")[1] : def;
};
const TRIALS = +opt("trials", 6);
const ONLY_MODE = opt("mode", null);
const VERBOSE = args.includes("--verbose");
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);

// --- placeable tiles near the path, ORDERED ALONG the path ------------------
// A competent player spreads coverage down the whole path, so we project each
// candidate onto the path and sort by arc-length position. (Sorting by raw
// nearest-distance instead clusters every tower in one path-dense spot and
// leaves the rest undefended — which made the probe's wins hinge on map quirks.)
function candidates(g) {
  const segs = [];
  let total = 0;
  for (let i = 0; i < g.path.length - 1; i++) {
    const a = g.path[i], b = g.path[i + 1];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    segs.push({ a, b, len, acc: total }); total += len;
  }
  const out = [];
  for (let c = 0; c < 20; c++) for (let r = 0; r < 15; r++) {
    if (!g.canPlace(c, r)) continue;
    const cx = c * 40 + 20, cy = r * 40 + 20;
    let best = 1e9, bestS = 0;
    for (const s of segs) {
      const dx = s.b.x - s.a.x, dy = s.b.y - s.a.y, L2 = dx * dx + dy * dy || 1;
      let t = ((cx - s.a.x) * dx + (cy - s.a.y) * dy) / L2;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      const px = s.a.x + dx * t, py = s.a.y + dy * t, dist = Math.hypot(cx - px, cy - py);
      if (dist < best) { best = dist; bestS = s.acc + s.len * t; }
    }
    if (best < 58) out.push({ c, r, s: bestS });
  }
  out.sort((a, b) => a.s - b.s);
  return out;
}
// Pick k cells evenly spread across the path-ordered list.
function spreadCells(cells, k) {
  if (cells.length <= k) return cells.slice();
  const res = [];
  for (let i = 0; i < k; i++) res.push(cells[Math.floor(i * (cells.length - 1) / Math.max(1, k - 1))]);
  return res;
}
// How much path length falls within `range` of a point — a cell's "coverage".
// Chokepoints (corners where the path doubles back) score highest.
function coverageOf(cx, cy, path, range) {
  let cov = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i], b = path[i + 1];
    const len = Math.hypot(b.x - a.x, b.y - a.y), steps = Math.ceil(len / 8), step = len / steps;
    for (let s = 0; s <= steps; s++) {
      const x = a.x + (b.x - a.x) * s / steps, y = a.y + (b.y - a.y) * s / steps;
      if (Math.hypot(cx - x, cy - y) <= range) cov += step;
    }
  }
  return cov;
}
// Candidates ranked by coverage (best chokepoints first) — models a player who
// concentrates fire where prey linger, the way defense is actually won.
function coverageCells(g, cells) {
  const range = 110;
  return cells
    .map((c) => ({ ...c, cov: coverageOf(c.c * 40 + 20, c.r * 40 + 20, g.path, range) }))
    .sort((a, b) => b.cov - a.cov);
}
// Bisection fill order: place the path midpoint first, then quarters, etc., so
// even a half-built plan keeps coverage spread rather than bunched at the start.
function spreadOrder(k) {
  const order = [], q = [[0, k - 1]];
  while (q.length) {
    const [lo, hi] = q.shift();
    if (lo > hi) continue;
    const mid = (lo + hi) >> 1;
    order.push(mid); q.push([lo, mid - 1]); q.push([mid + 1, hi]);
  }
  return order;
}

// Play a level under the REAL economy. `plan` is a list of tower types to build
// as soon as they're affordable; towers accrue across generations as income
// comes in — so early generations are lightly defended, like real play. Slots
// are spread along the path and filled midpoint-first for even coverage.
function playEconomy(idx, plan, opts = {}) {
  const lvl = LEVELS[idx];
  const g = new Game(canvas, {});
  g.load(lvl);
  if (opts.sell) for (const t of [...g.towers]) g.sellAt(t.x, t.y);

  // Defense is won by concentrating fire at chokepoints; shaping wants pressure
  // spread along the path. Pick the placement model accordingly.
  const cands = candidates(g);
  const concentrate = opts.concentrate || opts.adaptive;
  const slots = concentrate ? coverageCells(g, cands) : spreadCells(cands, plan.length);
  const order = concentrate
    ? slots.map((_, i) => i)            // best-coverage cells first
    : spreadOrder(slots.length);        // midpoint-first spread
  const cap = opts.adaptive ? slots.length : Math.min(plan.length, slots.length);
  let planPtr = 0;
  let minSurvivors = Infinity;

  const buy = () => {
    while (planPtr < cap) {
      const type = opts.adaptive ? adaptivePick(g, lvl.allowedTowers, planPtr) : plan[planPtr];
      if (g.energy < TOWER_TYPES[type].cost) break;   // can't afford the next tower yet
      const cell = slots[order[planPtr]];
      g.selectedTower = type;
      g.placeTower(cell.c * 40 + 20, cell.r * 40 + 20);
      planPtr++;
    }
  };

  let guard = 0;
  while (g.state !== "won" && g.state !== "lost" && guard < 4_000_000) {
    if (g.state === "idle") { buy(); g.startGeneration(); }
    if (g.state === "running") g._tick(0.05);
    if (g.state === "idle" || g.state === "won" || g.state === "lost") {
      if (g.survivors) minSurvivors = Math.min(minSurvivors, g.survivors.length);
    }
    guard++;
  }
  return { g, minSurvivors: minSurvivors === Infinity ? 0 : minSurvivors };
}

// How comfortably did this run go? (1 = walked it, 0 = squeaked / lost.)
function comfort(idx, res) {
  const { g } = res;
  if (g.state !== "won") return 0;
  const lvl = LEVELS[idx];
  const cat = g.category;
  const last = g.stats[g.stats.length - 1] || {};
  const speed = lvl.generations > 1 ? clamp01(1 - (g.gen - 1) / (lvl.generations - 1)) : 1;

  if (cat === "defense") {
    const baseFrac = g.maxBaseHealth ? g.baseHealth / g.maxBaseHealth : 1;
    return clamp01(0.7 * baseFrac + 0.3 * speed);
  }
  if (cat === "shaping") {
    const goal = lvl.goal;
    const fracMargin = clamp01((last.fraction - goal.winFraction) / Math.max(0.05, 1 - goal.winFraction));
    const survSafety = clamp01((res.minSurvivors - goal.minSurvivors) / Math.max(1, lvl.popSize - goal.minSurvivors));
    return clamp01(0.45 * fracMargin + 0.35 * survSafety + 0.2 * speed);
  }
  // drift & speciation: winning fast (and not on the brink) is the comfort signal
  return clamp01(0.6 * speed + 0.4 * clamp01(res.minSurvivors / Math.max(1, lvl.popSize * 0.3)));
}

// Candidate strategies per level — the menu a thoughtful player would try.
function strategies(lvl) {
  const has = (t) => lvl.allowedTowers.includes(t);
  const rep = (t, k) => Array(k).fill(t);
  const S = [];
  // A defender spends everything: fill the path with a spread mix, capped only
  // by money and available cells. `pat` repeats a mix up to a large length.
  const pat = (arr) => Array.from({ length: 52 }, (_, i) => arr[i % arr.length]);
  if (lvl.mode === "extinction") {
    // The defender adapts its tool to the evolving prey and concentrates fire at
    // chokepoints — the realistic competent strategy. A couple of fixed mixes are
    // kept as alternates in case a static plan happens to do better.
    S.push({ plan: pat(["claw"]), adaptive: true });
    S.push({ plan: pat(["claw", "claw", "frost"]), concentrate: true });
    if (has("hawk") && has("venom")) S.push({ plan: pat(["claw", "hawk", "venom", "frost"]), concentrate: true });
  } else if (lvl.mode === "survival") {
    const tr = lvl.goal.target;
    const sel = tr.trait === "toxinResistance" ? "venom"
      : tr.trait === "armor" ? (tr.dir === "below" ? "famine" : "claw") : "hawk";
    for (const k of [2, 3, 4, 5, 6]) S.push({ plan: rep(sel, k) });
  } else if (lvl.mode === "sexual") {
    const tr = lvl.goal.target;
    if (tr.dir === "above") { S.push({ plan: [], sell: true }); }
    else {
      const tools = has("famine") ? ["hawk", "famine"] : ["hawk"];
      for (const tw of tools) for (const k of [2, 3, 4, 5]) S.push({ plan: rep(tw, k) });
    }
  } else if (lvl.mode === "drift") {
    const tw = lvl.goal.kind === "fixation" ? "disaster" : "sanctuary";
    for (const k of [1, 2, 3, 4, 5]) S.push({ plan: rep(tw, k) });
  } else if (lvl.mode === "speciation") {
    for (const k of [2, 3, 4, 5]) S.push({ plan: rep("rift", k) });
  }
  return S;
}

// Difficulty of a level: 1 - ease, where ease rewards a high win-rate achieved
// with comfortable margins. We take the BEST strategy (a competent player finds
// a good plan), so difficulty reflects the best achievable, not a random flail.
function difficulty(idx) {
  const lvl = LEVELS[idx];
  let best = { ease: -1, winRate: 0, comfort: 0 };
  for (const s of strategies(lvl)) {
    let wins = 0, comfSum = 0;
    for (let t = 0; t < TRIALS; t++) {
      const res = playEconomy(idx, s.plan, { sell: s.sell, concentrate: s.concentrate, adaptive: s.adaptive });
      if (res.g.state === "won") { wins++; comfSum += comfort(idx, res); }
    }
    const winRate = wins / TRIALS;
    const avgComf = wins ? comfSum / wins : 0;
    const ease = winRate * (0.5 + 0.5 * avgComf);
    if (ease > best.ease) best = { ease, winRate, comfort: avgComf };
  }
  return { difficulty: 1 - Math.max(0, best.ease), winRate: best.winRate, comfort: best.comfort };
}

// --- run --------------------------------------------------------------------
const MODES = ["extinction", "survival", "sexual", "drift", "speciation"];
const bar = (d) => {
  const n = Math.round(d * 20);
  return "█".repeat(n) + "·".repeat(20 - n);
};

console.log(`Difficulty probe — ${TRIALS} trials/strategy, real economy\n`);
let totalDrops = 0;
for (const mode of MODES) {
  if (ONLY_MODE && mode !== ONLY_MODE) continue;
  const idxs = LEVELS.map((l, i) => [l, i]).filter(([l]) => l.mode === mode).map(([, i]) => i);
  if (!idxs.length) continue;
  console.log(`\n=== ${mode.toUpperCase()} (${idxs.length} levels) ===`);
  const diffs = [];
  let prev = null, drops = 0;
  for (const i of idxs) {
    const d = difficulty(i);
    diffs.push(d.difficulty);
    const dropFlag = prev != null && d.difficulty < prev - 0.1 ? "  ⬇ DROP" : "";
    if (dropFlag) drops++;
    if (VERBOSE || dropFlag)
      console.log(
        `  ${LEVELS[i].id.padEnd(14)} ${bar(d.difficulty)} ${d.difficulty.toFixed(2)}` +
        `  win ${(d.winRate * 100).toFixed(0).padStart(3)}%  comfort ${(d.comfort * 100).toFixed(0).padStart(3)}%${dropFlag}`
      );
    prev = d.difficulty;
  }
  totalDrops += drops;
  const span = `${diffs[0].toFixed(2)} → ${diffs[diffs.length - 1].toFixed(2)}`;
  const impossible = diffs.filter((d) => d >= 0.95).length;
  const trivialTail = diffs.slice(Math.floor(diffs.length / 2)).filter((d) => d < 0.2).length;
  console.log(`  curve ${span} | mid-late trivial: ${trivialTail} | near-impossible: ${impossible} | difficulty drops: ${drops}`);
}
console.log(`\nTotal difficulty drops across modes: ${totalDrops} (lower = smoother climb)`);
