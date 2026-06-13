// genetics.js — heritable traits, breeding, mutation.
// A genome is a plain object mapping trait keys to numeric values.
// Inheritance is per-gene Mendelian (offspring takes one parent's allele) plus a
// small Gaussian mutation. We deliberately avoid blended (averaging) inheritance
// so the population keeps its variation and can keep evolving.

export const TRAITS = {
  hue: {
    label: "Color",
    min: 0, max: 360, wrap: true,
    mutation: 14, default: 30,
    unit: "°",
    describe: (v) => `${Math.round(v)}°`,
    blurb: "Body color. Matters when a visual predator can spot prey that stand out from the background.",
  },
  speed: {
    label: "Speed",
    min: 0.45, max: 2.3, wrap: false,
    mutation: 0.11, default: 1.0,
    unit: "×",
    describe: (v) => `${v.toFixed(2)}×`,
    blurb: "How fast prey move. Fast prey spend less time exposed to predators, but speed trades off against armor and display.",
  },
  armor: {
    label: "Armor",
    min: 0, max: 0.85, wrap: false,
    mutation: 0.07, default: 0.05,
    unit: "",
    describe: (v) => `${Math.round(v * 100)}%`,
    blurb: "Physical protection against clawed predators. Heavy armor is costly: it slows the prey down.",
  },
  toxinResistance: {
    label: "Toxin resist",
    min: 0, max: 0.92, wrap: false,
    mutation: 0.09, default: 0.05,
    unit: "",
    describe: (v) => `${Math.round(v * 100)}%`,
    blurb: "Resistance to venom. Protects against poison pressures but does nothing against claws or hawks.",
  },
  ornament: {
    label: "Display",
    min: 0, max: 1, wrap: false,
    mutation: 0.06, default: 0.04,
    unit: "",
    describe: (v) => `${Math.round(v * 100)}%`,
    blurb: "A showy ornament (bright plume). Wins matings when mates are choosy, but makes prey conspicuous to visual hunters and a touch slower — the handicap.",
  },
  preference: {
    label: "Mate choice",
    min: 0, max: 1, wrap: false,
    mutation: 0.06, default: 0.08,
    unit: "",
    describe: (v) => `${Math.round(v * 100)}%`,
    blurb: "How strongly maters prefer showy partners. Has no survival cost, but drags the ornament upward generation after generation (Fisherian runaway).",
  },
};

export const TRAIT_KEYS = Object.keys(TRAITS);

let spare = null;
// Standard normal via Box-Muller (cached spare value).
export function gaussian() {
  if (spare !== null) {
    const v = spare;
    spare = null;
    return v;
  }
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const mag = Math.sqrt(-2.0 * Math.log(u));
  spare = mag * Math.sin(2.0 * Math.PI * v);
  return mag * Math.cos(2.0 * Math.PI * v);
}

export function clamp(x, lo, hi) {
  return x < lo ? lo : x > hi ? hi : x;
}

// Wrap a circular value (like hue) into [min, max).
export function wrap(x, lo, hi) {
  const span = hi - lo;
  return ((((x - lo) % span) + span) % span) + lo;
}

function coerce(key, value) {
  const t = TRAITS[key];
  return t.wrap ? wrap(value, t.min, t.max) : clamp(value, t.min, t.max);
}

// Build a fresh genome from a level spec: { trait: {mean, spread} }.
// Traits the level doesn't mention fall back to the trait's neutral default.
export function randomGenome(spec) {
  const g = {};
  for (const key of TRAIT_KEYS) {
    const s = spec[key] || { mean: TRAITS[key].default, spread: 0 };
    g[key] = coerce(key, s.mean + gaussian() * (s.spread || 0));
  }
  return g;
}

// Weighted random index from an array of non-negative weights.
export function weightedIndex(weights, total) {
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return i;
  }
  return weights.length - 1;
}

// Produce an offspring genome from two parents.
export function breed(a, b) {
  const g = {};
  for (const key of TRAIT_KEYS) {
    const t = TRAITS[key];
    // Inherit one parent's allele, then mutate.
    let value = Math.random() < 0.5 ? a[key] : b[key];
    value += gaussian() * t.mutation;
    g[key] = coerce(key, value);
  }
  return g;
}

// Circular distance between two hues, in [0, 180].
export function hueDistance(a, b) {
  const d = Math.abs(((a - b) % 360 + 360) % 360);
  return d > 180 ? 360 - d : d;
}

export function hueColor(h, sat = 68, light = 55) {
  return `hsl(${Math.round(h)}, ${sat}%, ${light}%)`;
}

// Circular variance of a wrapping trait (hue), in [0, 1]: 0 = the whole
// population shares one value (fixed), ~1 = spread evenly around the circle.
// Used as the "genetic diversity" readout for the drift and speciation modes.
export function circularVariance(genomes, key = "hue") {
  if (!genomes.length) return 0;
  let sx = 0, sy = 0;
  for (const g of genomes) {
    const r = (g[key] * Math.PI) / 180;
    sx += Math.cos(r); sy += Math.sin(r);
  }
  return 1 - Math.hypot(sx, sy) / genomes.length;
}

// Detect whether a hue population has split into two well-separated clusters.
// Finds the two largest gaps around the colour circle (which carve the points
// into two arcs); a split needs both gaps wide and both arcs populated.
export function hueClusters(genomes, minGapDeg = 48, minFrac = 0.25) {
  const n = genomes.length;
  if (n < 4) return { split: false, quality: 0, sizes: [n, 0], sep: 0 };
  const hues = genomes.map((g) => g.hue).sort((a, b) => a - b);
  let g1 = { d: -1, after: 0 }, g2 = { d: -1, after: 0 };
  for (let i = 0; i < n; i++) {
    const d = ((hues[(i + 1) % n] - hues[i]) % 360 + 360) % 360;
    if (d > g1.d) { g2 = g1; g1 = { d, after: i }; }
    else if (d > g2.d) { g2 = { d, after: i }; }
  }
  const lo = Math.min(g1.after, g2.after), hi = Math.max(g1.after, g2.after);
  const sizeA = hi - lo, sizeB = n - sizeA;
  const minSize = Math.min(sizeA, sizeB);
  const sep = g2.d; // the smaller of the two big gaps
  const split = sep >= minGapDeg && minSize >= minFrac * n;
  const quality = Math.min(1, sep / 120) * Math.min(1, minSize / (minFrac * n));
  return { split, quality, sizes: [sizeA, sizeB], sep };
}

// Population-level mean for a trait. Hue is averaged on the circle.
export function meanTrait(genomes, key) {
  if (genomes.length === 0) return 0;
  if (TRAITS[key].wrap) {
    let sx = 0, sy = 0;
    for (const g of genomes) {
      const rad = (g[key] * Math.PI) / 180;
      sx += Math.cos(rad);
      sy += Math.sin(rad);
    }
    let deg = (Math.atan2(sy / genomes.length, sx / genomes.length) * 180) / Math.PI;
    return (deg + 360) % 360;
  }
  let sum = 0;
  for (const g of genomes) sum += g[key];
  return sum / genomes.length;
}
