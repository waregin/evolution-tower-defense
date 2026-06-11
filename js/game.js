// game.js — the simulation engine shared by both modes.
import { Critter } from "./critter.js";
import { Tower, TOWER_TYPES } from "./tower.js";
import {
  TRAITS, TRAIT_KEYS, randomGenome, breed, meanTrait, hueDistance, hueColor, weightedIndex,
} from "./genetics.js";
import { getExample } from "./examples.js";

const GRID = { cols: 20, rows: 15, cell: 40 };
const SPEEDS = [1, 2, 4];

export class Game {
  constructor(canvas, hooks = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.hooks = hooks; // { onChange, onTip, onEnd }
    this.speedIdx = 0;
    this.hoverCell = null;
    this.selectedTower = null;
    this._lastTime = 0;
    this._raf = null;
  }

  // ---- lifecycle ----------------------------------------------------------
  load(level) {
    this.level = level;
    this.path = level.path;
    this.env = level.environmentHue;

    this.genomes = Array.from({ length: level.popSize }, () => randomGenome(level.start));
    this.towers = [];
    this.critters = [];
    this.occupied = new Set();

    this.energy = level.startEnergy;
    this.gen = 0;
    this.baseHealth = level.mode === "extinction" ? level.extinction.baseHealth : null;
    this.maxBaseHealth = this.baseHealth;
    this.lastSurvivors = null;
    this.stats = [];          // per generation: {gen, means, survivors, fraction}
    this.state = "idle";      // idle | running | won | lost
    this.result = null;
    this.selectedTower = null;
    this.sellMode = false;

    this._computeBlocked();
    this._placePreset(level.preplaced);
    // Note: no _emit() here — the UI rebuilds this level's panels in
    // onLevelLoaded() and renders itself. Emitting now would render against
    // the previous level's tower buttons.
    this._loop();
  }

  // Block only the cells the path actually runs through, so towers can line it.
  _computeBlocked() {
    this.blocked = new Set();
    const { cell } = GRID;
    for (let i = 0; i < this.path.length - 1; i++) {
      const a = this.path[i], b = this.path[i + 1];
      const len = Math.hypot(b.x - a.x, b.y - a.y);
      const steps = Math.ceil(len / 6);
      for (let s = 0; s <= steps; s++) {
        const x = a.x + ((b.x - a.x) * s) / steps;
        const y = a.y + ((b.y - a.y) * s) / steps;
        this.blocked.add(`${Math.floor(x / cell)},${Math.floor(y / cell)}`);
      }
    }
  }

  // Pre-place pressures the level starts with. They are normal towers the player
  // can sell or build around — the point is to give an existing force to manage.
  _placePreset(preset) {
    if (!preset) return;
    for (const p of preset) {
      const x = p.col * GRID.cell + GRID.cell / 2;
      const y = p.row * GRID.cell + GRID.cell / 2;
      const t = new Tower(p.type, x, y);
      t.col = p.col; t.row = p.row;
      this.towers.push(t);
      this.occupied.add(`${p.col},${p.row}`);
    }
  }

  // ---- generations --------------------------------------------------------
  startGeneration() {
    if (this.state !== "idle") return;
    this.gen++;
    if (this.gen > 1) this.energy += this.level.incomePerGen;
    this.spawnQueue = this.genomes.slice();
    this.spawnTimer = 0;
    this.critters = [];
    this.survivors = [];
    this.deaths = 0;
    this.state = "running";
    this.selectedTower = null;
    this._emit();
  }

  // Extinction levels track a base; survival and sexual levels share a "shaping"
  // goal (keep the species alive while steering a trait toward a target).
  get isShaping() { return this.level.mode !== "extinction"; }

  endGeneration() {
    // Record the distribution of the generation that just lived.
    const means = {};
    for (const k of TRAIT_KEYS) means[k] = meanTrait(this.genomes, k);
    const fraction = this.isShaping ? this._fractionMeetingTarget(this.genomes) : null;
    this.stats.push({ gen: this.gen, means, survivors: this.survivors.length, fraction });
    this.lastSurvivors = this.survivors.length;

    this._announceShift();

    const lvl = this.level;
    if (!this.isShaping) {
      if (this.baseHealth <= 0) return this._finish(false, "Your base was overrun. Too many prey broke through.");
      if (this.survivors.length === 0) return this._finish(true, "Extinction achieved — no prey survived to reproduce.");
      if (this.gen >= lvl.generations) return this._finish(true, "You held the line for every generation. Defense successful.");
    } else {
      const goal = lvl.goal;
      const met = fraction >= goal.winFraction && this.survivors.length >= goal.minSurvivors;
      if (this.survivors.length < goal.minSurvivors)
        return this._finish(false, `Only ${this.survivors.length} prey survived — below the ${goal.minSurvivors} needed. The species collapsed.`);
      if (met) return this._finish(true, `The population reached your target: ${goal.target.label}.`);
      if (this.gen >= lvl.generations) return this._finish(false, "Out of generations before the population reached the target trait.");
    }

    // Breed the next generation from this generation's survivors.
    this._breedNext();
    this.state = "idle";
    this._emit();
  }

  // Breed the next generation from the survivors. With mate choice on, showy
  // maters win the most matings: BOTH parents are drawn preferentially by their
  // display, and the strength of that bias scales with the population's evolved
  // mate preference. This assortative mating drags the ornament up toward a high
  // equilibrium (Fisherian runaway) until predation makes the display too costly.
  _breedNext() {
    const pool = this.survivors;
    const next = [];

    if (this.level.mateChoice && pool.length > 1) {
      const choosiness = this.level.choosiness ?? 6;
      let meanPref = 0;
      for (const p of pool) meanPref += p.preference;
      meanPref /= pool.length;
      const exp = 1 + choosiness * meanPref;
      let total = 0;
      const w = pool.map((p) => { const x = Math.pow(0.04 + p.ornament, exp); total += x; return x; });
      for (let i = 0; i < this.level.popSize; i++) {
        const dam = pool[weightedIndex(w, total)];
        const sire = pool[weightedIndex(w, total)];
        next.push(breed(dam, sire));
      }
    } else {
      for (let i = 0; i < this.level.popSize; i++) {
        const a = pool[Math.floor(Math.random() * pool.length)];
        let b = pool[Math.floor(Math.random() * pool.length)];
        if (pool.length > 1 && b === a) b = pool[(pool.indexOf(a) + 1) % pool.length];
        next.push(breed(a, b));
      }
    }
    this.genomes = next;
  }

  _fractionMeetingTarget(genomes) {
    const t = this.level.goal.target;
    let n = 0;
    for (const g of genomes) {
      const v = g[t.trait];
      if (t.dir === "above") { if (v >= t.value) n++; }
      else if (t.dir === "below") { if (v <= t.value) n++; }
      else {
        const d = TRAITS[t.trait].wrap ? hueDistance(v, t.value) : Math.abs(v - t.value);
        if (d <= t.tolerance) n++;
      }
    }
    return genomes.length ? n / genomes.length : 0;
  }

  goalProgress() {
    if (!this.isShaping) return null;
    return this._fractionMeetingTarget(this.genomes);
  }

  // Surface a teaching tip when a trait shifts noticeably between generations.
  _announceShift() {
    if (this.stats.length < 2) return;
    const prev = this.stats[this.stats.length - 2].means;
    const cur = this.stats[this.stats.length - 1].means;
    const msgs = {
      armor: ["Armor is climbing", "Survivors are better armored, so the population is getting tougher. Mix in venom — armor won't help against poison."],
      toxinResistance: ["Toxin resistance is rising", "Prey that shrugged off venom are breeding. Pure poison is losing its bite."],
      speed: ["Prey are getting faster", "Faster survivors are passing on speed — they spend less time in your kill zones."],
      hue: ["Camouflage is evolving", "Body color is shifting toward the background. Your visual hunter is training the prey to hide."],
      ornament: ["Runaway is underway", "Showy maters are winning the most matings, so the display keeps growing — even though it makes prey easier to catch. That's Fisherian runaway."],
      preference: ["Choosiness is spreading", "A taste for showy mates is itself being inherited, which pushes the ornament up even faster — preference and display co-evolve."],
    };
    const scan = this.level.mode === "sexual"
      ? ["ornament", "preference", "speed"]
      : ["armor", "toxinResistance", "speed"];
    let bestKey = null, bestDelta = 0;
    for (const k of scan) {
      const d = cur[k] - prev[k];
      if (d > bestDelta) { bestDelta = d; bestKey = k; }
    }
    const hueShift = hueDistance(cur.hue, prev.hue);
    if (this.level.mode !== "sexual" && hueShift > 12 && hueShift > bestDelta * 100) bestKey = "hue";
    const thresh = { armor: 0.05, toxinResistance: 0.05, speed: 0.08, hue: 12, ornament: 0.05, preference: 0.05 };
    if (bestKey && (bestKey === "hue" ? hueShift : bestDelta) >= thresh[bestKey]) {
      const [title, body] = msgs[bestKey];
      this.hooks.onTip?.(title, body);
    }
  }

  _finish(won, message) {
    this.state = won ? "won" : "lost";
    const outcome = this._computeOutcome(won);
    this.result = {
      won, message,
      stars: outcome.stars,
      score: outcome.score,
      breakdown: outcome.breakdown,
      recap: this._recap(),
      example: getExample(this.level.example),
      generations: this.gen,
    };
    this._emit();
    this.hooks.onEnd?.(this.result);
  }

  // Star rating (0–3). Shaping levels reward precise, fast selection — letting
  // only just enough prey through, per the original design note that excess
  // survivors mean weak selection. Extinction rewards a healthy base / a clean
  // wipe-out. Both reward finishing in fewer generations.
  _computeOutcome(won) {
    const lvl = this.level;
    const c01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
    const speed = lvl.generations > 1 ? c01(1 - (this.gen - 1) / (lvl.generations - 1)) : 1;
    const breakdown = [];
    let eff;

    if (!this.isShaping) {
      const baseFrac = this.maxBaseHealth ? this.baseHealth / this.maxBaseHealth : 1;
      const extinct = this.survivors.length === 0;
      eff = extinct ? 1 : 0.65 * baseFrac + 0.35 * speed;
      breakdown.push(["Base intact", `${Math.round(baseFrac * 100)}%`]);
      breakdown.push(["Generations", `${this.gen}/${lvl.generations}`]);
      if (extinct) breakdown.push(["Outcome", "prey driven fully extinct"]);
    } else {
      const goal = lvl.goal;
      const isCull = goal.target.dir !== "above";
      let precision = 1;
      if (isCull && this.stats.length) {
        let sum = 0;
        for (const st of this.stats) sum += Math.max(0, st.survivors - goal.minSurvivors);
        const avg = sum / this.stats.length;
        const denom = Math.max(1, lvl.popSize - goal.minSurvivors);
        precision = 1 - c01(avg / denom);
      }
      eff = isCull ? 0.55 * precision + 0.45 * speed : speed;
      breakdown.push(["Generations", `${this.gen}/${lvl.generations}`]);
      if (isCull) breakdown.push(["Selection tightness", `${Math.round(precision * 100)}%`]);
    }

    const stars = !won ? 0 : eff >= 0.66 ? 3 : eff >= 0.33 ? 2 : 1;
    return { stars, score: Math.round(eff * 1000), breakdown };
  }

  // A short "what your population did" summary: the goal trait plus the biggest
  // movers, from the founding generation to the last.
  _recap() {
    if (this.stats.length < 1) return [];
    const first = this.stats[0].means;
    const last = this.stats[this.stats.length - 1].means;
    const focus = this.isShaping ? this.level.goal.target.trait : null;
    const norm = (k, v) => (TRAITS[k].wrap ? v / 360 : (v - TRAITS[k].min) / (TRAITS[k].max - TRAITS[k].min));
    const movers = this.level.traits
      .map((k) => {
        const d = TRAITS[k].wrap ? hueDistance(first[k], last[k]) / 180 : Math.abs(norm(k, last[k]) - norm(k, first[k]));
        return { k, d };
      })
      .sort((a, b) => b.d - a.d);
    const order = [];
    if (focus) order.push(focus);
    for (const m of movers) if (m.k !== focus && m.d > 0.07 && order.length < 3) order.push(m.k);
    return order.map((k) => ({
      key: k,
      label: TRAITS[k].label,
      from: TRAITS[k].describe(first[k]),
      to: TRAITS[k].describe(last[k]),
    }));
  }

  // ---- player actions -----------------------------------------------------
  selectTowerType(type) {
    this.selectedTower = this.selectedTower === type ? null : type;
    if (this.selectedTower) this.sellMode = false;
    this._emit();
  }

  toggleSellMode() {
    this.sellMode = !this.sellMode;
    if (this.sellMode) this.selectedTower = null;
    this._emit();
  }

  // A tap/click on the board: sell if in sell mode, otherwise place.
  tapBoard(px, py) {
    if (this.sellMode) this.sellAt(px, py);
    else this.placeTower(px, py);
  }

  cellAt(px, py) {
    return { col: Math.floor(px / GRID.cell), row: Math.floor(py / GRID.cell) };
  }

  canPlace(col, row) {
    if (col < 0 || row < 0 || col >= GRID.cols || row >= GRID.rows) return false;
    if (this.blocked.has(`${col},${row}`)) return false;
    if (this.occupied.has(`${col},${row}`)) return false;
    return true;
  }

  placeTower(px, py) {
    if (!this.selectedTower) return false;
    const { col, row } = this.cellAt(px, py);
    if (!this.canPlace(col, row)) return false;
    const def = TOWER_TYPES[this.selectedTower];
    if (this.energy < def.cost) { this.hooks.onTip?.("Not enough energy", `${def.name} costs ${def.cost}.`); return false; }
    const x = col * GRID.cell + GRID.cell / 2;
    const y = row * GRID.cell + GRID.cell / 2;
    const t = new Tower(this.selectedTower, x, y);
    t.col = col; t.row = row;
    this.towers.push(t);
    this.occupied.add(`${col},${row}`);
    this.energy -= def.cost;
    this._emit();
    return true;
  }

  sellAt(px, py) {
    const { col, row } = this.cellAt(px, py);
    const idx = this.towers.findIndex((t) => t.col === col && t.row === row);
    if (idx === -1) return;
    const t = this.towers[idx];
    this.energy += Math.round(t.def.cost * 0.6);
    this.occupied.delete(`${col},${row}`);
    this.towers.splice(idx, 1);
    this._emit();
  }

  cycleSpeed() {
    this.speedIdx = (this.speedIdx + 1) % SPEEDS.length;
    this._emit();
    return SPEEDS[this.speedIdx];
  }
  get speed() { return SPEEDS[this.speedIdx]; }

  // ---- main loop ----------------------------------------------------------
  _loop() {
    cancelAnimationFrame(this._raf);
    this._lastTime = performance.now();
    const step = (now) => {
      let dt = (now - this._lastTime) / 1000;
      this._lastTime = now;
      dt = Math.min(dt, 0.05);
      if (this.state === "running") {
        for (let i = 0; i < this.speed; i++) this._tick(dt);
      }
      this.draw();
      this._raf = requestAnimationFrame(step);
    };
    this._raf = requestAnimationFrame(step);
  }

  _tick(dt) {
    // Spawn.
    if (this.spawnQueue.length) {
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0) {
        this.critters.push(new Critter(this.spawnQueue.shift(), this.path));
        this.spawnTimer = this.level.spawnInterval;
      }
    }

    for (const t of this.towers) t.update(dt, this.critters, this.env);

    const alive = [];
    for (const c of this.critters) {
      c.update(dt);
      if (c.escaped) {
        this.survivors.push(c.genome);
        if (this.level.mode === "extinction") {
          this.baseHealth -= 1;
          if (this.baseHealth <= 0) this.baseHealth = 0;
        }
        continue; // drop from active list
      }
      if (!c.alive) { this.deaths++; continue; }
      alive.push(c);
    }
    this.critters = alive;

    // Extinction mode: a depleted base is an immediate loss.
    if (this.level.mode === "extinction" && this.baseHealth <= 0) {
      return this._finish(false, "Your base was overrun. Too many prey broke through.");
    }

    // Generation ends when the queue is empty and nothing is left on the path.
    if (this.spawnQueue.length === 0 && this.critters.length === 0) {
      this.endGeneration();
    }
    this._emit();
  }

  _emit() { this.hooks.onChange?.(); }

  // ---- rendering ----------------------------------------------------------
  draw() {
    const ctx = this.ctx;
    const { width: W, height: H } = this.canvas;

    // Background tinted by the environment hue (the camouflage backdrop).
    ctx.fillStyle = hueColor(this.env, 22, 11);
    ctx.fillRect(0, 0, W, H);

    // Subtle grid.
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 1;
    for (let c = 0; c <= GRID.cols; c++) {
      ctx.beginPath(); ctx.moveTo(c * GRID.cell, 0); ctx.lineTo(c * GRID.cell, H); ctx.stroke();
    }
    for (let r = 0; r <= GRID.rows; r++) {
      ctx.beginPath(); ctx.moveTo(0, r * GRID.cell); ctx.lineTo(W, r * GRID.cell); ctx.stroke();
    }

    // Path.
    ctx.strokeStyle = "rgba(220,225,235,0.10)";
    ctx.lineWidth = 34;
    ctx.lineJoin = "round"; ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(this.path[0].x, this.path[0].y);
    for (let i = 1; i < this.path.length; i++) ctx.lineTo(this.path[i].x, this.path[i].y);
    ctx.stroke();
    ctx.strokeStyle = "rgba(220,225,235,0.05)";
    ctx.lineWidth = 26;
    ctx.stroke();

    // Start (spawn) and end (refuge) markers.
    const start = this.path[0], end = this.path[this.path.length - 1];
    this._marker(ctx, start, "#ff8a5c", "spawn");
    this._marker(ctx, end, "#4fd1a5", "refuge");

    for (const t of this.towers) t.draw(ctx);

    // Placement ghost.
    if (this.selectedTower && this.hoverCell) {
      const { col, row } = this.hoverCell;
      const ok = this.canPlace(col, row);
      const def = TOWER_TYPES[this.selectedTower];
      const x = col * GRID.cell + GRID.cell / 2;
      const y = row * GRID.cell + GRID.cell / 2;
      ctx.save();
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = ok ? def.color : "#ff6b6b";
      ctx.beginPath(); ctx.arc(x, y, def.range, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = ok ? 0.8 : 0.4;
      ctx.beginPath(); ctx.arc(x, y, 15, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    for (const c of this.critters) c.draw(ctx);
  }

  _marker(ctx, p, color, label) {
    const x = Math.max(14, Math.min(this.canvas.width - 14, p.x));
    ctx.save();
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.85;
    ctx.beginPath(); ctx.arc(x, p.y, 11, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "10px sans-serif"; ctx.textAlign = "center";
    ctx.fillText(label, x, p.y + 24);
    ctx.restore();
  }
}

export { GRID };
