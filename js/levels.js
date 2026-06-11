// levels.js — 90 levels (30 per mode) built by a difficulty-scaling generator.
// All three modes share one engine; a level sets the map, the founding gene pool,
// the available pressures, and the win rule. Levels are grouped into six themed
// chapters of five per mode; each chapter teaches a concept, ramps difficulty, and
// is tied to a real-world case study (shown in the end-of-level debrief).

// ---- maps -------------------------------------------------------------------
const PATH_S = [
  { x: -20, y: 130 }, { x: 580, y: 130 }, { x: 580, y: 300 },
  { x: 180, y: 300 }, { x: 180, y: 470 }, { x: 820, y: 470 },
];
const PATH_ZIG = [
  { x: -20, y: 90 }, { x: 690, y: 90 }, { x: 690, y: 230 },
  { x: 130, y: 230 }, { x: 130, y: 370 }, { x: 690, y: 370 },
  { x: 690, y: 510 }, { x: -20, y: 510 },
];
const PATH_SNAKE = [
  { x: -20, y: 80 }, { x: 720, y: 80 }, { x: 720, y: 210 }, { x: 80, y: 210 },
  { x: 80, y: 340 }, { x: 720, y: 340 }, { x: 720, y: 470 }, { x: -20, y: 470 },
];
const PATH_U = [
  { x: -20, y: 110 }, { x: 650, y: 110 }, { x: 650, y: 490 },
  { x: 150, y: 490 }, { x: 150, y: 290 }, { x: 820, y: 290 },
];
const PATH_CHICANE = [
  { x: -20, y: 300 }, { x: 180, y: 300 }, { x: 180, y: 110 }, { x: 420, y: 110 },
  { x: 420, y: 490 }, { x: 640, y: 490 }, { x: 640, y: 200 }, { x: 820, y: 200 },
];
const MAPS = [PATH_S, PATH_ZIG, PATH_SNAKE, PATH_U, PATH_CHICANE];

// ---- helpers ----------------------------------------------------------------
const lerp = (a, b, t) => a + (b - a) * t;
const ri = (a, b, t) => Math.round(lerp(a, b, t));
const roman = ["I", "II", "III", "IV", "V"];
const SURV_TRAITS = ["hue", "speed", "armor", "toxinResistance"];
const SEX_TRAITS = ["ornament", "preference", "speed", "hue"];
const DRIFT_TRAITS = ["hue", "speed"];
const SPEC_TRAITS = ["hue", "speed"];
const PREFIX = { extinction: "E", survival: "S", sexual: "X", drift: "D", speciation: "P" };
const shapeGoal = (minSurvivors, winFraction, target) => ({ minSurvivors, winFraction, target });

// Assemble one mode's levels from its chapters (5 levels each).
function buildMode(mode, chapters) {
  const total = chapters.length * 5;
  const prefix = PREFIX[mode] || "?";
  const out = [];
  chapters.forEach((chapter, ch) => {
    for (let sub = 0; sub < 5; sub++) {
      const i = ch * 5 + sub;
      const t = total > 1 ? i / (total - 1) : 0;   // difficulty across the mode
      const st = sub / 4;                           // difficulty within the chapter
      const lvl = chapter.build(i, t, st, sub);
      lvl.id = `${mode}-${i + 1}`;
      lvl.mode = mode;
      lvl.name = `${prefix}${i + 1} · ${chapter.theme} · ${roman[sub]}`;
      lvl.lesson = lvl.lesson || chapter.lesson;
      lvl.traits = lvl.traits || chapter.traits;
      lvl.spawnInterval = lvl.spawnInterval ?? lerp(0.72, 0.46, t);
      lvl.path = lvl.path || MAPS[i % MAPS.length];
      lvl.example = lvl.example || (chapter.examples ? chapter.examples[sub % chapter.examples.length] : null);
      out.push(lvl);
    }
  });
  return out;
}

// ---- EXTINCTION (classic tower defense; survivors adapt to your pressures) ---
const EXTINCTION = buildMode("extinction", [
  {
    theme: "Claws", traits: SURV_TRAITS, examples: ["darwinFinch", "pepperedMoth"],
    lesson: "Selection acts on survivors. If armored prey are the ones escaping your claws, the next generation will be more armored.",
    build: (i, t, st) => ({
      desc: "Wipe out the prey before they reach the refuge. Whoever escapes breeds — and passes on whatever helped them through.",
      environmentHue: 95,
      start: { hue: { mean: 30, spread: 70 }, speed: { mean: 1.0, spread: 0.16 } },
      popSize: ri(14, 18, st), generations: ri(6, 9, st),
      startEnergy: ri(180, 220, st), incomePerGen: ri(90, 105, st),
      allowedTowers: ["claw", "frost"],
      extinction: { baseHealth: ri(11, 13, st) },
    }),
  },
  {
    theme: "Venom", traits: SURV_TRAITS, examples: ["warfarinRat"],
    lesson: "A single strong pressure selects for one defense. Diverse pressures stop any one counter-trait from taking over.",
    build: (i, t, st) => ({
      desc: "Venom is available. Lean too hard on one pressure and the prey evolve a counter to it. Mixing pressures keeps them off balance.",
      environmentHue: 80,
      start: { hue: { mean: 30, spread: 70 }, speed: { mean: 1.0, spread: 0.16 }, armor: { mean: 0.08, spread: 0.07 } },
      popSize: ri(16, 20, st), generations: ri(8, 11, st),
      startEnergy: ri(220, 250, st), incomePerGen: ri(100, 115, st),
      allowedTowers: ["claw", "venom", "frost"],
      extinction: { baseHealth: ri(12, 14, st) },
    }),
  },
  {
    theme: "The Hunter's Eye", traits: SURV_TRAITS, examples: ["pepperedMoth", "pocketMouse"],
    lesson: "Predators drive prey toward camouflage. That escalation — predator vs. prey defense — is an evolutionary arms race.",
    build: (i, t, st) => ({
      desc: "A visual hunter joins the fight. It can barely see prey that match the background, so the prey will evolve camouflage to slip past. Pair it with claws — alone it just trains them to hide.",
      environmentHue: 120,
      start: { hue: { mean: 25, spread: 80 }, speed: { mean: 1.05, spread: 0.16 } },
      popSize: ri(18, 22, st), generations: ri(9, 12, st),
      startEnergy: ri(240, 270, st), incomePerGen: ri(110, 125, st),
      allowedTowers: ["claw", "hawk", "frost"],
      extinction: { baseHealth: ri(12, 14, st) },
    }),
  },
  {
    theme: "Full Arsenal", traits: SURV_TRAITS, examples: ["darwinFinch", "pocketMouse", "warfarinRat", "pepperedMoth", "guppy"],
    lesson: "With every counter-trait under selection at once, no single defense saves the prey — but they can't max them all, because armor and display cost speed.",
    build: (i, t, st) => ({
      desc: "Every pressure is on the table now, and the prey arrive already partly adapted. Combine claws, venom and the hunter to leave no escape.",
      environmentHue: 110,
      start: {
        hue: { mean: 110, spread: 60 }, speed: { mean: 1.1, spread: 0.18 },
        armor: { mean: 0.15, spread: 0.1 }, toxinResistance: { mean: 0.15, spread: 0.1 },
      },
      popSize: ri(20, 24, st), generations: ri(11, 14, st),
      startEnergy: ri(260, 300, st), incomePerGen: ri(120, 140, st),
      allowedTowers: ["claw", "venom", "hawk", "frost"],
      extinction: { baseHealth: ri(13, 15, st) },
    }),
  },
  {
    theme: "Arms-Race Gauntlet", traits: SURV_TRAITS, examples: ["elephant", "hyena", "whale", "tiktaalik", "horse"],
    lesson: "Pre-adapted prey, breeding fast, will out-evolve a static defense. You have to keep adapting too — the Red Queen: run just to stay in place.",
    build: (i, t, st) => ({
      desc: "The toughest prey yet: well-defended, fast-breeding, swarming. Adapt your pressures every generation or be overrun.",
      environmentHue: 130,
      start: {
        hue: { mean: 130, spread: 50 }, speed: { mean: 1.2, spread: 0.2 },
        armor: { mean: 0.2, spread: 0.12 }, toxinResistance: { mean: 0.2, spread: 0.12 },
      },
      popSize: ri(22, 26, st), generations: ri(13, 16, st),
      startEnergy: ri(280, 320, st), incomePerGen: ri(130, 150, st),
      allowedTowers: ["claw", "venom", "hawk", "frost"],
      extinction: { baseHealth: ri(14, 16, st) },
    }),
  },
  {
    theme: "Scarcity", traits: SURV_TRAITS, examples: ["cavefish", "stickleback", "horse"],
    lesson: "Scarcity punishes costly armor, so it strikes exactly the prey your claws can't — when a defense becomes a burden, a new pressure exploits it.",
    build: (i, t, st) => ({
      desc: "Resource scarcity now drains heavily-armored prey. It hits the tough, slow ones your claws struggle with — squeeze the prey between predation and starvation so no body plan is safe.",
      environmentHue: 40,
      start: {
        hue: { mean: 40, spread: 50 }, speed: { mean: 1.15, spread: 0.18 },
        armor: { mean: 0.28, spread: 0.14 }, toxinResistance: { mean: 0.15, spread: 0.1 },
      },
      popSize: ri(22, 25, st), generations: ri(12, 15, st),
      startEnergy: ri(290, 330, st), incomePerGen: ri(135, 155, st),
      allowedTowers: ["claw", "famine", "venom", "frost"],
      extinction: { baseHealth: ri(15, 18, st) },
    }),
  },
]);

// ---- SURVIVAL (you are the environment; shape the population, keep it alive) -
const SURVIVAL = buildMode("survival", [
  {
    theme: "Breed for Green", traits: SURV_TRAITS, examples: ["pocketMouse", "pepperedMoth"],
    lesson: "Directional selection: remove one extreme each generation and the whole population's average shifts — here, toward green.",
    build: (i, t, st) => ({
      desc: "Now YOU are the environment. Keep the species alive (let the minimum through), and use the visual hunter against the green background so only well-camouflaged green prey survive to breed.",
      environmentHue: 120, path: PATH_S,
      start: { hue: { mean: 25, spread: 82 }, speed: { mean: 1.0, spread: 0.15 } },
      popSize: ri(18, 22, st), generations: ri(10, 13, st),
      startEnergy: ri(220, 250, st), incomePerGen: ri(120, 135, st),
      allowedTowers: ["hawk", "frost", "claw"],
      goal: shapeGoal(ri(5, 4, st), lerp(0.66, 0.76, st),
        { trait: "hue", value: 120, tolerance: ri(34, 26, st), dir: "near", label: "green (120°)" }),
    }),
  },
  {
    theme: "Build a Tank", traits: SURV_TRAITS, examples: ["warfarinRat", "stickleback"],
    lesson: "The same logic builds any trait — but selection can only act on variation that already exists, so resistance climbs slowly at first.",
    build: (i, t, st) => ({
      desc: "Keep the species alive but breed it tough. Cull the weak with venom so only toxin-hardened prey reproduce. Ramp up gradually — too much venom at once collapses the population.",
      environmentHue: 110, path: PATH_ZIG,
      start: { toxinResistance: { mean: 0.18, spread: 0.16 }, hue: { mean: 110, spread: 30 } },
      popSize: ri(20, 24, st), generations: ri(16, 19, st),
      startEnergy: ri(300, 330, st), incomePerGen: ri(150, 165, st),
      allowedTowers: ["venom", "frost", "hawk"],
      goal: shapeGoal(4, lerp(0.5, 0.62, st),
        { trait: "toxinResistance", value: lerp(0.45, 0.55, st), tolerance: 0, dir: "above", label: `${Math.round(lerp(0.45, 0.55, st) * 100)}%+ toxin resistance` }),
    }),
  },
  {
    theme: "Forge Armor", traits: SURV_TRAITS, examples: ["darwinFinch", "redDeer"],
    lesson: "Predators are agents of selection: clawed hunters kill the soft-bodied first, so the survivors are better armored. But armor slows prey, and too many claws wipe the soft founders out entirely.",
    build: (i, t, st) => ({
      desc: "Use clawed predators to cull the lightly-armored. The survivors pass on their plating, so armor climbs generation by generation. Ramp up slowly — a wall of claws annihilates the soft-shelled founders before they can breed.",
      environmentHue: 35, path: PATH_SNAKE,
      start: { armor: { mean: 0.2, spread: 0.17 }, hue: { mean: 35, spread: 35 }, speed: { mean: 1.05, spread: 0.15 } },
      popSize: ri(20, 24, st), generations: ri(15, 18, st),
      startEnergy: ri(260, 290, st), incomePerGen: ri(135, 150, st),
      allowedTowers: ["claw", "frost", "venom"],
      goal: shapeGoal(4, lerp(0.5, 0.6, st),
        { trait: "armor", value: lerp(0.42, 0.5, st), tolerance: 0, dir: "above", label: `${Math.round(lerp(0.42, 0.5, st) * 100)}%+ armor` }),
    }),
  },
  {
    theme: "Designer Colors", traits: SURV_TRAITS, examples: ["cichlid", "pocketMouse", "pepperedMoth"],
    lesson: "Selection toward an unusual target uses the same machinery — and tighter goals demand more careful, sustained pressure.",
    build: (i, t, st) => {
      const hue = [275, 200, 45, 330, 160][i % 5];
      return {
        desc: "Sculpt the population to a specific color by matching the background and culling the misfits. The tighter the shade you need, the more precise your selection must be.",
        environmentHue: hue, path: MAPS[i % MAPS.length],
        start: { hue: { mean: (hue + 120) % 360, spread: 80 }, speed: { mean: 1.05, spread: 0.16 } },
        popSize: ri(20, 24, st), generations: ri(13, 17, st),
        startEnergy: ri(250, 290, st), incomePerGen: ri(125, 145, st),
        allowedTowers: ["hawk", "frost", "claw"],
        goal: shapeGoal(4, lerp(0.62, 0.72, st),
          { trait: "hue", value: hue, tolerance: ri(34, 26, st), dir: "near", label: `${Math.round(hue)}°` }),
      };
    },
  },
  {
    theme: "Conservation", traits: SURV_TRAITS, examples: ["elephant", "darwinFinch", "whale"],
    lesson: "Small populations and harsh selection are a dangerous mix: push too hard and you cause the very extinction you were trying to prevent.",
    build: (i, t, st) => ({
      desc: "The hardest shaping of all: a demanding trait target with a thin survival margin. Apply enough pressure to hit the goal, but not so much that the species winks out.",
      environmentHue: 150, path: MAPS[(i + 2) % MAPS.length],
      start: { hue: { mean: 20, spread: 80 }, speed: { mean: 1.0, spread: 0.16 }, toxinResistance: { mean: 0.15, spread: 0.12 } },
      popSize: ri(18, 22, st), generations: ri(15, 19, st),
      startEnergy: ri(260, 300, st), incomePerGen: ri(130, 150, st),
      allowedTowers: ["hawk", "venom", "frost", "claw"],
      goal: shapeGoal(ri(4, 5, st), lerp(0.66, 0.74, st),
        { trait: "hue", value: 150, tolerance: ri(32, 26, st), dir: "near", label: "green-cyan (150°)" }),
    }),
  },
  {
    theme: "Use It or Lose It", traits: SURV_TRAITS, examples: ["cavefish", "horse", "stickleback"],
    lesson: "A once-useful trait that's now only a cost gets selected away. With the predators gone, heavy armor is pure burden — scarcity strips it back, just like cavefish losing eyes or sticklebacks shedding plates.",
    build: (i, t, st) => ({
      desc: "These prey inherited heavy armor from an age of predators that's now over. The armor only slows them and costs energy. Use scarcity to make the burden lethal, so the population sheds the plating it no longer needs.",
      environmentHue: 30, path: MAPS[(i + 1) % MAPS.length],
      start: { armor: { mean: 0.5, spread: 0.17 }, hue: { mean: 30, spread: 35 }, speed: { mean: 1.0, spread: 0.15 } },
      popSize: ri(20, 24, st), generations: ri(14, 17, st),
      startEnergy: ri(240, 270, st), incomePerGen: ri(120, 140, st),
      allowedTowers: ["famine", "frost"],
      goal: shapeGoal(4, lerp(0.5, 0.6, st),
        { trait: "armor", value: lerp(0.28, 0.22, st), tolerance: 0, dir: "below", label: `below ${Math.round(lerp(0.28, 0.22, st) * 100)}% armor` }),
    }),
  },
]);

// ---- SEXUAL SELECTION (mate choice vs. natural selection) --------------------
const HAWK_SPOTS_S = [{ col: 5, row: 5 }, { col: 9, row: 5 }, { col: 8, row: 9 }, { col: 13, row: 9 }];
const SEXUAL = buildMode("sexual", [
  {
    theme: "Runaway", traits: SEX_TRAITS, examples: ["widowbird", "cichlid"],
    lesson: "Fisherian runaway: choosy maters breed with showy maters, their offspring inherit both the display and the taste for it, and the ornament escalates on its own — once you lift the predators holding it down.",
    build: (i, t, st, sub) => ({
      desc: "These prey choose flashy mates, so the display wants to balloon. But a hunter is already here, picking off the showiest. Sell off that predation (right-click, or the Sell tool) to release the brakes and let runaway carry the display past the target.",
      environmentHue: 210, path: PATH_S, mateChoice: true, choosiness: lerp(5, 6, st),
      preplaced: HAWK_SPOTS_S.slice(0, sub < 2 ? 2 : sub < 4 ? 3 : 4).map((c) => ({ type: "hawk", ...c })),
      start: { ornament: { mean: 0.06, spread: 0.05 }, preference: { mean: 0.4, spread: 0.16 }, hue: { mean: 210, spread: 18 }, speed: { mean: 1.1, spread: 0.14 } },
      popSize: ri(18, 22, st), generations: ri(10, 13, st),
      startEnergy: ri(170, 200, st), incomePerGen: ri(75, 90, st),
      allowedTowers: ["hawk", "frost", "claw"],
      goal: shapeGoal(4, lerp(0.5, 0.6, st),
        { trait: "ornament", value: lerp(0.45, 0.55, st), tolerance: 0, dir: "above", label: `${Math.round(lerp(0.45, 0.55, st) * 100)}%+ display` }),
    }),
  },
  {
    theme: "Curb the Display", traits: SEX_TRAITS, examples: ["guppy"],
    lesson: "Natural selection can oppose sexual selection. A visual hunter punishes showy prey, so predation pulls the ornament back down — the handicap made lethal. Push too hard, though, and you wipe out the showy population.",
    build: (i, t, st) => ({
      desc: "Sexual selection has inflated the display. Use the visual hunter — which spots showy prey easily — to make the ornament too costly, dragging it below the target. Don't over-hunt: the prey are mostly showy now, so a wall of hunters collapses the species.",
      environmentHue: 210, path: PATH_ZIG, mateChoice: true, choosiness: lerp(4, 5, st),
      start: { ornament: { mean: 0.4, spread: 0.16 }, preference: { mean: 0.4, spread: 0.16 }, hue: { mean: 210, spread: 16 }, speed: { mean: 1.1, spread: 0.14 } },
      popSize: ri(18, 22, st), generations: ri(11, 14, st),
      startEnergy: ri(230, 260, st), incomePerGen: ri(105, 125, st),
      allowedTowers: ["hawk", "frost", "claw"],
      goal: shapeGoal(3, lerp(0.55, 0.62, st),
        { trait: "ornament", value: lerp(0.55, 0.48, st), tolerance: 0, dir: "below", label: `below ${Math.round(lerp(0.55, 0.48, st) * 100)}% display` }),
    }),
  },
  {
    theme: "The Handicap Balance", traits: SEX_TRAITS, examples: ["guppy", "redDeer"],
    lesson: "At equilibrium the mating benefit of a bigger ornament exactly offsets its survival cost. Tune predation to hold the display steady at that balance point — the handicap principle in action.",
    build: (i, t, st) => ({
      desc: "Hold the display at a precise middling size. Mate choice keeps pushing it up; your hunters push it down. Find the predation pressure where the two forces balance and the ornament settles into the target window.",
      environmentHue: 200, path: PATH_SNAKE, mateChoice: true, choosiness: lerp(4, 5, st),
      start: { ornament: { mean: 0.4, spread: 0.16 }, preference: { mean: 0.4, spread: 0.16 }, hue: { mean: 200, spread: 16 }, speed: { mean: 1.1, spread: 0.14 } },
      popSize: ri(20, 24, st), generations: ri(13, 16, st),
      startEnergy: ri(240, 275, st), incomePerGen: ri(115, 135, st),
      allowedTowers: ["hawk", "frost", "claw"],
      goal: shapeGoal(3, lerp(0.5, 0.58, st),
        { trait: "ornament", value: 0.5, tolerance: lerp(0.16, 0.12, st), dir: "near", label: "≈50% display" }),
    }),
  },
  {
    theme: "Strong Preference", traits: SEX_TRAITS, examples: ["widowbird", "cichlid"],
    lesson: "When the taste for showy mates is intense, runaway is powerful — and only heavy, sustained natural selection can hold it in check without dooming the species.",
    build: (i, t, st) => ({
      desc: "Mate choice here is fierce, so the display rockets upward and resists being pushed down. It takes determined hunting to suppress it to target — but every hunter you add edges the small population closer to collapse. Walk the line.",
      environmentHue: 215, path: PATH_U, mateChoice: true, choosiness: lerp(6, 7, st),
      start: { ornament: { mean: 0.45, spread: 0.16 }, preference: { mean: 0.5, spread: 0.16 }, hue: { mean: 215, spread: 16 }, speed: { mean: 1.15, spread: 0.16 } },
      popSize: ri(20, 24, st), generations: ri(13, 16, st),
      startEnergy: ri(260, 300, st), incomePerGen: ri(125, 145, st),
      allowedTowers: ["hawk", "frost", "claw", "venom"],
      goal: shapeGoal(3, lerp(0.52, 0.6, st),
        { trait: "ornament", value: lerp(0.6, 0.52, st), tolerance: 0, dir: "below", label: `below ${Math.round(lerp(0.6, 0.52, st) * 100)}% display` }),
    }),
  },
  {
    theme: "Coevolution Gauntlet", traits: SEX_TRAITS, examples: ["guppy", "cichlid", "widowbird"],
    lesson: "Ornament and preference co-evolve as a linked pair. Steering one means wrestling the whole runaway system — the ultimate test of balancing two selective forces at once.",
    build: (i, t, st) => ({
      desc: "Everything at once: strong mate choice, pre-adapted prey, tight targets and unforgiving maps. Master the tug-of-war between sexual and natural selection to land the display exactly where it's needed.",
      environmentHue: 220, path: MAPS[(i + 1) % MAPS.length], mateChoice: true, choosiness: lerp(5, 6, st),
      start: { ornament: { mean: 0.45, spread: 0.16 }, preference: { mean: 0.5, spread: 0.16 }, hue: { mean: 220, spread: 16 }, speed: { mean: 1.2, spread: 0.18 } },
      popSize: ri(22, 26, st), generations: ri(15, 18, st),
      startEnergy: ri(280, 320, st), incomePerGen: ri(135, 155, st),
      allowedTowers: ["hawk", "frost", "claw", "venom"],
      goal: shapeGoal(3, lerp(0.5, 0.58, st),
        { trait: "ornament", value: 0.46, tolerance: lerp(0.15, 0.11, st), dir: "near", label: "≈46% display" }),
    }),
  },
  {
    theme: "The Cost of Beauty", traits: SEX_TRAITS, examples: ["guppy", "redDeer", "widowbird"],
    lesson: "A showy ornament is costly two ways at once — it draws predators AND drains energy. Both natural-selection forces oppose the runaway, and you can wield either to find the balance.",
    build: (i, t, st) => ({
      desc: "Now the display is costly two ways: hunters spot it, and scarcity drains the energy it takes to grow. Use predation, starvation, or both to land the ornament in its target window without starving the species out.",
      environmentHue: 205, path: PATH_CHICANE, mateChoice: true, choosiness: lerp(6, 7, st),
      start: { ornament: { mean: 0.45, spread: 0.16 }, preference: { mean: 0.5, spread: 0.16 }, hue: { mean: 205, spread: 16 }, speed: { mean: 1.15, spread: 0.16 } },
      popSize: ri(22, 26, st), generations: ri(14, 17, st),
      startEnergy: ri(270, 310, st), incomePerGen: ri(130, 150, st),
      allowedTowers: ["famine", "hawk", "frost", "claw"],
      goal: shapeGoal(3, lerp(0.52, 0.6, st),
        { trait: "ornament", value: 0.4, tolerance: lerp(0.15, 0.11, st), dir: "near", label: "≈40% display" }),
    }),
  },
]);

// ---- GENETIC DRIFT (non-adaptive evolution; chance, not selection) ----------
const DRIFT = buildMode("drift", [
  {
    theme: "Lucky Few", traits: DRIFT_TRAITS, examples: ["cheetah", "elephantSeal"],
    lesson: "With no selection at all, a small population still evolves — allele frequencies drift at random, and a colour can fix purely by luck. Nothing here hunts by colour; only chance decides.",
    build: (i, t, st) => ({
      desc: "There's no 'best' colour — nothing selects on it. To make the population fix on ONE colour, you must shrink it: cull at random with Catastrophes so only a lucky few breed. Leave too few and they die out; leave too many and drift is too weak.",
      environmentHue: 215, path: PATH_S,
      start: { hue: { mean: 180, spread: 135 }, speed: { mean: 1.0, spread: 0.16 } },
      popSize: ri(9, 12, st), generations: ri(12, 14, st),
      startEnergy: ri(200, 230, st), incomePerGen: ri(95, 110, st),
      allowedTowers: ["disaster", "frost"],
      goal: { kind: "fixation", trait: "hue", threshold: 0.15, label: "fix one colour by drift" },
    }),
  },
  {
    theme: "Bottleneck", traits: DRIFT_TRAITS, examples: ["elephantSeal", "pingelap"],
    lesson: "The smaller the surviving group, the faster diversity is lost. A population squeezed through a bottleneck emerges genetically uniform — like elephant seals after the sealers.",
    build: (i, t, st) => ({
      desc: "Bigger, more diverse founders. Squeeze them hard through a Catastrophe bottleneck every generation so a single colour fixes by chance before time runs out.",
      environmentHue: 200, path: PATH_ZIG,
      start: { hue: { mean: 180, spread: 140 }, speed: { mean: 1.0, spread: 0.16 } },
      popSize: ri(13, 18, st), generations: ri(11, 14, st),
      startEnergy: ri(240, 280, st), incomePerGen: ri(115, 135, st),
      allowedTowers: ["disaster", "frost"],
      goal: { kind: "fixation", trait: "hue", threshold: 0.13, label: "fix one colour by drift" },
    }),
  },
  {
    theme: "Refuge", traits: DRIFT_TRAITS, examples: ["pingelap", "cheetah"],
    lesson: "Drift is the enemy of diversity. To conserve a small population's variation you must keep effective numbers up — here, by protecting refuges that carry the founding gene pool through each crash.",
    build: (i, t, st) => ({
      desc: "Now the goal flips: PRESERVE the colour diversity. Forced bottlenecks keep crashing the population and draining variation. Place Refuges — protected reservoirs of the founding diversity — to carry the gene pool through every crash.",
      environmentHue: 190, path: PATH_SNAKE,
      start: { hue: { mean: 180, spread: 150 }, speed: { mean: 1.0, spread: 0.16 } },
      popSize: ri(18, 22, st), generations: ri(10, 12, st),
      startEnergy: ri(280, 330, st), incomePerGen: ri(125, 150, st),
      allowedTowers: ["sanctuary", "frost"],
      bottlenecks: [{ atGen: 2, keep: 3 }, { atGen: 4, keep: 3 }, { atGen: 6, keep: 2 }, { atGen: 8, keep: 2 }, { atGen: 10, keep: 2 }],
      goal: { kind: "diversity", trait: "hue", threshold: lerp(0.38, 0.45, st), minSurvivors: 1, label: `keep colour diversity ≥${Math.round(lerp(0.38, 0.45, st) * 100)}%` },
    }),
  },
]);

// ---- SPECIATION (disruptive selection + assortative mating → two forms) ------
const SPECIATION = buildMode("speciation", [
  {
    theme: "Disruptive Selection", traits: SPEC_TRAITS, examples: ["rhagoletis", "cichlid"],
    lesson: "When the middle of a range is selected against and like mates with like, one population is pulled apart into two — the seed of a new species.",
    build: (i, t, st) => ({
      desc: "These prey mate with colour-similar partners. Place Rift predators that hunt the MIDDLE colours, emptying the centre so two forms survive at the extremes — and, breeding only with their own kind, stop interbreeding.",
      environmentHue: 180, path: PATH_S, assortment: lerp(8, 11, st),
      start: { hue: { mean: 180, spread: 85 }, speed: { mean: 1.05, spread: 0.16 } },
      popSize: ri(18, 22, st), generations: ri(11, 14, st),
      startEnergy: ri(240, 280, st), incomePerGen: ri(120, 140, st),
      allowedTowers: ["rift", "frost"],
      goal: { kind: "split", minSurvivors: 4, label: "two separated colour forms" },
    }),
  },
  {
    theme: "Reproductive Isolation", traits: SPEC_TRAITS, examples: ["rhagoletis", "darwinFinch"],
    lesson: "A split only sticks if the two forms stop interbreeding. Assortative mating is that barrier; without it, the extremes blend back into one.",
    build: (i, t, st) => ({
      desc: "Stronger mate-similarity here. Carve out the middle and hold the two colour forms apart long enough that they're reproductively isolated — two clusters that persist for generations.",
      environmentHue: 160, path: PATH_ZIG, assortment: lerp(10, 13, st),
      start: { hue: { mean: 160, spread: 85 }, speed: { mean: 1.05, spread: 0.16 } },
      popSize: ri(18, 24, st), generations: ri(11, 14, st),
      startEnergy: ri(250, 290, st), incomePerGen: ri(125, 145, st),
      allowedTowers: ["rift", "frost", "claw"],
      goal: { kind: "split", minSurvivors: 4, label: "two separated colour forms" },
    }),
  },
  {
    theme: "Two Species", traits: SPEC_TRAITS, examples: ["cichlid", "rhagoletis", "darwinFinch"],
    lesson: "Repeated across a lake or a landscape, disruptive selection plus isolation builds whole flocks of species — as in the cichlids of the African Great Lakes.",
    build: (i, t, st) => ({
      desc: "The full challenge: bigger, tighter populations on hard maps. Split them cleanly into two well-separated, balanced colour species and keep them isolated.",
      environmentHue: 200, path: MAPS[(i + 1) % MAPS.length], assortment: lerp(11, 14, st),
      start: { hue: { mean: 200, spread: 88 }, speed: { mean: 1.1, spread: 0.18 } },
      popSize: ri(20, 26, st), generations: ri(12, 15, st),
      startEnergy: ri(260, 300, st), incomePerGen: ri(130, 150, st),
      allowedTowers: ["rift", "frost", "claw"],
      goal: { kind: "split", minSurvivors: 4, label: "two separated colour forms" },
    }),
  },
]);

export const LEVELS = [...EXTINCTION, ...SURVIVAL, ...SEXUAL, ...DRIFT, ...SPECIATION];

// Group boundaries for the level picker (optgroups).
export const LEVEL_GROUPS = [
  { label: "🛡️ Extinction (classic defense)", start: 0, count: 30 },
  { label: "🌱 Survival (shape the species)", start: 30, count: 30 },
  { label: "💃 Sexual selection (mate choice)", start: 60, count: 30 },
  { label: "🎲 Genetic drift (chance, not selection)", start: 90, count: 15 },
  { label: "🧬 Speciation (one population becomes two)", start: 105, count: 15 },
];
