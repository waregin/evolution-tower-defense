// test/balance.mjs — committed regression test for the level set.
//
// Runs the real game engine headlessly (mocking the canvas) and asserts that
// every one of the 90 levels: (1) is structurally valid, (2) runs to a terminal
// state without throwing, and (3) is winnable by at least one sensible strategy.
// It also sanity-checks the scoring and that every level's real-world example
// resolves to a sourced entry.
//
// Run with:  node test/balance.mjs
// Exits non-zero (and prints what broke) if any assertion fails — so a tweak to
// a trait constant or a level parameter can't silently make a level unbeatable.

const noopCtx = new Proxy({}, { get: () => () => {}, set: () => true });
const canvas = { width: 800, height: 600, getContext: () => noopCtx };
globalThis.performance = globalThis.performance || { now: () => Date.now() };
globalThis.requestAnimationFrame = () => 0;
globalThis.cancelAnimationFrame = () => {};

const base = new URL("../js/", import.meta.url);
const { Game } = await import(new URL("game.js", base));
const { LEVELS, LEVEL_GROUPS } = await import(new URL("levels.js", base));
const { EXAMPLES } = await import(new URL("examples.js", base));

const TRIALS = 4; // a winning strategy must succeed at least once in this many tries

// --- helpers: find placeable tiles near the path, and play a level ----------
function candidates(g) {
  const out = [];
  for (let c = 0; c < 20; c++) for (let r = 0; r < 15; r++) {
    if (!g.canPlace(c, r)) continue;
    const cx = c * 40 + 20, cy = r * 40 + 20;
    let best = 1e9;
    for (let i = 0; i < g.path.length - 1; i++) {
      const a = g.path[i], b = g.path[i + 1];
      const len = Math.hypot(b.x - a.x, b.y - a.y), steps = Math.ceil(len / 10);
      for (let s = 0; s <= steps; s++) {
        const x = a.x + (b.x - a.x) * s / steps, y = a.y + (b.y - a.y) * s / steps;
        best = Math.min(best, Math.hypot(cx - x, cy - y));
      }
    }
    if (best < 58) out.push({ c, r });
  }
  return out;
}
function spread(cells, k) {
  if (cells.length <= k) return cells.slice();
  const res = [];
  for (let i = 0; i < k; i++) res.push(cells[Math.floor(i * (cells.length - 1) / Math.max(1, k - 1))]);
  return res;
}
function play(idx, mix, sellPreplaced) {
  const g = new Game(canvas, {});
  g.load(LEVELS[idx]);
  g.energy = 99999; // tests strategy shape, not economy
  if (sellPreplaced) for (const t of [...g.towers]) g.sellAt(t.x, t.y);
  const cells = spread(candidates(g), mix.reduce((a, b) => a + b.k, 0));
  let pi = 0;
  for (const m of mix) for (let i = 0; i < m.k; i++) {
    const cell = cells[pi++];
    if (cell) { g.selectedTower = m.t; g.placeTower(cell.c * 40 + 20, cell.r * 40 + 20); }
  }
  let guard = 0;
  while (g.state !== "won" && g.state !== "lost" && guard < 2_000_000) {
    if (g.state === "idle") g.startGeneration();
    if (g.state === "running") g._tick(0.05);
    guard++;
  }
  return g;
}

// A small library of plausible strategies per level (one of them should win).
function strategies(lvl) {
  const has = (t) => lvl.allowedTowers.includes(t);
  const S = [];
  if (lvl.mode === "extinction") {
    for (const k of [3, 4, 5, 6]) S.push({ mix: [{ t: "claw", k }] });
    if (has("famine")) for (const k of [2, 3]) S.push({ mix: [{ t: "claw", k }, { t: "famine", k }] });
    if (has("hawk")) S.push({ mix: [{ t: "claw", k: 3 }, { t: "hawk", k: 2 }] });
    if (has("venom")) S.push({ mix: [{ t: "claw", k: 3 }, { t: "venom", k: 2 }] });
  } else if (lvl.mode === "survival") {
    const tr = lvl.goal.target;
    const sel = tr.trait === "toxinResistance" ? "venom"
      : tr.trait === "armor" ? (tr.dir === "below" ? "famine" : "claw") : "hawk";
    for (const k of [2, 3, 4, 5]) S.push({ mix: [{ t: sel, k }] });
  } else if (lvl.mode === "sexual") {
    const tr = lvl.goal.target;
    if (tr.dir === "above") { S.push({ mix: [], sell: true }); S.push({ mix: [] }); }
    else {
      const tools = has("famine") ? ["hawk", "famine"] : ["hawk"];
      for (const tw of tools) for (const k of [2, 3, 4]) S.push({ mix: [{ t: tw, k }] });
    }
  } else if (lvl.mode === "drift") {
    const tw = lvl.goal.kind === "fixation" ? "disaster" : "sanctuary";
    for (const k of [1, 2, 3, 4]) S.push({ mix: [{ t: tw, k }] });
  } else if (lvl.mode === "speciation") {
    for (const k of [2, 3, 4]) S.push({ mix: [{ t: "rift", k }] });
  }
  return S;
}
function isWinnable(idx) {
  for (const s of strategies(LEVELS[idx])) {
    for (let t = 0; t < TRIALS; t++) {
      if (play(idx, s.mix, s.sell).state === "won") return true;
    }
  }
  return false;
}

// --- assertions -------------------------------------------------------------
const failures = [];
const expect = (cond, msg) => { if (!cond) failures.push(msg); };

const EXPECT_COUNTS = { extinction: 30, survival: 30, sexual: 30, drift: 15, speciation: 15 };
const EXPECT_TOTAL = Object.values(EXPECT_COUNTS).reduce((a, b) => a + b, 0);
expect(LEVELS.length === EXPECT_TOTAL, `expected ${EXPECT_TOTAL} levels, got ${LEVELS.length}`);
const counts = {};
for (const l of LEVELS) counts[l.mode] = (counts[l.mode] || 0) + 1;
for (const m of Object.keys(EXPECT_COUNTS)) expect(counts[m] === EXPECT_COUNTS[m], `expected ${EXPECT_COUNTS[m]} ${m} levels, got ${counts[m]}`);
expect(LEVEL_GROUPS.reduce((a, g) => a + g.count, 0) === EXPECT_TOTAL, `level groups must cover ${EXPECT_TOTAL} levels`);

// Structure + example sourcing.
for (const l of LEVELS) {
  for (const f of ["id", "mode", "name", "desc", "lesson", "path", "popSize", "generations", "allowedTowers", "traits", "example"])
    expect(l[f] != null, `${l.id}: missing field ${f}`);
  if (l.mode === "extinction") expect(l.extinction?.baseHealth > 0, `${l.id}: bad extinction config`);
  else if (l.mode === "drift") expect(l.goal?.kind && l.goal.threshold != null, `${l.id}: bad drift goal`);
  else if (l.mode === "speciation") expect(l.goal?.kind === "split", `${l.id}: bad speciation goal`);
  else expect(l.goal?.target && l.goal.minSurvivors > 0, `${l.id}: bad goal config`);
  const ex = EXAMPLES[l.example];
  expect(ex && ex.source && ex.source.cite && ex.source.url, `${l.id}: example '${l.example}' missing or unsourced`);
}

// Every level runs to a terminal state and is winnable.
let winnable = 0;
for (let i = 0; i < LEVELS.length; i++) {
  let terminal = false;
  try { terminal = ["won", "lost"].includes(play(i, [{ t: LEVELS[i].allowedTowers.find((t) => t !== "frost") || "frost", k: 2 }]).state); }
  catch (e) { failures.push(`${LEVELS[i].id}: threw during play — ${e.message}`); }
  expect(terminal, `${LEVELS[i].id}: did not reach a terminal state`);
  if (isWinnable(i)) winnable++;
  else failures.push(`${LEVELS[i].id} (${LEVELS[i].name}): no strategy won in ${TRIALS} tries`);
}

// --- report -----------------------------------------------------------------
console.log(`Levels: ${LEVELS.length} | winnable: ${winnable}/${LEVELS.length}`);
if (failures.length) {
  console.error(`\n❌ ${failures.length} failure(s):`);
  for (const f of failures) console.error("  - " + f);
  process.exit(1);
}
console.log("✅ All balance and structure checks passed.");
