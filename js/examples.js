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
};

// Resolve an example id to its record (with the id attached).
export function getExample(id) {
  const e = EXAMPLES[id];
  return e ? { id, ...e } : null;
}
