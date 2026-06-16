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
  deerMouseSandHills: {
    taxon: "🐁 Sand Hills deer mouse",
    concept: "Camouflage via a pigment gene",
    blurb:
      "On Nebraska's geologically young Sand Hills, deer mice evolved a pale coat that hides them from predators against the light sand. Linnen and Hoekstra traced it to a derived allele of the Agouti pigment gene, favoured by natural selection, that arose after the dunes formed — though the trait is built from several mutations, not the single one the popular telling implies, and gene flow with dark off-dune mice keeps the rest of the genome shared.",
    source: { cite: "Linnen, Kingsley, Jensen & Hoekstra (2009), Science", url: "https://www.science.org/doi/10.1126/science.1175826" },
  },
  whiteSandsLizard: {
    taxon: "🦎 White Sands lizards",
    concept: "Convergent blanching, partly via Mc1r",
    blurb:
      "On the white gypsum dunes of White Sands, New Mexico, three unrelated lizards independently evolved blanched, sand-matching coats. Two of them — a fence lizard and a whiptail — did so through different mutations in the same pigment gene, Mc1r (even differing in dominance), while the third, the lesser earless lizard, blanched through a separate gene — so the tidy 'all three via Mc1r' story is wrong.",
    source: { cite: "Rosenblum, Römpler, Schöneberg & Hoekstra (2010), PNAS", url: "https://www.pnas.org/doi/10.1073/pnas.0911042107" },
  },
  snowshoeHare: {
    taxon: "🐇 Snowshoe hare",
    concept: "Seasonal camouflage & climate mismatch",
    blurb:
      "Snowshoe hares moult from brown to white for winter camouflage, but the switch is timed by day length, not snow — so as snow arrives later and melts earlier, white hares are left conspicuous on bare ground. Tracking radio-collared hares, Zimova and Mills measured strong selection against this 'camouflage mismatch'; whether the hares can evolve their moult timing fast enough to keep up is an open question.",
    source: { cite: "Zimova, Mills & Nowak (2016), Ecology Letters", url: "https://onlinelibrary.wiley.com/doi/10.1111/ele.12568" },
  },
  soaySheep: {
    taxon: "🐑 Soay sheep",
    concept: "When linkage outvotes selection",
    blurb:
      "On the St Kilda islands, feral Soay sheep are mostly dark — a colour set by a single change in the TYRP1 gene and linked to larger body size, which should make dark sheep spread. Yet they are slowly declining: Gratten's team found the dark variant is genetically linked to nearby DNA with the opposite, harmful effect, so selection on the visible coat runs backwards from the naive prediction — a lesson in how linkage can constrain evolution.",
    source: { cite: "Gratten et al. (2008), Science", url: "https://www.science.org/doi/10.1126/science.1151182" },
  },
  ecoliLTEE: {
    taxon: "🦠 E. coli (Lenski experiment)",
    concept: "A new ability evolves in the lab",
    blurb:
      "In Richard Lenski's long-running experiment, twelve flasks of E. coli have been grown since 1988 — and around generation 31,500 one of them evolved something E. coli normally cannot do: feed on citrate in the presence of oxygen. Blount and Lenski showed the innovation was historically contingent — it only worked because of earlier 'potentiating' mutations unique to that lineage — and traced it to a gene duplication that placed a citrate transporter under a new promoter.",
    source: { cite: "Blount, Borland & Lenski (2008), PNAS", url: "https://www.pnas.org/doi/10.1073/pnas.0803151105" },
  },
  btResistance: {
    taxon: "🐛 Pink bollworm",
    concept: "Resistance to insecticidal Bt crops",
    blurb:
      "Pink bollworm, a cotton pest, evolved resistance to the Bt toxin engineered into transgenic cotton, through mutations that disrupt a midgut cadherin protein the toxin must bind to in order to kill. Tellingly, the outcome differed by region — practical resistance in India but, with refuge strategies that preserve susceptible insects, sustained control or even eradication elsewhere — showing resistance is a management outcome, not an inevitability.",
    source: { cite: "Fabrick et al. (2014), PLOS ONE", url: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0097900" },
  },
  glyphosateWeed: {
    taxon: "🌿 Palmer amaranth",
    concept: "Herbicide resistance by gene copies",
    blurb:
      "Palmer amaranth, a fast-growing farm weed, defeated glyphosate (Roundup) by massively amplifying EPSPS — the very gene encoding the herbicide's target enzyme. Gaines found resistant plants carry tens to over a hundred extra copies, making so much enzyme the herbicide cannot shut the pathway down; the surplus copies even ride on self-replicating circular DNA that spreads quickly through a population.",
    source: { cite: "Gaines et al. (2010), PNAS", url: "https://www.pnas.org/doi/10.1073/pnas.0906649107" },
  },
  malariaResistance: {
    taxon: "🦟 Malaria parasite",
    concept: "Drug resistance under treatment",
    blurb:
      "The malaria parasite Plasmodium falciparum evolved partial resistance to artemisinin, the frontline drug, through mutations in its kelch13 gene. Ariey's team pinned down the marker by combining lab selection with parasites from treated patients; here 'resistance' means the parasite is cleared more slowly rather than the drug failing outright, and the genetic marker now powers global surveillance as resistant lineages spread.",
    source: { cite: "Ariey et al. (2014), Nature", url: "https://www.nature.com/articles/nature12876" },
  },
  kingsnakeMimicry: {
    taxon: "🐍 Scarlet kingsnake",
    concept: "Batesian mimicry of a venomous model",
    blurb:
      "The harmless scarlet kingsnake copies the red-black-yellow banding of the venomous coral snake. Pfennig showed the disguise only pays where the model lives: clay replica snakes were attacked far more often by wild predators in areas without coral snakes than where the real venomous snake shares the range — a mimicry that protects only as far as local predators have learned to fear the original.",
    source: { cite: "Pfennig, Harcombe & Pfennig (2001), Nature", url: "https://www.nature.com/articles/35066628" },
  },
  cuckooHost: {
    taxon: "🐦 Cuckoo & reed warbler",
    concept: "Egg-mimicry vs egg-rejection arms race",
    blurb:
      "The common cuckoo lays eggs that mimic its host's, while hosts such as the reed warbler evolve to spot and eject foreign eggs — a coevolutionary arms race. Davies and Brooke found warblers reject badly-matched eggs far more often than good mimics, the selection that drives cuckoo mimicry; with host-specific cuckoo lineages and host defences that vary from place to place, it is an ongoing, geographically patchy race rather than a finished one.",
    source: { cite: "Davies & Brooke (1988), Animal Behaviour", url: "https://doi.org/10.1016/S0003-3472(88)80269-0" },
  },
  daphniaDefense: {
    taxon: "🦐 Water flea (Daphnia)",
    concept: "Predator-induced defences",
    blurb:
      "Young water fleas grow protective 'neckteeth' only when they smell chemical cues from their predator, the phantom-midge larva — an inducible defence built just in time and dropped when the threat passes. The predator cannot easily stop betraying itself, because the trigger cues are by-products of its own digestion.",
    source: { cite: "Tollrian (1993), Journal of Plankton Research", url: "https://doi.org/10.1093/plankt/15.11.1309" },
  },
  crossbill: {
    taxon: "🐦 Red crossbill & lodgepole pine",
    concept: "Bill–cone coevolution",
    blurb:
      "Red crossbills pry seeds from conifer cones with their crossed bill tips, and where their main competitor the red squirrel is absent, lodgepole pines evolve tougher, better-defended cones while the crossbills evolve larger bills in response — a reciprocal arms race. Where squirrels are present, the pines adapt to them instead and crossbills are scarce: a textbook 'geographic mosaic' of coevolution.",
    source: { cite: "Benkman et al. (2003), The American Naturalist", url: "https://doi.org/10.1086/376580" },
  },
  olm: {
    taxon: "🦎 Olm",
    concept: "Cave eyes and pigment lost",
    blurb:
      "The olm, a cave salamander of Europe's Dinaric karst, is blind and ghost-pale: its eyes begin forming in the embryo, then stop and sink beneath the skin — regression that is genetically programmed, not a mere failure to develop. Its enormous genome is only now being sequenced, so the exact genes behind the eye loss are not yet known.",
    source: { cite: "Kos et al. (2001), Cell and Tissue Research", url: "https://pubmed.ncbi.nlm.nih.gov/11236001/" },
  },
  flightlessCormorant: {
    taxon: "🐦 Flightless cormorant",
    concept: "Wings lost on the Galápagos",
    blurb:
      "The Galápagos flightless cormorant has stubby, useless wings. Burga's genome study found the key changes concentrated in genes that, when broken in people, cause skeletal dwarfisms — especially CUX1, already tied to short wings in chickens — suggesting limb-development genes shrank the wing bones. A later comment disputed parts of the analysis, but the CUX1 result held up.",
    source: { cite: "Burga et al. (2017), Science", url: "https://www.science.org/doi/10.1126/science.aal3345" },
  },
  vitaminCLoss: {
    taxon: "🦧 Vitamin C loss",
    concept: "The same ability lost twice",
    blurb:
      "Most mammals make their own vitamin C, but dry-nosed primates (including us) and guinea pigs cannot, because the gene GULO is broken in each. It happened independently: the primate and guinea-pig copies are disabled at different spots, so these are two separate losses rather than a shared inheritance — which is why we have to get vitamin C from our diet.",
    source: { cite: "Nishikimi et al. (1994), Journal of Biological Chemistry", url: "https://www.jbc.org/article/S0021-9258(17)36876-9/fulltext" },
  },
  nakedMoleRat: {
    taxon: "🐭 Naked mole-rat",
    concept: "Vision regressed underground",
    blurb:
      "The naked mole-rat spends its whole life in lightless tunnels and has tiny, near-useless eyes. Its genome is littered with inactivated 'pseudogene' versions of vision and retina genes — the same kind of loss seen independently in the unrelated blind mole-rat — a signature of relaxed selection on sight in the dark.",
    source: { cite: "Zhao et al. (2022), BMC Biology", url: "https://bmcbiol.biomedcentral.com/articles/10.1186/s12915-022-01243-0" },
  },
  silversword: {
    taxon: "🌿 Hawaiian silverswords",
    concept: "One ancestor, an explosion of forms",
    blurb:
      "Around 30 Hawaiian species — silver desert rosettes, shrubs, trees, vines and mats — all descend from a single colonisation by Californian 'tarweed' plants, after a hybrid, genome-doubled ancestor radiated across the islands' habitats. It is a textbook case of one lucky disperser seeding an entire ecological radiation.",
    source: { cite: "Barrier et al. (1999), Molecular Biology and Evolution", url: "https://academic.oup.com/mbe/article/16/8/1105/2925504" },
  },
  honeycreeper: {
    taxon: "🐦 Hawaiian honeycreepers",
    concept: "Bill radiation from a finch",
    blurb:
      "Hawaii's honeycreepers evolved a riot of bill shapes — nectar-sipping curves, seed-crushing cones, woodpecker-like probes — all from a single finch ancestor. DNA places them right beside the plain-billed Eurasian rosefinches, confirming the elaborate diversity arose within Hawaii over the last 5–6 million years as the high islands rose.",
    source: { cite: "Lerner et al. (2011), Current Biology", url: "https://www.cell.com/current-biology/fulltext/S0960-9822(11)01078-5" },
  },
  marsupialConvergence: {
    taxon: "🐺 Thylacine & wolf",
    concept: "Convergent predator skulls",
    blurb:
      "The extinct marsupial thylacine — the 'Tasmanian tiger' — and the placental wolf evolved remarkably similar skulls despite some 160 million years on separate branches, shaped by the same predatory way of life. The resemblance is not total: the thylacine's bite was weaker, so it likely took smaller prey — a reminder that convergence copies the broad form, not every detail.",
    source: { cite: "Newton et al. (2021), Communications Biology", url: "https://www.nature.com/articles/s42003-020-01569-x" },
  },
  echolocationConvergence: {
    taxon: "🦇 Bats & dolphins (echolocation)",
    concept: "Same gene recruited twice",
    blurb:
      "Echolocating bats and toothed whales evolved their biological sonar independently — yet partly with the same molecular changes: the hearing protein Prestin carries convergent mutations that misleadingly group these distant animals together on a gene tree. Broader claims of genome-wide convergence are contested, but the Prestin result is solid.",
    source: { cite: "Liu et al. (2010), Current Biology", url: "https://www.cell.com/current-biology/fulltext/S0960-9822(09)02073-9" },
  },
  antifreezeFish: {
    taxon: "🐟 Polar fish antifreeze",
    concept: "A protein invented twice",
    blurb:
      "Antarctic icefish and northern cod survive sub-zero seas using nearly identical antifreeze proteins — but they built them independently. In the Antarctic fish the antifreeze gene was repurposed from a digestive-enzyme gene; the cod's version shares no such ancestry, so two separate genetic origins converged on almost the same molecule.",
    source: { cite: "Chen, DeVries & Cheng (1997), PNAS", url: "https://www.pnas.org/doi/10.1073/pnas.94.8.3817" },
  },
  octopusEye: {
    taxon: "🐙 Octopus eye",
    concept: "Camera eyes, evolved separately",
    blurb:
      "Octopuses and vertebrates both have camera eyes with a lens and retina, yet their common ancestor had nothing of the sort — they evolved the design separately. Both use the shared master gene Pax6 to build an eye, but the octopus retina is wired the 'right way out', with no blind spot, so the resemblance is convergence, not a copied blueprint.",
    source: { cite: "Ogura, Ikeo & Gojobori (2004), Genome Research", url: "https://genome.cshlp.org/content/14/8/1555.full" },
  },
  tibetanAltitude: {
    taxon: "🏔️ Tibetan highlanders",
    concept: "Altitude adaptation from archaic DNA",
    blurb:
      "Tibetans thrive above 4,000 m partly thanks to a variant of EPAS1, a gene governing the body's response to low oxygen, which spares them the thick, risky blood that lowlanders make at altitude. Huerta-Sánchez showed this helpful variant was inherited from the Denisovans, an archaic human group — adaptive DNA borrowed through ancient interbreeding.",
    source: { cite: "Huerta-Sánchez et al. (2014), Nature", url: "https://www.nature.com/articles/nature13408" },
  },
  kiwiWing: {
    taxon: "🥝 Kiwi",
    concept: "Flight and colour vision lost",
    blurb:
      "New Zealand's kiwi gave up flight — its wings are vestigial nubs — and went nocturnal, trading sight for smell. Its genome carries broken genes for blue- and green-light vision (so kiwi are effectively colour-blind) alongside an expanded set of smell-receptor genes, changes that fit a life lived in the dark.",
    source: { cite: "Le Duc et al. (2015), Genome Biology", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4511969/" },
  },
  sageGrouse: {
    taxon: "🐦 Greater sage-grouse",
    concept: "Lek mating & female choice",
    blurb:
      "On traditional display grounds called leks, male sage-grouse puff their chest sacs and strut, and a few top males win most of the matings. Work by Wiley and by Gibson found success tracks display performance — but also female faithfulness to particular sites and the copying of other females' choices, so the 'choice' here is layered rather than one clean preference.",
    source: { cite: "Gibson, Bradbury & Vehrencamp (1991), Behavioral Ecology", url: "https://academic.oup.com/beheco/article-abstract/2/2/165/267757" },
  },
  birdOfParadise: {
    taxon: "🐦 Birds of paradise",
    concept: "Female choice sculpts male display",
    blurb:
      "New Guinea's roughly 40 birds of paradise are a showcase of sexual selection: males evolved outrageous plumage, colour and choreographed dances. Comparing species, Ligon found that a bird's colours, sounds and movements have evolved together as a package — consistent with females favouring the whole performance, looks and moves alike.",
    source: { cite: "Ligon et al. (2018), PLOS Biology", url: "https://doi.org/10.1371/journal.pbio.2006962" },
  },
  satinBowerbird: {
    taxon: "🪺 Satin bowerbird",
    concept: "Courtship by decorated bower",
    blurb:
      "Male satin bowerbirds build and decorate stick 'bowers' — courtship stages, not nests — and favour blue trinkets to lure females. Borgia's field experiments showed mating success is highly skewed and tracks bower quality and decoration, so the bower advertises the male; his later work found display vigour matters too.",
    source: { cite: "Borgia (1985), Animal Behaviour", url: "https://www.sciencedirect.com/science/article/abs/pii/S0003347285801408" },
  },
  swordtailSword: {
    taxon: "🐟 Swordtail fish",
    concept: "A taste that predates the trait",
    blurb:
      "Female swordtails prefer males with a long sword-like fin extension — and Basolo found that females of a swordless relative also preferred males given an artificial sword, suggesting the preference existed before the ornament itself (a 'sensory bias'). The interpretation is debated, though: the preference may simply be for larger-looking males.",
    source: { cite: "Basolo (1990), Science", url: "https://www.science.org/doi/10.1126/science.250.4982.808" },
  },
  flatwingCricket: {
    taxon: "🦗 Pacific field cricket",
    concept: "A mating song lost in a few years",
    blurb:
      "On Kauai, a 'flatwing' mutation that silences male crickets — erasing the structures they rub to chirp — swept to most of the males in fewer than 20 generations. The driver is a parasitoid fly that homes in on the song to plant deadly larvae, so silence means survival; the mute males get by with sneaky satellite tactics near the few that still sing.",
    source: { cite: "Zuk, Rotenberry & Tinghitella (2006), Biology Letters", url: "https://doi.org/10.1098/rsbl.2006.0539" },
  },
  dungBeetleHorns: {
    taxon: "🪲 Horned dung beetle",
    concept: "Costly weapons trade off",
    blurb:
      "Male Onthophagus dung beetles grow exaggerated horns to fight over tunnels — and Emlen showed the horns are paid for elsewhere on the body, trading off against nearby structures such as the eyes during development. Large males grow horns and fight; small males skip them and sneak matings instead — though the size of the trade-off varies with conditions.",
    source: { cite: "Emlen (2001), Science", url: "https://doi.org/10.1126/science.1056607" },
  },
  przewalskiHorse: {
    taxon: "🐎 Przewalski's horse",
    concept: "Bottleneck & conservation breeding",
    blurb:
      "Every Przewalski's horse alive descends from roughly a dozen founders caught around a century ago. Careful studbook breeding rebuilt the species past 2,000 animals, but its genome still shows reduced diversity and inbreeding — and in 2020 one was cloned from decades-old frozen cells to put some lost variation back.",
    source: { cite: "Der Sarkissian et al. (2015), Current Biology", url: "https://www.sciencedirect.com/science/article/pii/S0960982215010039" },
  },
  floridaPanther: {
    taxon: "🐆 Florida panther",
    concept: "Inbreeding rescued by gene flow",
    blurb:
      "By the 1990s the few remaining Florida panthers carried tell-tale inbreeding defects — kinked tails, heart holes. Managers released eight female Texas pumas to restore gene flow; the population tripled, heterozygosity doubled, and the defects faded in cats born afterward — a textbook 'genetic rescue', even though habitat loss still limits the cats.",
    source: { cite: "Johnson et al. (2010), Science", url: "https://www.science.org/doi/10.1126/science.1192891" },
  },
  mauritiusKestrel: {
    taxon: "🦅 Mauritius kestrel",
    concept: "Through the eye of the needle",
    blurb:
      "The Mauritius kestrel fell to about four wild birds in 1974 before captive breeding rebuilt it to hundreds of pairs. Comparing century-old museum skins with living birds, Groombridge showed the species was once as genetically diverse as mainland kestrels but now keeps only a fraction — a conservation triumph that still bears the bottleneck's lasting mark.",
    source: { cite: "Groombridge, Jones, Bruford & Nichols (2000), Nature", url: "https://www.nature.com/articles/35001148" },
  },
  mimulus: {
    taxon: "🌸 Monkeyflowers",
    concept: "One gene flips the pollinator",
    blurb:
      "Pink, bee-pollinated Mimulus lewisii and red, hummingbird-pollinated M. cardinalis are kept apart mainly by which pollinator visits them. Bradshaw and Schemske swapped the allele at a single flower-colour gene and the visits flipped dramatically — bees and hummingbirds switching their attention — showing one mutation can start a pollinator shift, even if full isolation takes many genes.",
    source: { cite: "Bradshaw & Schemske (2003), Nature", url: "https://doi.org/10.1038/nature02106" },
  },
  sticklebackPair: {
    taxon: "🐟 Stickleback species pairs",
    concept: "Ecological speciation in lakes",
    blurb:
      "In a handful of young British Columbia lakes, threespine sticklebacks split — again and again — into a chunky bottom-feeding form and a slender open-water form, each shaped for its niche and breeding mostly with its own kind. It is a model of ecological speciation; tellingly, one pair collapsed back into a hybrid swarm after an introduced crayfish muddied its lake, showing how fragile a young species can be.",
    source: { cite: "Schluter & McPhail (1992), The American Naturalist", url: "https://www.journals.uchicago.edu/doi/10.1086/285404" },
  },
  howeaPalm: {
    taxon: "🌴 Kentia palms",
    concept: "Speciation without a barrier (debated)",
    blurb:
      "The two Howea palms of tiny, remote Lord Howe Island are sister species that, Savolainen argued, split in place — diverging by soil preference and flowering time rather than any geographic barrier — a leading plant case for sympatric speciation. It is genuinely contested: critics note a now-sunken neighbouring island cannot be ruled out, so treat the 'no barrier' claim as strong but disputed.",
    source: { cite: "Savolainen et al. (2006), Nature", url: "https://doi.org/10.1038/nature04566" },
  },
};

// Resolve an example id to its record (with the id attached).
export function getExample(id) {
  const e = EXAMPLES[id];
  return e ? { id, ...e } : null;
}
