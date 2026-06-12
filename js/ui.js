// ui.js — DOM side panels, the genetics charts, and all input handling.
import { TRAITS, meanTrait, hueColor } from "./genetics.js";
import { TOWER_TYPES } from "./tower.js";
import { LEVELS, LEVEL_GROUPS } from "./levels.js";
import { Progress } from "./progress.js";

const starStr = (n) => "★★★☆☆☆".slice(3 - n, 6 - n); // n filled then empty, length 3

const LINE_COLORS = {
  hue: "#e57bb0",
  speed: "#82aaff",
  armor: "#ffb454",
  toxinResistance: "#9b7bff",
  ornament: "#ff5e9c",
  preference: "#65e0c0",
};

// Which traits a level shows in its genetics panel.
const shown = (lvl) => lvl.traits || ["hue", "speed", "armor", "toxinResistance"];

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

  // Build (or rebuild) the level picker, showing earned stars and locking
  // chapters that haven't been unlocked yet.
  _buildLevelOptions(selectedIndex = 0) {
    const sel = this.$("level-select");
    sel.innerHTML = "";
    for (const grp of LEVEL_GROUPS) {
      const og = document.createElement("optgroup");
      og.label = grp.label;
      for (let i = grp.start; i < grp.start + grp.count; i++) {
        const lvl = LEVELS[i];
        const o = document.createElement("option");
        o.value = i;
        const stars = Progress.starsFor(lvl.id);
        const locked = !Progress.isUnlocked(lvl.id);
        const tag = locked ? "  🔒" : stars > 0 ? `  ${starStr(stars)}` : "";
        o.textContent = lvl.name + tag;
        if (locked && i !== selectedIndex) o.disabled = true;
        og.appendChild(o);
      }
      sel.appendChild(og);
    }
    sel.value = String(selectedIndex);
    const total = this.$("star-total");
    if (total) total.textContent = `⭐ ${Progress.totalStars()}`;
  }

  refreshLevels(selectedIndex) { this._buildLevelOptions(selectedIndex); }

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
    // Sell tool — lets touch users (and anyone) remove a pressure without a
    // right-click: toggle it on, then tap a placed pressure.
    const sell = document.createElement("button");
    sell.className = "tower-btn sell-btn";
    sell.innerHTML = `
      <span class="tower-swatch" style="background:#3a4150">🗑️</span>
      <span class="tower-meta"><span class="tname">Sell tool</span>
        <span class="tdesc">Tap a placed pressure to sell it (60% refund).</span></span>`;
    sell.addEventListener("click", () => this.game.toggleSellMode());
    wrap.appendChild(sell);
    this._sellBtn = sell;
  }

  _buildTraitCharts() {
    const wrap = this.$("trait-charts");
    wrap.innerHTML = "";
    this._traitCanvas = {};
    this._traitMean = {};
    for (const key of shown(this.game.level)) {
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
      livesVal.textContent = `≥${lvl.goal.minSurvivors}`;
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
    const goal = lvl.goal;
    const frac = g.goalProgress();
    const need = goal.winFraction;
    const pct = Math.round(frac * 100);
    const fill = Math.min(100, (frac / need) * 100);
    const intro = lvl.mode === "sexual"
      ? `Keep the species alive (≥${goal.minSurvivors} through each generation) while the tug-of-war between mate choice and predation lands the display at <b>${goal.target.label}</b>.`
      : `Keep the species alive (let ≥${goal.minSurvivors} through each generation) and breed it toward <b>${goal.target.label}</b>.`;
    box.innerHTML = `
      <div><span class="goal-target">Goal:</span> ${intro}</div>
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
    if (this._sellBtn) this._sellBtn.classList.toggle("selected", g.sellMode);
  }

  _renderCharts() {
    const genomes = this.game.genomes;
    for (const key of shown(this.game.level)) {
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

    // Target overlay (survival / sexual shaping levels).
    const target = this.game.level.goal?.target;
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

    for (const key of shown(this.game.level)) {
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
    for (const key of shown(this.game.level)) {
      ctx.fillStyle = LINE_COLORS[key];
      ctx.fillRect(x, 4, 8, 8);
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      const label = TRAITS[key].label;
      ctx.fillText(label, x + 11, 12);
      x += 13 + ctx.measureText(label).width + 8;
    }
  }

  // End-of-level debrief: stars, a recap of what the population actually did,
  // and the matching real-world case study (with a low-key source).
  showDebrief(result, canNext) {
    // Quiet banner left on the board behind the modal.
    this.$("board-overlay").innerHTML = `
      <div class="banner ${result.won ? "win" : "lose"}">
        <h2>${result.won ? "🎉 Success" : "💀 Game over"}</h2>
        <p>${result.message}</p>
      </div>`;

    const stars = result.stars || 0;
    const starHTML = [0, 1, 2].map((k) => `<span class="${k < stars ? "on" : "off"}">★</span>`).join("");
    const breakdown = (result.breakdown || [])
      .map(([k, v]) => `<div><span class="bk-k">${k}</span><span class="bk-v">${v}</span></div>`).join("");
    const recap = (result.recap || [])
      .map((r) => `<div class="recap-row"><span class="recap-label">${r.label}</span>
        <span class="recap-change">${r.from} <span class="arrow">→</span> ${r.to}</span></div>`).join("");

    let example = "";
    const ex = result.example;
    if (ex) {
      example = `
        <div class="example-card">
          <div class="ex-head">In the real world</div>
          <div class="ex-taxon">${ex.taxon} <span class="ex-concept">· ${ex.concept}</span></div>
          <p class="ex-blurb">${ex.blurb}</p>
          <div class="ex-source"><a href="${ex.source.url}" target="_blank" rel="noopener noreferrer">source ↗</a>
            <span class="ex-cite">${ex.source.cite}</span></div>
        </div>`;
    }

    this.$("modal-body").innerHTML = `
      <div class="debrief">
        <div class="debrief-stars ${result.won ? "won" : "lost"}">${starHTML}</div>
        <h2 class="${result.won ? "win" : "lose"}">${result.won ? "Success!" : "Game over"}</h2>
        <p class="debrief-msg">${result.message}</p>
        <div class="score-breakdown">${breakdown}</div>
        ${recap ? `<h3>What your population did <span class="muted">· ${result.generations} generations</span></h3>
          <div class="recap">${recap}</div>` : ""}
        ${example}
        <div class="debrief-actions">
          <button class="btn" id="debrief-retry">↻ Retry</button>
          ${result.won && canNext ? `<button class="btn primary" id="debrief-next">Next level ▶</button>` : ""}
        </div>
      </div>`;
    this.$("modal").classList.remove("hidden");
    const close = () => this.$("modal").classList.add("hidden");
    this.$("debrief-retry").addEventListener("click", () => { close(); this._onRestart?.(); });
    const next = document.getElementById("debrief-next");
    if (next) next.addEventListener("click", () => { close(); this._onNext?.(); });
  }

  showToast(title, msg) {
    const el = this.$("tip-toast");
    el.innerHTML = `<div class="toast-title">${title}</div><div>${msg}</div>`;
    el.classList.remove("hidden");
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => el.classList.add("hidden"), 5200);
  }

  // ---- input --------------------------------------------------------------
  // onTap places-or-sells (per the game's sell mode); onSell is the explicit
  // right-click sell for mouse users.
  bindBoard(onTap, onSell, onHover) {
    const cv = this.$("board");
    const toBoard = (cx, cy) => {
      const rect = cv.getBoundingClientRect();
      return { x: (cx - rect.left) * (cv.width / rect.width), y: (cy - rect.top) * (cv.height / rect.height) };
    };
    cv.addEventListener("mousemove", (e) => onHover(toBoard(e.clientX, e.clientY)));
    cv.addEventListener("mouseleave", () => onHover(null));
    cv.addEventListener("click", (e) => onTap(toBoard(e.clientX, e.clientY)));
    cv.addEventListener("contextmenu", (e) => { e.preventDefault(); onSell(toBoard(e.clientX, e.clientY)); });
    // Touch: a tap places/sells; dragging a finger updates the placement ghost.
    cv.addEventListener("touchmove", (e) => {
      const tp = e.touches && e.touches[0];
      if (tp) onHover(toBoard(tp.clientX, tp.clientY));
    }, { passive: true });
    cv.addEventListener("touchend", (e) => {
      const tp = e.changedTouches && e.changedTouches[0];
      if (tp) { e.preventDefault(); const p = toBoard(tp.clientX, tp.clientY); onHover(p); onTap(p); }
    });
  }

  _bindGlobal() {
    this.$("modal-close").addEventListener("click", () => this.$("modal").classList.add("hidden"));
    this.$("modal").addEventListener("click", (e) => {
      if (e.target === this.$("modal")) this.$("modal").classList.add("hidden");
    });
    this.$("help-btn").addEventListener("click", () => this.openHelp());
  }

  bindControls({ onStart, onSpeed, onRestart, onLevelChange, onNext }) {
    this._onRestart = onRestart;
    this._onNext = onNext;
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
      <h3>The three modes (30 levels each)</h3>
      <ul>
        <li><b>🛡️ Extinction</b> (classic defense): stop the prey. But survivors breed and adapt to whatever pressure you over-use — that's a predator–prey <b>arms race</b>. Win by surviving every generation or wiping the prey out.</li>
        <li><b>🌱 Survival</b> (you are the environment): the species must <b>not</b> go extinct, so you have to let some prey through. By choosing <i>which</i> prey die, you steer the population's average traits toward a goal.</li>
        <li><b>💃 Sexual selection</b> (mate choice): these prey breed by choosing showy mates, so a costly <b>display</b> ornament keeps growing on its own (<i>Fisherian runaway</i>). The visual hunter spots showy prey easily, so your predation is the only force that can push the display back down. Most levels are a tug-of-war: hit a target display size without driving the species extinct.</li>
      </ul>
      <h3>Traits &amp; their counters</h3>
      <ul>
        <li><b>🦅 Clawed predator</b> → blocked by <b>armor</b> (but armor slows prey down).</li>
        <li><b>🧪 Venom</b> → blocked by <b>toxin resistance</b>.</li>
        <li><b>👁️ Visual hunter</b> → blocked by <b>color</b> matching the background (camouflage), and it easily spots big <b>displays</b>.</li>
        <li><b>❄️ Cold snap</b> → no damage, just slows prey so other pressures get more shots.</li>
        <li><b>🍂 Scarcity</b> → drains prey burdened by <b>heavy armor or a big display</b>; lean, plain prey barely feel it. Use it to make a once-useful trait too costly to keep (how cavefish lost their eyes).</li>
        <li><b>💃 Display / Mate choice</b> (sexual mode): a showy ornament wins matings but makes prey conspicuous and slow; the preference for showy mates is itself inherited, driving runaway.</li>
      </ul>
      <h3>Controls</h3>
      <ul>
        <li>Click a pressure in the sidebar, then click (or tap) an open tile to place it.</li>
        <li><span class="kbd">Right-click</span> a placed pressure to sell it — or use the <b>🗑️ Sell tool</b> and tap it (handy on touch screens).</li>
        <li>Press <b>Release next generation</b> when you're ready, between waves, to adjust your pressures.</li>
        <li>Watch the <b>Population genetics</b> charts: histograms show this generation's gene spread; the line chart shows how each trait's average evolves over time.</li>
      </ul>
      <h3>Stars &amp; progress</h3>
      <ul>
        <li>Each level scores <b>1–3 ⭐</b>. You earn more for finishing in fewer generations and, in shaping levels, for tight selection — letting only just enough prey through.</li>
        <li>Win a few levels in a chapter to <b>unlock the next</b>. Progress is saved in your browser.</li>
        <li>Every level ends with a <b>real-world case study</b> — the actual species and study behind the lesson, with a source.</li>
      </ul>
      <p class="muted">Tip: relying on a single pressure trains the prey to counter it. Diversify.</p>`;
    this.$("modal").classList.remove("hidden");
  }

  forceCharts() { this._forceCharts = true; }
}
