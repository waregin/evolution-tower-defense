// tower.js — "selection pressures". Each tower kills prey that lack a specific
// defense, so over-using one pressure selects for the matching counter-trait.
import { hueDistance } from "./genetics.js";

export const TOWER_TYPES = {
  claw: {
    key: "claw",
    name: "Clawed predator",
    icon: "🦅",
    color: "#ff8a5c",
    cost: 70,
    range: 110,
    fireRate: 1.6,        // shots per second
    damage: 26,
    desc: "Physical hits. Blocked by armor.",
    selects: "Selects for armor (and indirectly slower, tougher prey).",
    // Armor reduces damage. Selects for armor.
    damageFor: (c) => 26 * (1 - c.genome.armor),
  },
  venom: {
    key: "venom",
    name: "Venom sprayer",
    icon: "🧪",
    color: "#a78bfa",
    cost: 85,
    range: 95,
    fireRate: 0.9,
    damage: 0,
    poisonDps: 15,
    poisonDuration: 2.4,
    desc: "Poison over time. Blocked by toxin resistance.",
    selects: "Selects for toxin resistance.",
    damageFor: (c) => 15 * (1 - c.genome.toxinResistance), // dps reference for AI/UI
  },
  hawk: {
    key: "hawk",
    name: "Visual hunter",
    icon: "👁️",
    color: "#5aa9ff",
    cost: 80,
    range: 130,
    fireRate: 1.3,
    damage: 34,
    desc: "Spots prey that clash with the background — or that flaunt a showy display. Camouflaged, plain prey are nearly safe.",
    selects: "Selects for body color matching the environment (camouflage), and against showy ornaments.",
    // Exposure rises with color contrast against the background AND with display
    // size. The display term is gentle so a hunter culls the showiest prey along a
    // gradient rather than wiping a uniformly-ornamented population all at once.
    damageFor: (c, env) =>
      34 * Math.min(1, hueDistance(c.genome.hue, env) / 110 + c.genome.ornament * 0.6),
  },
  frost: {
    key: "frost",
    name: "Cold snap",
    icon: "❄️",
    color: "#7fdbff",
    cost: 55,
    range: 100,
    fireRate: 0,
    damage: 0,
    slow: 0.45,
    desc: "Climate pressure. Slows nearby prey (no damage), exposing them longer.",
    selects: "An environmental tool — pairs well with damaging pressures.",
    damageFor: () => 0,
  },
  famine: {
    key: "famine",
    name: "Scarcity",
    icon: "🍂",
    color: "#caa86a",
    cost: 60,
    range: 105,
    fireRate: 0,
    damage: 0,
    drain: 14, // damage per second at full burden (armor + display = 1)
    desc: "Resource scarcity. Drains prey burdened by heavy armor or a showy display — lean, plain prey barely feel it.",
    selects: "Selects AGAINST costly traits (armor, display): drives them to shrink or be lost.",
    damageFor: (c) => 14 * (c.genome.armor + c.genome.ornament),
  },
  disaster: {
    key: "disaster",
    name: "Catastrophe",
    icon: "☄️",
    color: "#d65a5a",
    cost: 65,
    range: 115,
    fireRate: 1.3,
    damage: 26,
    desc: "Random, non-selective death — kills prey regardless of their genes. Shrinks the breeding pool so genetic drift takes over.",
    selects: "Selects for nothing: survival becomes a matter of luck (drift).",
    damageFor: () => 26,
  },
  sanctuary: {
    key: "sanctuary",
    name: "Refuge",
    icon: "🛟",
    color: "#5ec8a0",
    cost: 80,
    range: 90,
    fireRate: 0,
    damage: 0,
    passive: true,
    desc: "A protected refuge population. Each refuge re-seeds extra breeders carrying the founding diversity, shielding the gene pool from drift.",
    selects: "Counteracts drift by preserving population size and diversity.",
    damageFor: () => 0,
  },
  rift: {
    key: "rift",
    name: "Rift",
    icon: "🪓",
    color: "#b483ff",
    cost: 75,
    range: 120,
    fireRate: 1.3,
    damage: 32,
    desc: "Disruptive predator: hunts prey whose colour sits in the MIDDLE of the range, pushing the population toward two extremes.",
    selects: "Disruptive selection: removes intermediates, splitting the population in two.",
    // env carries the central hue to carve out; prey near it take full damage.
    damageFor: (c, env) => 32 * (1 - Math.min(1, hueDistance(c.genome.hue, env) / 90)),
  },
};

export class Tower {
  constructor(type, x, y) {
    this.type = type;
    this.def = TOWER_TYPES[type];
    this.x = x;
    this.y = y;
    this.cooldown = 0;
    this.beams = []; // recent shots, for rendering: {tx, ty, life}
  }

  inRange(c) {
    const dx = c.x - this.x;
    const dy = c.y - this.y;
    return dx * dx + dy * dy <= this.def.range * this.def.range;
  }

  update(dt, critters, env) {
    const def = this.def;

    // Passive structures (e.g. the Refuge) do nothing during the wave; their
    // effect is applied at breeding time by the game.
    if (def.passive) return;

    // Frost: continuous slowing aura, no targeting.
    if (def.slow) {
      for (const c of critters) {
        if (c.alive && this.inRange(c)) c.applySlow(def.slow, 0.25);
      }
      return;
    }

    // Famine: continuous draining aura; damage scales with the prey's burden
    // (armor + display), so it punishes costly traits and spares lean prey.
    if (def.drain) {
      for (const c of critters) {
        if (c.alive && !c.escaped && this.inRange(c)) {
          const burden = c.genome.armor + c.genome.ornament;
          if (burden > 0) c.hit(def.drain * burden * dt, "famine");
        }
      }
      return;
    }

    // Fade old beams.
    for (const b of this.beams) b.life -= dt;
    this.beams = this.beams.filter((b) => b.life > 0);

    this.cooldown -= dt;
    if (this.cooldown > 0) return;

    // Target the in-range prey furthest along the path (closest to escaping).
    let target = null;
    let best = -Infinity;
    for (const c of critters) {
      if (!c.alive || c.escaped) continue;
      if (!this.inRange(c)) continue;
      if (c.progress > best) {
        best = c.progress;
        target = c;
      }
    }
    if (!target) return;

    this.cooldown = 1 / def.fireRate;
    this.beams.push({ tx: target.x, ty: target.y, life: 0.12 });

    if (def.poisonDps) {
      target.applyPoison(def.poisonDps, def.poisonDuration);
    } else {
      const dmg = def.damageFor(target, env);
      target.hit(dmg, this.type);
    }
  }

  draw(ctx, selectedGhost) {
    const def = this.def;
    // Range ring.
    ctx.save();
    ctx.globalAlpha = 0.10;
    ctx.fillStyle = def.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, def.range, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Beams.
    ctx.save();
    ctx.strokeStyle = def.color;
    ctx.lineWidth = 2;
    for (const b of this.beams) {
      ctx.globalAlpha = Math.max(0, b.life / 0.12);
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(b.tx, b.ty);
      ctx.stroke();
    }
    ctx.restore();

    // Body.
    ctx.save();
    ctx.fillStyle = def.color;
    ctx.strokeStyle = "rgba(0,0,0,0.4)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(def.icon, this.x, this.y + 1);
    ctx.restore();
  }
}
