// levels.js — level definitions. Both modes share one engine; a level just sets
// the map, the starting gene pool, which pressures are available, and the win rule.

// Common starting gene pool: a varied, mostly-undefended prey population.
const WILD = {
  hue: { mean: 30, spread: 70 },
  speed: { mean: 1.0, spread: 0.16 },
  armor: { mean: 0.05, spread: 0.05 },
  toxinResistance: { mean: 0.05, spread: 0.05 },
};

const PATH_S = [
  { x: -20, y: 130 }, { x: 580, y: 130 }, { x: 580, y: 300 },
  { x: 180, y: 300 }, { x: 180, y: 470 }, { x: 820, y: 470 },
];

const PATH_ZIG = [
  { x: -20, y: 90 }, { x: 690, y: 90 }, { x: 690, y: 230 },
  { x: 130, y: 230 }, { x: 130, y: 370 }, { x: 690, y: 370 },
  { x: 690, y: 510 }, { x: -20, y: 510 },
];

export const LEVELS = [
  {
    id: "ext-1",
    mode: "extinction",
    name: "1 · First Predators",
    desc: "Classic defense. Wipe out the prey before they slip past. But every prey that escapes breeds — and the survivors pass on whatever helped them get through.",
    lesson: "Selection acts on survivors. If armored prey are the ones escaping your claws, the next generation will be more armored.",
    path: PATH_S,
    environmentHue: 90,
    start: WILD,
    popSize: 16,
    generations: 8,
    spawnInterval: 0.7,
    startEnergy: 200,
    incomePerGen: 95,
    allowedTowers: ["claw", "frost"],
    extinction: { baseHealth: 10 },
  },
  {
    id: "ext-2",
    mode: "extinction",
    name: "2 · Resistance Evolves",
    desc: "Venom is now available. Lean too hard on one pressure and the prey will evolve a counter to it. Mixing pressures keeps them from adapting.",
    lesson: "A single strong pressure selects for one defense. Diverse pressures stop any single counter-trait from taking over the population.",
    path: PATH_S,
    environmentHue: 90,
    start: WILD,
    popSize: 18,
    generations: 9,
    spawnInterval: 0.65,
    startEnergy: 230,
    incomePerGen: 105,
    allowedTowers: ["claw", "venom", "frost"],
    extinction: { baseHealth: 12 },
  },
  {
    id: "ext-3",
    mode: "extinction",
    name: "3 · Hide and Seek",
    desc: "A visual hunter joins in. It can barely see prey whose color matches the mossy background — so prey will evolve camouflage to slip past it.",
    lesson: "Predators drive prey toward camouflage; this is the start of a predator–prey arms race.",
    path: PATH_ZIG,
    environmentHue: 110,
    start: WILD,
    popSize: 18,
    generations: 10,
    spawnInterval: 0.6,
    startEnergy: 250,
    incomePerGen: 110,
    allowedTowers: ["claw", "venom", "hawk", "frost"],
    extinction: { baseHealth: 12 },
  },
  {
    id: "sur-1",
    mode: "survival",
    name: "4 · Breed for Green",
    desc: "Now YOU are the environment. The prey must survive — let at least the minimum through each generation. Your job is to shape them: place a visual hunter against the green background so only well-camouflaged (green) prey make it through.",
    lesson: "Directional selection: by removing one extreme each generation, you can shift a whole population's average trait — here, toward green.",
    path: PATH_S,
    environmentHue: 120,
    start: { ...WILD, hue: { mean: 25, spread: 80 } },
    popSize: 20,
    generations: 12,
    spawnInterval: 0.55,
    startEnergy: 240,
    incomePerGen: 130,
    allowedTowers: ["hawk", "frost", "claw"],
    survival: {
      minSurvivors: 5,
      winFraction: 0.72,
      target: { trait: "hue", value: 120, tolerance: 32, dir: "near", label: "green (120°)" },
    },
  },
  {
    id: "sur-2",
    mode: "survival",
    name: "5 · Build a Tank",
    desc: "Keep the species alive, but breed it tough. Use venom to cull the weak so only toxin-hardened prey survive to reproduce — and watch resistance climb generation by generation.",
    lesson: "The same culling logic builds ANY trait. Selecting against low resistance raises the population mean over time — but resistance can't go up instantly; it depends on the variation already present.",
    path: PATH_ZIG,
    environmentHue: 110,
    // Healthy standing variation in resistance gives selection something to grip,
    // and keeps the early population from collapsing under the first venom.
    start: { ...WILD, toxinResistance: { mean: 0.18, spread: 0.16 } },
    popSize: 22,
    generations: 18,
    spawnInterval: 0.5,
    startEnergy: 300,
    incomePerGen: 150,
    allowedTowers: ["venom", "frost", "hawk"],
    survival: {
      minSurvivors: 4,
      winFraction: 0.5,
      target: { trait: "toxinResistance", value: 0.45, tolerance: 0, dir: "above", label: "45%+ toxin resistance" },
    },
  },
];
