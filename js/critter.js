// critter.js — an individual organism carrying a genome.
import { hueColor } from "./genetics.js";

export const BASE_HP = 70;
const BASE_PX_PER_SEC = 62;

export class Critter {
  constructor(genome, path) {
    this.genome = genome;
    this.path = path;
    this.seg = 0;            // current path segment index
    this.t = 0;              // 0..1 along current segment
    this.x = path[0].x;
    this.y = path[0].y;
    this.progress = 0;       // total distance travelled (for targeting + escape)

    // Bigger, tougher prey have a bit more health; armor itself is damage reduction.
    this.maxHp = BASE_HP * (1 + genome.armor * 0.4);
    this.hp = this.maxHp;

    this.alive = true;
    this.escaped = false;    // reached the end → survives to reproduce
    this.poison = [];        // [{dps, remaining}]
    this.slowFactor = 1;     // reset each frame, set by frost auras
    this.flash = 0;          // hit flash timer
  }

  // Armor and a big display both weigh prey down — the core trade-offs.
  effectiveSpeed() {
    const armorPenalty = 1 - this.genome.armor * 0.5;
    const ornamentPenalty = 1 - this.genome.ornament * 0.22;
    return this.genome.speed * armorPenalty * ornamentPenalty * this.slowFactor;
  }

  applyPoison(dps, duration) {
    this.poison.push({ dps, remaining: duration });
  }

  applySlow(factor, _dt) {
    // Strongest slow wins this frame.
    this.slowFactor = Math.min(this.slowFactor, 1 - factor);
  }

  hit(dmg, _source) {
    if (!this.alive) return;
    this.hp -= dmg;
    this.flash = 0.12;
    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
    }
  }

  update(dt, pxPerSec = BASE_PX_PER_SEC) {
    if (!this.alive || this.escaped) return;

    // Poison ticks (resistance already applied via reduced dps at apply time? No —
    // apply resistance here so stacking reflects current genome).
    const resist = 1 - this.genome.toxinResistance;
    for (const p of this.poison) {
      this.hit(p.dps * resist * dt, "venom");
      p.remaining -= dt;
    }
    this.poison = this.poison.filter((p) => p.remaining > 0);
    if (!this.alive) return;

    if (this.flash > 0) this.flash -= dt;

    // Move along the path.
    let move = pxPerSec * this.effectiveSpeed() * dt;
    this.slowFactor = 1; // reset; frost re-applies each frame

    while (move > 0 && this.seg < this.path.length - 1) {
      const a = this.path[this.seg];
      const b = this.path[this.seg + 1];
      const segLen = Math.hypot(b.x - a.x, b.y - a.y);
      const remain = segLen * (1 - this.t);
      if (move < remain) {
        this.t += move / segLen;
        move = 0;
      } else {
        move -= remain;
        this.seg++;
        this.t = 0;
      }
    }

    const a = this.path[this.seg];
    const b = this.path[Math.min(this.seg + 1, this.path.length - 1)];
    this.x = a.x + (b.x - a.x) * this.t;
    this.y = a.y + (b.y - a.y) * this.t;
    this.progress = this.seg + this.t;

    if (this.seg >= this.path.length - 1) {
      this.escaped = true; // made it through — survives to breed
    }
  }

  draw(ctx) {
    const g = this.genome;
    const r = 9;

    // Toxin-resistance halo.
    if (g.toxinResistance > 0.05) {
      ctx.save();
      ctx.globalAlpha = 0.18 + g.toxinResistance * 0.4;
      ctx.fillStyle = "#a78bfa";
      ctx.beginPath();
      ctx.arc(this.x, this.y, r + 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Showy ornament: a bright plume trailing behind the body.
    if (g.ornament > 0.08) {
      const len = 6 + g.ornament * 22;
      // Point the plume roughly backward along travel.
      const ahead = this.path[Math.min(this.seg + 1, this.path.length - 1)];
      let dx = this.x - ahead.x, dy = this.y - ahead.y;
      const m = Math.hypot(dx, dy) || 1; dx /= m; dy /= m;
      ctx.save();
      ctx.strokeStyle = hueColor((g.hue + 180) % 360, 90, 62);
      ctx.globalAlpha = 0.85;
      ctx.lineWidth = 2 + g.ornament * 4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + dx * len, this.y + dy * len);
      ctx.stroke();
      ctx.restore();
    }

    // Body coloured by hue gene.
    ctx.beginPath();
    ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
    ctx.fillStyle = this.flash > 0 ? "#ffffff" : hueColor(g.hue);
    ctx.fill();

    // Armor ring — thicker = more armored.
    ctx.lineWidth = 1 + g.armor * 5;
    ctx.strokeStyle = "rgba(20,24,30,0.85)";
    ctx.stroke();

    // Health bar.
    const w = 20;
    const frac = this.hp / this.maxHp;
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(this.x - w / 2, this.y - r - 7, w, 3);
    ctx.fillStyle = frac > 0.5 ? "#4fd1a5" : frac > 0.25 ? "#ffce5c" : "#ff6b6b";
    ctx.fillRect(this.x - w / 2, this.y - r - 7, w * frac, 3);
  }
}
