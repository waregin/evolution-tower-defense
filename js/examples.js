// examples.js — real-world evolution case studies used in the end-of-level
// debriefs. ACCURACY IS THE POINT: every blurb is written to be defensible and
// each carries a source to the primary literature (or, where noted, a reputable
// educational reference). Blurbs are deliberately conservative. If you edit one,
// keep it faithful to the cited source.

export const EXAMPLES = {
  pepperedMoth: {
    taxon: "🦋 Peppered moth",
    concept: "Camouflage & natural selection",
    blurb:
      "As soot from the Industrial Revolution darkened Britain's tree bark, a dark form of the peppered moth went from rare to dominant — birds picked off the pale moths that now stood out against the grime. When clean-air laws cut the soot, pale moths rebounded. The dark form traces to a single transposable-element mutation around 1819.",
    source: { cite: "Cook, Grant, Saccheri & Mallet (2012), Biology Letters", url: "https://royalsocietypublishing.org/doi/10.1098/rsbl.2011.1136" },
  },
  pocketMouse: {
    taxon: "🐭 Rock pocket mouse",
    concept: "Camouflage & natural selection",
    blurb:
      "On dark volcanic lava flows in the American Southwest these mice are dark; on the pale desert rock nearby they're light — camouflage from owls and other hunters. In one lava population the dark coat comes from mutations in the Mc1r pigment gene; a separate lava population evolved dark fur independently through different genes.",
    source: { cite: "Nachman, Hoekstra & D'Agostino (2003), PNAS", url: "https://www.pnas.org/doi/10.1073/pnas.0431157100" },
  },
  darwinFinch: {
    taxon: "🐦 Darwin's ground finch",
    concept: "Natural selection, measured in real time",
    blurb:
      "On the tiny Galápagos island of Daphne Major, a 1977 drought left mostly large, hard seeds. Medium ground finches with bigger, stronger beaks survived to breed, and average beak size rose in a single generation. Peter and Rosemary Grant have tracked the population bird-by-bird for decades.",
    source: { cite: "Boag & Grant (1981), Science", url: "https://www.science.org/doi/10.1126/science.214.4516.82" },
  },
  guppy: {
    taxon: "🐟 Trinidad guppy",
    concept: "Sexual vs. natural selection",
    blurb:
      "Female guppies prefer brightly coloured males — but bright males are also easier for predators to spot. In stream pools full of dangerous predators the males are drab; in pools with few predators they evolve flashier colours within a handful of generations. The display is a tug-of-war between mate choice and survival.",
    source: { cite: "Endler (1980), Evolution", url: "https://onlinelibrary.wiley.com/doi/10.1111/j.1558-5646.1980.tb04790.x" },
  },
  widowbird: {
    taxon: "🐦 Long-tailed widowbird",
    concept: "Sexual selection by female choice",
    blurb:
      "Male long-tailed widowbirds trail half-metre tails. When researchers trimmed some tails and glued extensions onto others, the artificially long-tailed males attracted the most mates and the shortened ones the fewest — direct experimental proof that female choice drives the exaggerated ornament.",
    source: { cite: "Andersson (1982), Nature", url: "https://www.nature.com/articles/299818a0" },
  },
  redDeer: {
    taxon: "🦌 Red deer",
    concept: "Sexual selection by male–male combat",
    blurb:
      "Red deer stags grow heavy antlers and use them in shoving matches over harems of hinds. On Scotland's Isle of Rum, decades of individual records show stags with larger antlers win more fights and sire more calves, and antler size is heritable — sexual selection through combat rather than female choice.",
    source: { cite: "Kruuk et al. (2002), Evolution", url: "https://pubmed.ncbi.nlm.nih.gov/12353761/" },
  },
  cichlid: {
    taxon: "🐠 African cichlid fishes",
    concept: "Adaptive radiation",
    blurb:
      "The Great Lakes of East Africa each hold hundreds of cichlid species found nowhere else — an explosive adaptive radiation from a few ancestors. They first diversified jaws and guts for different foods, then split further as females evolved preferences for different male colour patterns.",
    source: { cite: "Salzburger (2011), 'Explosive Speciation and Adaptive Radiation of East African Cichlid Fishes' (Springer)", url: "https://link.springer.com/chapter/10.1007/978-3-642-20992-5_18" },
  },
  stickleback: {
    taxon: "🐟 Threespine stickleback",
    concept: "Losing a costly trait (standing variation)",
    blurb:
      "Ocean sticklebacks wear a full suit of bony armour plates against predators. When they colonise freshwater lakes that lack those predators, the heavy armour becomes a needless cost and is lost — repeatedly and independently — by selecting the same low-armour Eda gene variant already present at low frequency in the sea.",
    source: { cite: "Colosimo et al. (2005), Science", url: "https://www.science.org/doi/10.1126/science.1107239" },
  },
  cavefish: {
    taxon: "🐟 Mexican cavefish",
    concept: "Regressive evolution (use it or lose it)",
    blurb:
      "Mexican tetras stranded in pitch-black caves lost their eyes over generations. Eyes are expensive — vision can claim a large share of a young fish's energy budget — so where they're useless, energy-saving and other pressures favour losing them. Different cave populations went blind through different genes.",
    source: { cite: "Moran, Softley & Warrant (2015), Science Advances", url: "https://www.science.org/doi/10.1126/sciadv.1500363" },
  },
  horse: {
    taxon: "🐎 Horse",
    concept: "Reduction & a branching tree",
    blurb:
      "Early horses such as Eohippus were dog-sized browsers with several spread toes for soft forest floors. As open grasslands spread, several horse lineages trended toward larger size and fewer toes; modern horses run on a single hoof — one toe. The fossil record is a branching bush of side-lineages, not the straight line often drawn.",
    source: { cite: "'Hipparion tracks and horses' toes' (2023), Royal Society Open Science; see also Simpson (1951) & MacFadden (1992)", url: "https://royalsocietypublishing.org/doi/10.1098/rsos.230358" },
  },
  hyena: {
    taxon: "🐾 Spotted hyena",
    concept: "Convergent evolution",
    blurb:
      "Hyenas look and hunt like dogs, but they aren't canines at all — they sit on the cat branch of the carnivores (Feliformia), closer kin to cats, mongooses and civets than to dogs. Their dog-like build is convergence: unrelated lineages independently evolving similar forms for a similar running-and-hunting life.",
    source: { cite: "Koepfli et al. (2006), Molecular Phylogenetics and Evolution", url: "https://pubmed.ncbi.nlm.nih.gov/16503281/" },
  },
  elephant: {
    taxon: "🐘 African elephant",
    concept: "Human-driven selection",
    blurb:
      "In Mozambique's Gorongosa Park, intense ivory poaching during the civil war meant elephants born without tusks were far likelier to survive. Tuskless females surged within a few decades. The trait sits on the X chromosome and appears lethal to males, so it passes mainly mother-to-daughter.",
    source: { cite: "Campbell-Staton et al. (2021), Science", url: "https://www.science.org/doi/10.1126/science.abe7389" },
  },
  warfarinRat: {
    taxon: "🐀 Brown rat",
    concept: "Resistance evolves under poison",
    blurb:
      "After the rat poison warfarin came into use in the 1950s, resistant rats appeared within years through mutations in the VKORC1 gene, and resistance spread under the intense selection of poisoning campaigns. It's the same evolutionary logic as antibiotic resistance, playing out in a backyard pest.",
    source: { cite: "'Novel mutations in VKORC1 of wild rats and mice' (2009), via PMC", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2644709/" },
  },
  whale: {
    taxon: "🐋 Whales",
    concept: "Major transition: land to sea",
    blurb:
      "Whales descend from four-legged, hoofed land mammals. Fossils such as Pakicetus and the otter-like Ambulocetus trace the move into water around 50 million years ago, and both ankle bones and DNA show whales' closest living relatives are hippos and other even-toed hoofed mammals.",
    source: { cite: "UC Berkeley, Understanding Evolution — 'The evolution of whales'", url: "https://evolution.berkeley.edu/what-are-evograms/the-evolution-of-whales/" },
  },
  tiktaalik: {
    taxon: "🐟→🦎 Tiktaalik",
    concept: "Transitional fossil: fins to limbs",
    blurb:
      "Tiktaalik, a 375-million-year-old fossil from Arctic Canada, captures fish becoming land animals. It kept fish gills, scales and fins, but also had a flat crocodile-like head, a mobile neck, and sturdy fin bones with wrist-like joints that could prop it up in the shallows.",
    source: { cite: "Daeschler, Shubin & Jenkins (2006), Nature", url: "https://www.nature.com/articles/nature04639" },
  },
  elephantSeal: {
    taxon: "🦭 Northern elephant seal",
    concept: "Bottleneck & genetic drift",
    blurb:
      "Hunted for their blubber, northern elephant seals crashed to perhaps as few as ~20 animals in the 1890s before rebounding to hundreds of thousands today. Yet a survey of two dozen genes found essentially no variation left: the bottleneck scrubbed the species' diversity by chance, not by selection.",
    source: { cite: "Bonnell & Selander (1974), Science", url: "https://pubmed.ncbi.nlm.nih.gov/4825892/" },
  },
  cheetah: {
    taxon: "🐆 Cheetah",
    concept: "Lost diversity from drift",
    blurb:
      "Cheetahs carry remarkably little genetic variation — so little that unrelated cheetahs accept skin grafts from one another, as if immunological twins. Severe bottlenecks in their past, not any benefit, left the species genetically impoverished and vulnerable.",
    source: { cite: "O'Brien et al. (1985), Science", url: "https://www.science.org/doi/10.1126/science.2983425" },
  },
  pingelap: {
    taxon: "🏝️ Pingelap islanders",
    concept: "Founder effect",
    blurb:
      "After a 1775 typhoon left only about 20 survivors on the Micronesian atoll of Pingelap — one of them a carrier of complete colour-blindness (achromatopsia) — the condition became extraordinarily common as the population regrew, affecting roughly a tenth of Pingelapese today. The CNGB3 gene wasn't favoured; it rode to high frequency purely by chance.",
    source: { cite: "Sundin et al. (2000), Nature Genetics; popularised by O. Sacks (1996)", url: "https://www.science.org/content/article/colorblindness-gene-found-pacific-islanders" },
  },
  rhagoletis: {
    taxon: "🪰 Apple maggot fly",
    concept: "Speciation in progress (sympatric)",
    blurb:
      "The apple maggot fly fed only on hawthorns until apples arrived in North America; by the mid-1800s some flies had switched to apple. Because the flies mate on the fruit they grew up on — and apples ripen earlier than hawthorns — the two 'host races' increasingly breed apart, with no geographic barrier between them. Speciation caught in the act.",
    source: { cite: "Feder, Chilcote & Bush (1988), Nature", url: "https://www.nature.com/articles/336061a0" },
  },
  cepaea: {
    taxon: "🐌 Grove snail",
    concept: "Visual predation & camouflage",
    blurb:
      "The grove snail Cepaea nemoralis carries an inherited polymorphism of shell colour and banding. Song thrushes smash snails on stone 'anvils', and Cain & Sheppard found the broken shells under those anvils were biased toward the morphs that stood out against their background — direct evidence of visual selection. Climate (darker shells warm faster) and frequency-dependent predation also help keep several morphs in the population at once.",
    source: { cite: "Cain & Sheppard (1954), Genetics", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1209639/" },
  },
  beachMouse: {
    taxon: "🐁 Beach mouse",
    concept: "Camouflage via pigment genes",
    blurb:
      "Oldfield mice living on pale Gulf and Atlantic dune sand have light coats that hide them from owls and herons, while their inland kin are dark. Hoekstra's lab traced the pale coat to two interacting pigment genes — a mutation in Mc1r plus raised Agouti expression — and the light form evolved largely independently on the two coasts, a clean case of parallel adaptation.",
    source: { cite: "Steiner, Weber & Hoekstra (2007), PLoS Biology", url: "https://journals.plos.org/plosbiology/article?id=10.1371/journal.pbio.0050219" },
  },
  timema: {
    taxon: "🦗 Timema stick insect",
    concept: "Host-plant camouflage & divergence",
    blurb:
      "These wingless stick insects come in colour-pattern morphs camouflaged on different host plants. Bird predation favours whichever form is better hidden on each plant, and adapting to different hosts repeatedly builds partial reproductive isolation between populations — speciation in progress rather than finished, with crypsis only one of several barriers.",
    source: { cite: "Nosil, Crespi & Sandoval (2002), Nature", url: "https://www.nature.com/articles/417440a" },
  },
  newtSnake: {
    taxon: "🦎 Newt & garter snake",
    concept: "Toxin–resistance arms race",
    blurb:
      "Rough-skinned newts are laced with tetrodotoxin, a potent nerve poison, and the garter snakes that eat them have evolved resistant sodium channels (mutations in NaV1.4). Across the landscape, newt toxicity and snake resistance escalate together in matched hotspots — a geographic mosaic of coevolution — and resistance isn't free: the most resistant snakes crawl more slowly.",
    source: { cite: "Brodie, Ridenhour & Brodie (2002), Evolution", url: "https://onlinelibrary.wiley.com/doi/10.1111/j.0014-3820.2002.tb00132.x" },
  },
  soapberryBug: {
    taxon: "🪲 Soapberry bug",
    concept: "Rapid evolution tracking a new host",
    blurb:
      "Soapberry bugs pierce fruit with a long 'beak' to reach the seeds inside. When some Florida populations moved onto an introduced flat-podded tree with shallower seeds, their beaks evolved measurably shorter within about 40–50 years — a shift documented from museum specimens, with lab experiments confirming beak length is strongly heritable and can respond fast.",
    source: { cite: "Carroll & Boyd (1992), Evolution", url: "https://www.jstor.org/stable/2409756" },
  },
  myxoma: {
    taxon: "🐇 Rabbit & myxoma virus",
    concept: "Virulence–resistance coevolution",
    blurb:
      "Myxoma virus, released in Australia in 1950, at first killed over 99% of infected rabbits — but it did not evolve toward harmlessness. It settled at intermediate virulence (strains that kill too fast aren't transmitted by mosquitoes) while the rabbits evolved heritable resistance, and the arms race has since re-escalated. A textbook lesson that 'maximally deadly' is not what a transmitted pathogen evolves toward.",
    source: { cite: "Kerr et al. (2017), PNAS", url: "https://www.pnas.org/doi/10.1073/pnas.1710336114" },
  },
  peacock: {
    taxon: "🦚 Indian peafowl",
    concept: "Female choice on an ornament",
    blurb:
      "Peacocks fan an iridescent train of eyespots in courtship. When researchers experimentally removed eyespots, males mated less — support for female choice on the ornament. Whether peahens track train size among un-manipulated males is genuinely contested, though: a long-term study found no such correlation, so the experimental evidence is firmer than the observational claim.",
    source: { cite: "Petrie, Halliday & Sanders (1991), Animal Behaviour", url: "https://doi.org/10.1016/S0003-3472(05)80484-1" },
  },
  stalkEyedFly: {
    taxon: "🪰 Stalk-eyed fly",
    concept: "Ornament & preference co-evolve",
    blurb:
      "Male stalk-eyed flies carry their eyes on long lateral stalks, and females prefer long-eyestalk males. When Wilkinson & Reillo selected on male eye-span for 13 generations, female preference shifted in the same direction — direct evidence of the genetic correlation between ornament and preference that Fisherian runaway selection requires.",
    source: { cite: "Wilkinson & Reillo (1994), Proc. R. Soc. B", url: "https://royalsocietypublishing.org/doi/10.1098/rspb.1994.0001" },
  },
  tungaraFrog: {
    taxon: "🐸 Túngara frog",
    concept: "Sexual signal vs eavesdropping predator",
    blurb:
      "Male túngara frogs add 'chucks' to their call, and females prefer the more complex version — so elaboration pays in mating. But fringe-lipped bats eavesdrop on those same complex calls and preferentially hunt the most attractive males, a clean natural example of one signal pulled in opposite directions by mate choice and predation.",
    source: { cite: "Ryan, Tuttle & Rand (1982), The American Naturalist", url: "https://www.journals.uchicago.edu/doi/10.1086/283899" },
  },
  barnSwallow: {
    taxon: "🐦 Barn swallow",
    concept: "Sexual selection on tail length",
    blurb:
      "Male barn swallows trail elongated outer tail streamers. In Møller's classic experiment, males whose streamers were lengthened paired faster and bred more successfully than shortened or control males. The streamer is part flight surface and part ornament, so it carries an aerodynamic cost that plausibly makes it an honest signal of quality.",
    source: { cite: "Møller (1988), Nature", url: "https://www.nature.com/articles/332640a0" },
  },
  anolis: {
    taxon: "🦎 Caribbean anole lizards",
    concept: "Replicated adaptive radiation",
    blurb:
      "On each of the four Greater Antillean islands, Anolis lizards independently radiated into the same set of habitat specialists — twig, trunk-ground, crown-giant and more — defined by limb length and body size. Same-type 'ecomorphs' on different islands are not close relatives, so similar forms evolved convergently for similar niches: evolution running the same experiment four times.",
    source: { cite: "Losos et al. (1998), Science", url: "https://www.science.org/doi/10.1126/science.279.5359.2115" },
  },
  greenishWarbler: {
    taxon: "🐦 Greenish warbler",
    concept: "Ring species around a plateau",
    blurb:
      "A chain of greenish-warbler populations rings the treeless Tibetan Plateau. Neighbours interbreed and song changes gradually around the loop, yet where the two ends meet in Siberia the forms behave as separate species that don't interbreed — a near-textbook ring species showing how continuous variation can split into two (later genomics finds the ring has some historical gaps).",
    source: { cite: "Irwin, Bensch & Price (2001), Nature", url: "https://www.nature.com/articles/35053059" },
  },
  undergroundMosquito: {
    taxon: "🦟 Underground mosquito",
    concept: "Reproductive isolation underground",
    blurb:
      "The 'molestus' mosquito form thriving in the London Underground bites mammals, breeds without a blood meal and stays active all year, unlike the surface form — and crosses between the two are largely infertile, marking strong reproductive isolation. The popular tale that the Tube created it in ~150 years is now doubted: genomics suggests molestus is an older lineage the tunnels merely concentrated.",
    source: { cite: "Byrne & Nichols (1999), Heredity", url: "https://www.nature.com/articles/6884120" },
  },
  heliconius: {
    taxon: "🦋 Heliconius butterflies",
    concept: "Mimicry & speciation",
    blurb:
      "Distasteful Heliconius butterflies converge on shared bright warning patterns (Müllerian mimicry), so a predator that learns one pattern avoids them all. Those same patterns double as mating cues, so a switch in wing pattern can split a population into non-interbreeding races. A single gene, optix, repeatedly controls the red marks, and useful pattern variants can even pass between species by hybridization.",
    source: { cite: "Reed et al. (2011), Science", url: "https://www.science.org/doi/10.1126/science.1208227" },
  },
  amishEvc: {
    taxon: "🧬 Amish (Ellis–van Creveld)",
    concept: "Founder effect in an isolate",
    blurb:
      "Ellis–van Creveld syndrome — a recessive dwarfism with extra fingers and heart defects — is rare worldwide but common among the Old Order Amish of Lancaster County, who trace to a small founding group. A pre-existing recessive allele carried by one 18th-century founder couple rode to high frequency by chance in the small, closed population: a founder effect, not new mutation or 'inbreeding causing' the trait.",
    source: { cite: "Ruiz-Perez et al. (2000), Nature Genetics; founder effect per McKusick (1964)", url: "https://www.nature.com/articles/ng0300_283" },
  },
  condor: {
    taxon: "🦅 California condor",
    concept: "Bottleneck & conservation genetics",
    blurb:
      "The California condor crashed to just 22 birds in the 1980s; every condor alive today descends from about 14 genetic founders. Pedigree-based breeding is used to minimize inbreeding, and the population now tops 500. Ancient DNA shows the wild ancestral population was far more diverse — the bottleneck stripped variation by chance, and careful management is still required.",
    source: { cite: "D'Elia et al. (2016), The Condor", url: "https://bioone.org/journals/the-condor/volume-118/issue-4/CONDOR-16-35.1/Ancient-DNA-reveals-substantial-genetic-diversity-in-the-California-Condor/10.1650/CONDOR-16-35.1.full" },
  },
};

// Resolve an example id to its record (with the id attached).
export function getExample(id) {
  const e = EXAMPLES[id];
  return e ? { id, ...e } : null;
}
