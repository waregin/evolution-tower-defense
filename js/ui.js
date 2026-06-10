// ui.js — DOM side panels, the genetics charts, and all input handling.
import { TRAITS, TRAIT_KEYS, meanTrait, hueColor } from "./genetics.js";
import { TOWER_TYPES } from "./tower.js";
import { LEVELS } from "./levels.js";

const LINE_COLORS = {
  hue: "#e57bb0",
  speed: "#82aaff",
  armor: "#ffb454",
  toxinResistance: "#9b7bff",
};

export class UI {
  constructor() {
    this.$ = (id) => document.getElementById(id);
    this.game = null;
    this.toastTimer = null;
    this._lastGenomes = null;
    this._traitCanvas = {};
    this._traitMean = {};
    this._buildLevelOptions();
    this._bindGlobal();
  }

  setGame(game) { this.game = game; }

  _buildLevelOptions() {
    const sel = this.$("level-select");
    sel.innerHTML = "";
    LEVELS.forEach((lvl, i) => {
      const o = document.createElement("option");
      o.value = i;
      o.textContent = lvl.name;
      sel.appendChild(o);
    });
  }

  // Called by main whenever a level is (re)loaded.
  onLevelLoaded() {
    const lvl = this.game.level;
    this.$("level-name").textContent = lvl.name;
    this.$("level-desc").textContent = lvl.desc;
    this._buildTowerButtons();
    this._buildTraitCharts();
    this._lastGenomes = null;
    this.$("board-overlay").innerHTML = "";
    this.render();
  }

  _buildTowerButtons() {
    const wrap = this.$("tower-buttons");
    wrap.innerHTML = "";
    this._towerBtns = {};
    for (const key of this.game.level.allowedTowers) {
      const def = TOWER_TYPES[key];
      const btn = document.createElement("button");
      btn.className = "tower-btn";
      btn.innerHTML = `
        <span class="tower-swatch" style="background:${def.color}">${def.icon}</span>
        <span class="tower-meta">
          <span class="tname">${def.name}</span>
          <span class="tdesc">${def.desc}</span>
        </span>
        <span class="tower-cost">${def.cost}</span>`;
      btn.title = def.selects;
      btn.addEventListener("click", () => this.game.selectTowerType(key));
      wrap.appendChild(btn);
      this._towerBtns[key] = btn;
    }
  }

  _buildTraitCharts() {
    const wrap = this.$("trait-charts");
    wrap.innerHTML = "";
    this._traitCanvas = {};
    this._traitMean = {};
    for (const key of TRAIT_KEYS) {
      const t = TRAITS[key];
      const box = document.createElement("div");
      box.className = "trait-chart";
      const mean = document.createElement("span");
      mean.className = "tc-mean";
      const cv = document.createElement("canvas");
      cv.width = 300; cv.height = 40;
      box.innerHTML = `<div class="tc-head"><span class="tc-name" title="${t.blurb}">${t.label}</span></div>`;
      box.querySelector(".tc-head").appendChild(mean);
      box.appendChild(cv);
      wrap.appendChild(box);
      this._traitCanvas[key] = cv;
      this._traitMean[key] = mean;
    }
  }

  // ---- per-frame render (kept cheap; heavy charts gated by generation) ----
  render() {
    const g = this.game;
    if (!g) return;
    const lvl = g.level;

    this.$("gen-num").textContent = `${g.gen}/${lvl.generations}`;
    this.$("energy").textContent = Math.floor(g.energy);
    this.$("pop").textContent = g.state === "running" ? g.critters.length : g.genomes.length;
    this.$("survivors").textContent = g.lastSurvivors == null ? "—" : g.lastSurvivors;

    const livesLabel = this.$("lives-stat").querySelector(".stat-label");
    const livesVal = this.$("lives");
    if (lvl.mode === "extinction") {
      livesLabel.textContent = "Base";
      livesVal.textContent = g.baseHealth;
      livesVal.style.color = g.baseHealth <= 3 ? "var(--danger)" : "";
    } else {
      livesLabel.textContent = "Need through";
      livesVal.textContent = `≥${lvl.survival.minSurvivors}`;
      livesVal.style.color = "";
    }

    this._renderGoal();
    this._renderTowerButtons();

    // Start button state.
    const start = this.$("start-btn");
    start.disabled = g.state === "running" || g.state === "won" || g.state === "lost";
    start.textContent = g.gen === 0 ? "▶ Release first generation" : "▶ Release next generation";

    // Redraw the genetics charts only when the gene pool object changes
    // (level load or a new generation bred) — not every animation frame.
    if (this._lastGenomes !== g.genomes || this._forceCharts) {
      this._lastGenomes = g.genomes;
      this._forceCharts = false;
      this._renderCharts();
    }
  }

  _renderGoal() {
    const g = this.game, lvl = g.level, box = this.$("goal-box");
    if (lvl.mode === "extinction") {
      box.innerHTML = `<div><span class="goal-target">Goal:</span> Survive all ${lvl.generations} generations, or drive the prey extinct. Each prey that reaches the refuge costs you 1 base — and breeds.</div>
        <div class="muted" style="margin-top:6px">${lvl.lesson}</div>`;
      return;
    }
    const frac = g.goalProgress();
    const need = lvl.survival.winFraction;
    const pct = Math.round(frac * 100);
    const fill = Math.min(100, (frac / need) * 100);
    box.innerHTML = `
      <div><span class="goal-target">Goal:</span> Keep the species alive (let ≥${lvl.survival.minSurvivors} through each generation) and breed it toward <b>${lvl.survival.target.label}</b>.</div>
      <div style="margin-top:6px">Population matching target: <b>${pct}%</b> <span class="muted">(need ${Math.round(need * 100)}%)</span></div>
      <div class="progress-track"><div class="progress-fill" style="width:${fill}%"></div></div>
      <div class="muted" style="margin-top:6px">${lvl.lesson}</div>`;
  }

  _renderTowerButtons() {
    const g = this.game;
    if (!this._towerBtns) return;
    for (const key of g.level.allowedTowers) {
      const btn = this._towerBtns[key];
      if (!btn) continue;
      const def = TOWER_TYPES[key];
      btn.classList.toggle("selected", g.selectedTower === key);
      btn.disabled = g.energy < def.cost;
      const cost = btn.querySelector(".tower-cost");
      cost.classList.toggle("cheap", g.energy >= def.cost);
    }
  }

  _renderCharts() {
    const genomes = this.game.genomes;
    for (const key of TRAIT_KEYS) {
      this._traitMean[key].textContent = TRAITS[key].describe(meanTrait(genomes, key));
      this._drawHistogram(this._traitCanvas[key], key, genomes);
    }
    this._drawTrend();
  }

  _drawHistogram(cv, key, genomes) {
    const ctx = cv.getContext("2d");
    const W = cv.width, H = cv.height;
    ctx.clearRect(0, 0, W, H);
    const t = TRAITS[key];
    const bins = 26;
    const counts = new Array(bins).fill(0);
    for (const g of genomes) {
      let f = (g[key] - t.min) / (t.max - t.min);
      let idx = Math.min(bins - 1, Math.max(0, Math.floor(f * bins)));
      counts[idx]++;
    }
    const maxC = Math.max(1, ...counts);

    // Target overlay (survival levels).
    const target = this.game.level.survival?.target;
    if (target && target.trait === key) {
      ctx.fillStyle = "rgba(79,209,165,0.16)";
      if (target.dir === "above") {
        const x = ((target.value - t.min) / (t.max - t.min)) * W;
        ctx.fillRect(x, 0, W - x, H);
      } else if (target.dir === "below") {
        const x = ((target.value - t.min) / (t.max - t.min)) * W;
        ctx.fillRect(0, 0, x, H);
      } else {
        const lo = ((target.value - target.tolerance - t.min) / (t.max - t.min)) * W;
        const hi = ((target.value + target.tolerance - t.min) / (t.max - t.min)) * W;
        ctx.fillRect(lo, 0, hi - lo, H);
      }
    }

    const bw = W / bins;
    for (let i = 0; i < bins; i++) {
      const h = (counts[i] / maxC) * (H - 4);
      ctx.fillStyle = t.wrap
        ? hueColor(t.min + ((i + 0.5) / bins) * (t.max - t.min))
        : LINE_COLORS[key];
      ctx.fillRect(i * bw + 0.5, H - h, bw - 1, h);
    }
  }

  _drawTrend() {
    const cv = this.$("trend-chart");
    const ctx = cv.getContext("2d");
    const W = cv.width, H = cv.height;
    ctx.clearRect(0, 0, W, H);
    const pad = { l: 6, r: 6, t: 16, b: 14 };
    const stats = this.game.stats;

    // Axis baseline.
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.beginPath(); ctx.moveTo(pad.l, H - pad.b); ctx.lineTo(W - pad.r, H - pad.b); ctx.stroke();

    if (stats.length === 0) {
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.font = "11px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("Run a generation to see traits evolve", W / 2, H / 2);
      this._drawLegend(ctx, W);
      return;
    }

    const maxGen = Math.max(this.game.level.generations, stats.length);
    const plotW = W - pad.l - pad.r;
    const plotH = H - pad.t - pad.b;
    const xFor = (i) => pad.l + (maxGen <= 1 ? 0 : (i / (maxGen - 1)) * plotW);

    for (const key of TRAIT_KEYS) {
      const t = TRAITS[key];
      ctx.strokeStyle = LINE_COLORS[key];
      ctx.lineWidth = 2;
      ctx.beginPath();
      stats.forEach((s, i) => {
        const norm = t.wrap ? s.means[key] / 360 : (s.means[key] - t.min) / (t.max - t.min);
        const x = xFor(s.gen - 1);
        const y = pad.t + (1 - norm) * plotH;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        ctx.fillStyle = LINE_COLORS[key];
        ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
      });
      ctx.stroke();
    }
    this._drawLegend(ctx, W);
  }

  _drawLegend(ctx, W) {
    ctx.font = "10px sans-serif";
    ctx.textAlign = "left";
    let x = 6;
    for (const key of TRAIT_KEYS) {
      ctx.fillStyle = LINE_COLORS[key];
      ctx.fillRect(x, 4, 8, 8);
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      const label = TRAITS[key].label;
      ctx.fillText(label, x + 11, 12);
      x += 13 + ctx.measureText(label).width + 8;
    }
  }

  showBanner(result) {
    const ov = this.$("board-overlay");
    ov.innerHTML = `
      <div class="banner ${result.won ? "win" : "lose"}">
        <h2>${result.won ? "🎉 Success" : "💀 Game over"}</h2>
        <p>${result.message}</p>
        <p class="muted">Pick another level or press Restart to try again.</p>
      </div>`;
  }

  showToast(title, msg) {
    const el = this.$("tip-toast");
    el.innerHTML = `<div class="toast-title">${title}</div><div>${msg}</div>`;
    el.classList.remove("hidden");
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => el.classList.add("hidden"), 5200);
  }

  // ---- input --------------------------------------------------------------
  bindBoard(onPlace, onSell, onHover) {
    const cv = this.$("board");
    const toBoard = (e) => {
      const rect = cv.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) * (cv.width / rect.width),
        y: (e.clientY - rect.top) * (cv.height / rect.height),
      };
    };
    cv.addEventListener("mousemove", (e) => onHover(toBoard(e)));
    cv.addEventListener("mouseleave", () => onHover(null));
    cv.addEventListener("click", (e) => onPlace(toBoard(e)));
    cv.addEventListener("contextmenu", (e) => { e.preventDefault(); onSell(toBoard(e)); });
  }

  _bindGlobal() {
    this.$("modal-close").addEventListener("click", () => this.$("modal").classList.add("hidden"));
    this.$("modal").addEventListener("click", (e) => {
      if (e.target === this.$("modal")) this.$("modal").classList.add("hidden");
    });
    this.$("help-btn").addEventListener("click", () => this.openHelp());
  }

  bindControls({ onStart, onSpeed, onRestart, onLevelChange }) {
    this.$("start-btn").addEventListener("click", onStart);
    this.$("speed-btn").addEventListener("click", () => {
      const s = onSpeed();
      this.$("speed-btn").textContent = `⏩ Speed: ${s}×`;
    });
    this.$("restart-btn").addEventListener("click", onRestart);
    this.$("level-select").addEventListener("change", (e) => onLevelChange(Number(e.target.value)));
  }

  openHelp() {
    this.$("modal-body").innerHTML = `
      <h2>🧬 How to play</h2>
      <p>This is a tower defense game about <b>evolution</b>. The critters on the path are <b>prey</b> carrying genes. The towers you place are <b>selection pressures</b> — predators and climate. Every prey that reaches the refuge survives to <b>reproduce</b>, passing its genes (with small mutations) to the next generation.</p>
      <h3>The two modes</h3>
      <ul>
        <li><b>Extinction</b> (classic defense): stop the prey. But survivors breed and adapt to whatever pressure you over-use — that's a predator–prey <b>arms race</b>. Win by surviving every generation or wiping the prey out.</li>
        <li><b>Survival</b> (you are the environment): the species must <b>not</b> go extinct, so you have to let some prey through. By choosing <i>which</i> prey die, you steer the population's average traits toward a goal.</li>
      </ul>
      <h3>Traits &amp; their counters</h3>
      <ul>
        <li><b>🦅 Clawed predator</b> → blocked by <b>armor</b> (but armor slows prey down).</li>
        <li><b>🧪 Venom</b> → blocked by <b>toxin resistance</b>.</li>
        <li><b>👁️ Visual hunter</b> → blocked by <b>color</b> matching the background (camouflage).</li>
        <li><b>❄️ Cold snap</b> → no damage, just slows prey so other pressures get more shots.</li>
      </ul>
      <h3>Controls</h3>
      <ul>
        <li>Click a pressure in the sidebar, then click an open tile to place it.</li>
        <li><span class="kbd">Right-click</span> a placed pressure to sell it for 60%.</li>
        <li>Press <b>Release next generation</b> when you're ready, between waves, to adjust your defenses.</li>
        <li>Watch the <b>Population genetics</b> charts: the histograms show this generation's gene spread; the line chart shows how each trait's average evolves over time.</li>
      </ul>
      <p class="muted">Tip: relying on a single pressure trains the prey to counter it. Diversify.</p>`;
    this.$("modal").classList.remove("hidden");
  }

  forceCharts() { this._forceCharts = true; }
}
