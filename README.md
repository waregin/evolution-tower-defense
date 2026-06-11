# 🧬 Evolution Tower Defense

A tower defense game that teaches **evolution** — natural selection, heredity,
the predator–prey **arms race**, and **sexual selection** — by letting you *be*
the selection pressure. Three modes, **25 levels each (75 total)**.

The critters walking the path are **prey** carrying genes. The towers you place
are **selection pressures** (predators and climate). Crucially, every prey that
reaches the refuge **survives to reproduce**, passing its genes — with small
mutations — to the next generation. So the population you face in generation 2 is
descended from whoever got past you in generation 1. Lean on one pressure and the
prey evolve a counter to it. That feedback loop is the whole point.

## How it plays

It runs entirely in the browser — no build step, no dependencies. Just static
HTML, CSS, and vanilla JavaScript (ES modules) drawing to a `<canvas>`.

### Running it

Because it uses ES modules, you need to serve the folder over HTTP (opening
`index.html` directly with `file://` will be blocked by the browser):

```bash
# from the repo root, any static server works:
python3 -m http.server 8000
#   then open http://localhost:8000

# or:  npx serve .
```

It also works as-is on **GitHub Pages** (Settings → Pages → deploy from branch).

## Three modes, one engine

All three modes share the same simulation; they differ only in the win condition.
Each has **25 levels** organized into five themed chapters that introduce a
concept and ramp the difficulty.

- **🛡️ Extinction** (classic tower defense). Stop the prey before they reach the
  refuge. But survivors breed and adapt to whatever pressure you over-use — that's
  the predator–prey arms race made visible. Win by surviving every generation, or
  by wiping the prey out entirely. *(Chapters: Claws → Venom → The Hunter's Eye →
  Full Arsenal → Arms-Race Gauntlet.)*

- **🌱 Survival** (you are the environment). This is the inversion from the original
  design notes: the species must **not** go extinct, so you *have* to let some
  prey through. By choosing *which* prey die each generation, you steer the
  population's average traits toward a goal — breed it green, toxin-resistant,
  armored, or a designer color. Apply too little pressure and nothing changes;
  apply too much and you drive the species extinct. The sweet spot in between is
  real selection. *(Chapters: Breed for Green → Build a Tank → Forge Armor →
  Designer Colors → Conservation.)*

- **💃 Sexual selection** (mate choice vs. natural selection). These prey breed by
  choosing showy mates, so a costly **display** ornament keeps growing on its own —
  *Fisherian runaway*. Both the display and the *preference* for it are inherited,
  so they co-evolve and the ornament escalates toward a high natural equilibrium,
  even though it makes prey slower and easier for a visual hunter to spot (the
  *handicap principle*). Your predation is the only force that pushes the display
  back down, so most levels are a tug-of-war: land the ornament in a target window
  without driving the species extinct. *(Chapters: Runaway → Curb the Display →
  The Handicap Balance → Strong Preference → Coevolution Gauntlet.)*

## The biology, mapped to mechanics

Each prey has a **genome** of six heritable traits — four survival traits plus the
two sexual-selection genes (**display** and **mate preference**). Each tower selects
for the trait that counters it:

| Pressure | Counter-trait | What it teaches |
|---|---|---|
| 🦅 Clawed predator | **Armor** (but armor slows prey down) | Selection + trait trade-offs |
| 🧪 Venom sprayer | **Toxin resistance** | Selection limited by standing variation |
| 👁️ Visual hunter | **Color** matching the background, and *against* big displays | Camouflage; natural vs. sexual selection |
| ❄️ Cold snap | — (slows prey, no damage) | The environment as a pressure |

The two sexual-selection genes only come into play in mate-choice levels: a big
**display** wins matings but slows prey and makes them conspicuous, while
**preference** (the inherited taste for showy mates) is what drags the display
upward. Levels show only the handful of genes relevant to that level.

Inheritance is **per-gene Mendelian** (offspring takes one parent's allele) plus a
small Gaussian **mutation** — deliberately *not* blended/averaging inheritance, so
the population keeps the variation it needs to keep evolving. The **Population
genetics** panel shows it happening live: histograms of the current gene pool, and
a line chart of how each trait's average shifts generation over generation.

### Things you can watch emerge
- Over-using the clawed predator selects for armor — and the population literally
  gets tougher each generation, blunting your strategy (arms race).
- A single pressure trains a single counter; **mixing** pressures keeps any one
  counter-trait from taking over.
- Selection can only act on variation that already exists, so a trait that starts
  rare (like high toxin resistance) climbs slowly at first.
- In survival mode, too much selection pressure collapses the population — a real
  conservation-genetics lesson about over-selection and small populations.
- In sexual-selection mode, a costly ornament runs away on its own through mate
  choice, and only predation (natural selection) can rein it back in — you can
  literally watch the two forces fight to a balance point.

## Project layout

```
index.html        markup + canvas + sidebar
styles.css        styling
js/
  genetics.js     traits, heredity, mutation, population stats
  critter.js      an individual organism (movement, defenses, rendering)
  tower.js        selection pressures (trait-dependent damage)
  levels.js       the 75-level generator (25 per mode, five chapters each)
  game.js         the simulation engine (generations, breeding, mate choice, win/loss)
  ui.js           sidebar panels, the live genetics charts, input handling
  main.js         bootstrap that wires the game and UI together
```

## Roadmap

Possible future directions: per-player progress/level unlocking, a sandbox mode
with adjustable parameters, frequency-dependent selection (where a trait's value
depends on how common it is), and host–parasite coevolution as a second kind of
arms race.

---

<details>
<summary>Original design notes (preserved)</summary>

> would the "tower" represent reproduction? both enemies and tower would change.
> multiple towers? what would this look like?
>
> if the goal is to keep the species alive and the tower represents reproduction,
> the goal would HAVE to be to let some through — the "fittest" need to "survive".
>
> the player is, effectively, the environment: player changes climate, resource
> availability, predators (number and/or effectiveness).
>
> could have two paths: goal of extinction and goal of survival. goal of extinction
> would play like most tower defense games. goal of survival would have a mechanic
> like... fewer than X critters reaching the goal is a loss, but the more critters
> over that to reach the goal, the lower the score.
>
> for survival goal, maybe have the level goals be evolving a particular trait —
> letting only green bugs reach the target so the species becomes only green.

</details>
