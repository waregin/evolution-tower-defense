# 🧬 Evolution Tower Defense

A tower defense game that teaches **evolution** — natural selection, heredity,
the predator–prey **arms race**, **sexual selection**, the loss of costly traits,
non-adaptive **genetic drift**, and **speciation** — by letting you *be* the
selection pressure (or the roll of the dice). **Five modes, 120 levels**, every
level ending with the real-world species and study it mirrors.

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

## Five modes, one engine

All five modes share the same simulation; they differ only in the win condition.
The three core modes have **30 levels** each (six chapters); the two newer modes
have **15 levels** each (three chapters).

- **🛡️ Extinction** (classic tower defense). Stop the prey before they reach the
  refuge. But survivors breed and adapt to whatever pressure you over-use — that's
  the predator–prey arms race made visible. Win by surviving every generation, or
  by wiping the prey out entirely. *(Chapters: Claws → Venom → The Hunter's Eye →
  Full Arsenal → Arms-Race Gauntlet → Scarcity.)*

- **🌱 Survival** (you are the environment). This is the inversion from the original
  design notes: the species must **not** go extinct, so you *have* to let some
  prey through. By choosing *which* prey die each generation, you steer the
  population's average traits toward a goal — breed it green, toxin-resistant,
  armored, a designer color, or strip away armor it no longer needs. Apply too
  little pressure and nothing changes; apply too much and you drive the species
  extinct. *(Chapters: Breed for Green → Build a Tank → Forge Armor → Designer
  Colors → Conservation → Use It or Lose It.)*

- **💃 Sexual selection** (mate choice vs. natural selection). These prey breed by
  choosing showy mates, so a costly **display** ornament keeps growing on its own —
  *Fisherian runaway*. Both the display and the *preference* for it are inherited,
  so they co-evolve and the ornament escalates toward a high natural equilibrium,
  even though it makes prey slower and easier for a visual hunter to spot (the
  *handicap principle*). Predation and scarcity are the forces that push the
  display back down, so most levels are a tug-of-war: land the ornament in a target
  window without driving the species extinct. *(Chapters: Runaway → Curb the
  Display → The Handicap Balance → Strong Preference → Coevolution Gauntlet → The
  Cost of Beauty.)*

- **🎲 Genetic drift** (chance, not selection). The counter-point to everything
  above: here nothing selects on colour, yet a small population *still* evolves. By
  culling at random (Catastrophes) you shrink the breeding pool until a colour
  fixes by pure luck — replay and a different one wins. The final chapter flips it:
  protect **Refuges** to carry a population's diversity through forced bottlenecks.
  *(Chapters: Lucky Few → Bottleneck → Refuge.)*

- **🧬 Speciation** (one population becomes two). These prey mate with colour-similar
  partners (assortative mating). Place **Rift** predators that hunt the *middle* of
  the colour range (disruptive selection); the emptied centre and like-with-like
  breeding pull the population apart into two separated forms that no longer
  interbreed — a new species, with no geographic barrier needed.
  *(Chapters: Disruptive Selection → Reproductive Isolation → Two Species.)*

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
| 🍂 Scarcity | drains prey burdened by **armor or display** | Costly traits get lost when their benefit is gone |
| ☄️ Catastrophe | random, **non-selective** death | Shrinks the pool so genetic drift takes over |
| 🛟 Refuge | passive — re-seeds founding diversity | Protects a small population from drift |
| 🪓 Rift | hunts the **middle** of the colour range | Disruptive selection that splits a population |

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
- When the predators that once made armor worthwhile are gone, scarcity makes that
  armor pure cost, and the population sheds it — the "use it or lose it" logic
  behind cavefish losing their eyes and horses losing their toes.
- In drift mode, a small population evolves with **no selection at all** — a colour
  fixes by sheer chance, and the *outcome is different every replay*. Drift is the
  null model: not all evolution is adaptation.
- In speciation mode, disruptive selection plus assortative mating turns a single
  blob of colour into **two separated forms that no longer interbreed** — you watch
  one population become two.

## Scoring, stars & progress

Each level is rated **1–3 ⭐**. You earn more for finishing in fewer generations
and — on shaping levels — for *tight* selection: letting through only just enough
prey, per the original note that excess survivors mean weak selection. Win a few
levels in a chapter to **unlock the next**; progress (stars and unlocks) is saved
in your browser's `localStorage`.

## Learn from real life

Evolution here isn't an abstraction — every level ends with a **debrief**: a recap
of what your population actually did (e.g. *Armor 18% → 54% over 11 generations*)
and the matching **real-world case study**. The library spans **71 cases** from
right across the tree of life — bacteria, a virus, plants, insects, snails, fish,
amphibians, reptiles, birds and mammals — so the examples stay varied as you play,
and each chapter draws on five different ones (no study repeats within a chapter).
You'll meet the peppered moth, grove snails, Trinidad guppies and túngara frogs,
stalk-eyed flies, sage-grouse and birds of paradise, Darwin's finches, beach and
deer mice, White Sands lizards, the snowshoe hare's camouflage caught out by
climate, Lenski's *E. coli*, Bt-resistant bollworms and glyphosate-beating weeds,
the cuckoo–warbler egg-mimicry race, the newt–garter-snake toxin arms race,
Australia's rabbits and myxoma virus, Caribbean anole and Hawaiian honeycreeper
radiations, the blind olm and naked mole-rat, convergent thylacine-and-wolf skulls
and bat-and-dolphin sonar, vitamin-C loss, the horse's vanishing toes, tuskless
elephants, whales and Tiktaalik — plus the cheetahs, elephant seals, condors,
Przewalski's horses, Florida panthers and Mauritius kestrels that came through
bottlenecks, the founder-effect cases of Pingelap and the Amish, and the greenish
warbler, Underground mosquito, monkeyflowers, stickleback species pairs and apple
maggot fly splitting into new forms in real time.

Where the popular version of a story is shaky, the blurb says so rather than
oversimplifying — the peacock's eyespots, the Underground mosquito's origin, the
Lord Howe palms' "no-barrier" speciation and the swordtail's sensory bias are all
more contested than the textbook telling, and the text reflects that.

Accuracy is treated as non-negotiable — if the facts were wrong the tool would be
worse than useless. Each case study carries a **source** to the primary literature
(or a reputable educational reference), kept deliberately low-key in the UI. They
live, with citations, in [`js/examples.js`](js/examples.js).

## Project layout

```
index.html        markup + canvas + sidebar
styles.css        styling
js/
  genetics.js     traits, heredity, mutation, population stats
  critter.js      an individual organism (movement, defenses, rendering)
  tower.js        selection pressures (trait-dependent damage)
  levels.js       the 120-level generator (five modes; drift & speciation too)
  examples.js     the sourced real-world case studies shown in debriefs
  game.js         the simulation engine (breeding, mate choice, drift, speciation, scoring)
  progress.js     saved stars and chapter unlocks (localStorage)
  ui.js           sidebar panels, live genetics charts, debrief, input (incl. touch)
  main.js         bootstrap that wires the game and UI together
test/
  balance.mjs     headless regression test: every level valid, runnable, winnable
```

### Tests

```bash
node test/balance.mjs   # asserts all 120 levels are structurally valid and beatable
```

The engine is decoupled from the DOM, so the test drives the real simulation with a
mocked canvas. It runs every level to a terminal state and checks that a sensible
strategy can win it — so a tweak to a trait constant can't silently make a level
unbeatable.

## Roadmap

Six more teaching modes are specced out as GitHub issues (#3–#8): frequency-
dependent selection, coevolution / Red Queen (the predators evolve back),
heterozygote advantage (sickle-cell — needs a diploid genome), mimicry (Batesian &
Müllerian), artificial selection / domestication, and mass extinction / contingency.
Genetic drift (#1) and speciation (#2) are now implemented.

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
