import { DriverKey, ScoreBand, SeverityLabel } from "./types";

// ═══════════════════════════════════════
// SECTION 1 — Score Band Interpretation
// ═══════════════════════════════════════

export const SCORE_BAND_COPY: Record<ScoreBand, string> = {
  "Minimal Pressure":
    "Your follicles are under genuinely low biological pressure. You have more runway than most — focus on staying ahead.",
  "Mild Pressure":
    "A few drivers are starting to fire, but nothing is dominant yet. This is the easiest stage to reverse.",
  "Moderate Pressure":
    "Multiple drivers are active. Without intervention, you're on the projected loss curve. With intervention, this is recoverable.",
  "High Pressure":
    "Significant biological pressure across multiple drivers. The window for prevention is closing — but the window for active intervention is wide open.",
  "Severe Pressure":
    "Aggressive driver activation across most systems. Honest framing: full reversal is unlikely, but meaningful retention and partial regrowth is realistic with the right protocol.",
};

// ═══════════════════════════════════════
// SECTION 2 — Driver Card Copy
// ═══════════════════════════════════════

export const DRIVER_DESCRIPTIONS: Record<DriverKey, string> = {
  hormonal:
    "Your follicles' sensitivity to DHT — the hormone that miniaturises hair over time. This includes genetic loading from family history, current androgen exposure, and lifecycle hormone shifts.",
  inflammatory:
    "Hidden inflammation around your follicles — itching, tenderness, redness, or systemic immune activity that quietly damages hair-producing cells. Often unnoticed until it's checked for.",
  oxidative:
    "Cellular damage from free radicals — driven by smoking, alcohol, poor sleep, chronic stress, or excessive training without recovery. Your follicle cells need clean energy to produce healthy hair.",
  vascular:
    "The blood supply reaching your scalp. Without good microcirculation, follicles can't get the nutrients, hormones, or oxygen they need — even if everything else is in order.",
  nutritional:
    "The raw materials your follicles need to build hair: protein, iron, zinc, vitamin D, B vitamins. Hair is the first thing your body deprioritises when supply is short.",
  fibrosis:
    "The physical hardening of scalp tissue around follicles over time — collagen tightening, sebaceous gland atrophy, shiny skin. Once established, it traps follicles and resists regrowth.",
  growth_signalling:
    "Your follicles' regenerative capacity — the molecular signals that wake dormant follicles and produce new hair. Declines naturally with age, faster with chronic stress to the hair cycle.",
  microenvironment:
    "The ecosystem on your scalp surface: sebum balance, microbiome (the yeast and bacteria that live there), pH, and product residue. Disruption here drives flaking, itching, and chronic low-grade follicle stress.",
};

export const DRIVER_DISPLAY_NAMES: Record<DriverKey, string> = {
  hormonal: "Hormonal / Androgen Driver",
  inflammatory: "Inflammatory / Immune Driver",
  oxidative: "Oxidative / Mitochondrial Driver",
  vascular: "Vascular / Circulation Driver",
  nutritional: "Nutritional / Metabolic Driver",
  fibrosis: "Fibrosis / Structural Driver",
  growth_signalling: "Growth Signalling / Stem Cell Driver",
  microenvironment: "Scalp Microenvironment Driver",
};

export const DRIVER_SHORT_NAMES: Record<DriverKey, string> = {
  hormonal: "Hormonal",
  inflammatory: "Inflammatory",
  oxidative: "Oxidative",
  vascular: "Vascular",
  nutritional: "Nutritional",
  fibrosis: "Fibrosis",
  growth_signalling: "Growth Signal",
  microenvironment: "Scalp",
};

export const DRIVER_IDS: Record<DriverKey, string> = {
  hormonal: "D1",
  inflammatory: "D2",
  oxidative: "D3",
  vascular: "D4",
  nutritional: "D5",
  fibrosis: "D6",
  growth_signalling: "D7",
  microenvironment: "D8",
};

type ConditionalSeverity = "Mild" | "Moderate" | "Elevated" | "Critical";

export const DRIVER_CONDITIONAL: Record<DriverKey, Record<ConditionalSeverity, string>> = {
  hormonal: {
    Mild: "Right now this isn't your primary driver — your genetic and hormonal context is relatively favourable.",
    Moderate: "This driver is active and worth managing. Alone it won't cause major loss, but combined with other firing drivers it accelerates.",
    Elevated: "This is a strong driver in your profile. Most of the actual miniaturisation in your hair is being signalled here.",
    Critical: "This is firing hard. Hormonal management — natural, hybrid, or pharmaceutical — is the highest-leverage move you can make.",
  },
  inflammatory: {
    Mild: "Your inflammatory baseline is low. Maintain it — chronic inflammation is one of the easiest drivers to let creep up unnoticed.",
    Moderate: "Some inflammatory signal is present. Worth addressing now while it's still subclinical, before it starts visibly affecting follicle function.",
    Elevated: "Your scalp and/or system is inflamed. This driver is doing real damage to follicle output independent of any hormonal pattern.",
    Critical: "Heavy inflammatory load. This needs to be calmed before any other intervention will work efficiently — inflamed follicles don't respond well to growth signals.",
  },
  oxidative: {
    Mild: "Your oxidative load is manageable. The lifestyle inputs that drive this are mostly working in your favour.",
    Moderate: "Lifestyle factors are starting to add up. The follicle is one of the most metabolically active tissues in the body — it shows oxidative damage early.",
    Elevated: "Your daily inputs are loading the system with oxidative stress faster than your body can clear it. Mitochondrial damage in the dermal papilla compounds quickly.",
    Critical: "Severe oxidative load. The lifestyle pattern driving this is also damaging tissues you can't see yet — addressing it pays back across far more than just hair.",
  },
  vascular: {
    Mild: "Your circulation is supporting follicle delivery well. Movement and scalp work will keep it that way.",
    Moderate: "Microcirculation is moderately compromised. Your follicles are getting fewer nutrients than they should — fixable with movement and scalp manipulation.",
    Elevated: "Significant perfusion deficit. Even perfect nutrition and hormones won't reach follicles efficiently until circulation improves.",
    Critical: "Severe vascular compromise. The scalp is starved — restoring circulation is upstream of every other intervention working.",
  },
  nutritional: {
    Mild: "Your nutritional foundation is solid. Follicles have what they need to operate.",
    Moderate: "Some gaps in the nutritional floor. Worth getting blood work to identify exactly which nutrients are short — supplementing blind is rarely effective.",
    Elevated: "Your follicles are building hair on a depleted foundation. This is the cheapest driver to fix — bloods first, then targeted intervention.",
    Critical: "Significant deficiency pattern. Until the foundation is rebuilt, no other protocol will produce its full effect. Get full bloods before doing anything else.",
  },
  fibrosis: {
    Mild: "Minimal structural changes. You're well within the window where prevention is straightforward.",
    Moderate: "Early structural changes are beginning. This is the stage where consistent scalp work has the most impact — once fibrosis establishes, it's significantly harder to reverse.",
    Elevated: "Established perifollicular fibrosis. Reactivation is possible but requires sustained mechanical and biochemical intervention — there's no fast path through this.",
    Critical: "Significant fibrosis is locked in. Honest framing: fully smooth, shiny scalp areas have largely lost the follicle real estate. Surrounding areas are still defendable and partially reactivatable.",
  },
  growth_signalling: {
    Mild: "Strong regenerative capacity. Your follicles still respond well to growth signals — this is your biggest asset.",
    Moderate: "Regenerative capacity is reduced but functional. Still very responsive to the right stimulation if applied consistently.",
    Elevated: "Significantly reduced regenerative signalling. Reactivation requires more aggressive and sustained input — the biology is slower to respond than it was 10 years ago.",
    Critical: "Heavily compromised growth signalling. Realistic expectation is partial reactivation of dormant follicles, not full restoration. The protocol shifts toward retention as the primary goal.",
  },
  microenvironment: {
    Mild: "Your scalp surface is in good balance. Maintain with the right shampoo cadence and you won't have to think about this driver.",
    Moderate: "Some microenvironment disruption — likely dandruff, oiliness imbalance, or product residue building up. Cheap and fast to correct.",
    Elevated: "Significant scalp surface disruption. This is creating a chronic low-grade inflammatory load that compounds with every other driver. The shampoo and scalp routine matter as much as the actives you put on top.",
    Critical: "Severe microenvironment imbalance — likely active seborrhoeic dermatitis or persistent fungal overgrowth. This needs to be resolved at the surface before any follicle-level protocol can work properly.",
  },
};

export function getDriverConditionalSentence(
  driver: DriverKey,
  severity: SeverityLabel
): string | null {
  if (severity === "Minimal") return null;
  return DRIVER_CONDITIONAL[driver][severity as ConditionalSeverity] ?? null;
}

// ═══════════════════════════════════════
// SECTION 3 — Phenotype Paragraphs
// ═══════════════════════════════════════

export const PATTERN_PARAGRAPHS: Record<string, string> = {
  "Androgen-Dominant":
    "Your hair loss is being driven primarily by hormonal sensitivity at the follicle. DHT — the metabolite of testosterone produced by 5-alpha reductase — is binding to androgen receptors in your scalp follicles and signalling them to miniaturise over each successive growth cycle. This is the most common pattern globally, and the one with the most established intervention pathways across natural, hybrid, and pharmaceutical routes.",
  "Inflammation-Led":
    "Your hair loss is being driven primarily by chronic perifollicular inflammation. Inflammatory cytokines around the follicle damage hair-producing cells, disrupt the growth cycle, and contribute to early miniaturisation independent of hormonal patterns. Inflammation-led loss is often missed because it doesn't always cause visible itching or redness — but addressed properly, it's one of the most reversible patterns.",
  "Oxidative-Stressed":
    "Your hair loss is being driven primarily by oxidative damage to the cellular machinery inside follicle cells. Free radicals from smoking, chronic stress, sleep debt, alcohol, or excessive training overwhelm your antioxidant defences and damage the mitochondria your follicles depend on for energy. Hair is one of the most metabolically demanding tissues in the body, which is why it shows oxidative stress earlier than most other systems.",
  "Vascular-Compromised":
    "Your hair loss is being driven primarily by reduced microcirculation to the scalp. Without consistent blood flow, follicles can't access the nutrients, hormones, and oxygen they need — even when the supply elsewhere in your system is adequate. The scalp is peripheral tissue, which is why circulation issues often show in your hair before they show anywhere else you'd notice.",
  "Nutritionally-Depleted":
    "Your hair loss is being driven primarily by inadequate nutritional building blocks for follicle function. Hair is built from protein, sustained by iron, zinc, vitamin D, and B vitamins, and the body deprioritises hair production whenever supply is short. This is the cheapest driver to address — but blindly supplementing without knowing your specific deficiencies wastes time and rarely works.",
  "Fibrosis-Established":
    "Your hair loss is now being driven primarily by structural changes in the scalp tissue itself. Years of inflammation and follicle stress have caused collagen tightening around the follicle and atrophy of the supporting structures, creating a physical environment that traps follicles and resists regrowth. This pattern is harder to reverse than the upstream drivers — but defending the surrounding follicles and partially reactivating dormant ones is realistic.",
  "Regeneration-Compromised":
    "Your hair loss is being driven primarily by reduced regenerative signalling — the molecular pathways that wake dormant follicles and produce new hair are running quietly. This is partly age-related (regenerative capacity declines naturally) and partly the consequence of long-term stress on the hair cycle. Reactivation is possible but slower than at younger ages, and the protocol focus shifts toward consistent stimulation over months, not weeks.",
  "Scalp-Disrupted":
    "Your hair loss is being driven primarily by a disrupted scalp surface ecosystem. Sebum imbalance, microbiome overgrowth, pH disruption, or chronic product residue is creating a hostile environment for your follicles at the surface level. This is often the most overlooked driver — and one of the fastest to fix once it's identified and addressed with the right routine.",
  "Multi-Driver Cascade":
    "Your hair loss isn't being driven by one dominant pattern — it's being driven by several drivers firing simultaneously, each amplifying the others. Multi-driver cascades are biologically more aggressive than single-driver patterns and respond poorly to single-target interventions like a shampoo or one supplement. The protocol path here is full-system: addressing each firing driver in parallel, because fixing one while ignoring the others doesn't move the outcome.",
};

export const STAGE_PARAGRAPHS: Record<string, string> = {
  Early:
    "You're catching this in the prevention window. Drivers are firing but visible loss is minimal or absent — meaning the protocol can focus on stopping miniaturisation before it accelerates, rather than trying to recover what's already been lost.",
  Mid:
    "You're in the active intervention window. Visible loss is in progress, but enough functional follicles remain that the protocol can both halt further loss and produce meaningful regrowth. This is the stage where intervention pays back the most across both retention and reactivation.",
  Late:
    "You're past the prevention window. Significant loss is established and structural changes have set in, which means the protocol shifts focus: defending the follicles you still have, partially reactivating dormant ones, and managing the realistic ceiling on what's recoverable. Honest framing matters here — full restoration is unlikely, meaningful retention and partial regrowth is realistic.",
};

export const SPECIAL_CASE_PARAGRAPHS: Record<string, string[]> = {
  stress_telogen: [
    "Your hair loss pattern points to acute telogen effluvium — a stress-triggered shedding event, not the gradual miniaturisation of androgenetic loss. Recent illness, major life events, rapid weight changes, new medications, or post-pregnancy hormonal shifts can push large numbers of follicles into the resting phase simultaneously, with shedding becoming visible 2 to 4 months after the trigger. This is mechanistically different from genetic hair loss — and importantly, it's often substantially recoverable once the trigger is identified and addressed.",
    "The protocol path here is different from a standard RE5 variant. The first job is identifying and resolving the underlying trigger — stress, deficiency, medication, post-illness recovery — rather than starting a long-term hair protocol. Once the trigger is addressed, the follicles in the resting phase typically re-enter the growth phase on their own, often within 3 to 6 months.",
    "Below is the recovery curve you can realistically expect from telogen effluvium, and the supportive interventions that accelerate it.",
  ],
  autoimmune: [
    "Your loss pattern — patchy, defined areas of complete hair loss rather than diffuse thinning or recession — suggests possible alopecia areata or another autoimmune-mediated hair condition. Alopecia areata is an autoimmune disease where the immune system attacks the hair follicles, and it requires medical evaluation: a dermatologist needs to confirm the diagnosis, rule out related conditions (lupus, lichen planopilaris, alopecia totalis), and discuss treatments specific to autoimmune presentations like topical immunomodulators, intralesional steroids, or JAK inhibitors.",
    "RE5 is built around the eight biological drivers of androgenetic and stress-related hair loss. Those drivers are not what's causing this pattern, and applying a general hair restoration protocol without first confirming the diagnosis would be the wrong intervention. Honest framing: this is a place where the right next step is a doctor, not a protocol.",
    "We're not recommending a variant. We're recommending you book a dermatologist appointment, get the diagnosis confirmed, and come back if it turns out a hair restoration protocol is appropriate alongside whatever they prescribe.",
  ],
  low_pressure: [
    "Your assessment came back with genuinely low biological pressure across all eight drivers. No single pattern is firing meaningfully, your stage indicators are early, and your lifestyle inputs are largely working in your favour. This is the rare result where the honest answer is: your current trajectory is good, and the smartest move is protecting what you have rather than aggressively intervening.",
    "The right protocol for you is preventive — the lifestyle and scalp habits that keep drivers from activating later, without the supplemental and topical layer that someone with active loss needs. Hair loss is gradual and often genetic, so this can change in the future — but right now, you have more runway than most people who take this assessment.",
    "Below is your projected trajectory at current trends, and the simple preventive habits that keep you on it.",
  ],
};

// ═══════════════════════════════════════
// SECTION 6 — Concept Solutions
// ═══════════════════════════════════════

export interface ConceptSolution {
  title: string;
  mechanism: string;
  principles: string[];
  closing: string;
}

export const CONCEPT_SOLUTIONS: Record<DriverKey, ConceptSolution> = {
  hormonal: {
    title: "Address Your Hormonal Driver",
    mechanism:
      "Your follicles need less DHT exposure and reduced androgen receptor sensitivity in the scalp.",
    principles: [
      "Block DHT at the source — naturally through 5-alpha reductase inhibitors, pharmaceutically through prescription medication, or through a hybrid approach combining both.",
      "Reduce androgen receptor sensitivity — botanical compounds and topical antiandrogens that calm the receptor's response without systemic hormonal disruption.",
      "Manage downstream sebum and inflammation — DHT drives both, so addressing them lowers the secondary damage cascade.",
    ],
    closing:
      "Hormonal protocols take a minimum of 6 months to show meaningful change and 12 months to show their full effect. There is no fast path here — biology runs on its own timeline.",
  },
  inflammatory: {
    title: "Address Your Inflammatory Driver",
    mechanism:
      "Your scalp and/or system needs the inflammatory load reduced before any other intervention will work efficiently.",
    principles: [
      "Calm scalp surface inflammation — anti-inflammatory topicals and gentle cleansers replace the products quietly making it worse.",
      "Lower systemic inflammation — diet, sleep, and targeted nutritional support reduce the inflammatory baseline your body is operating from.",
      "Address underlying conditions — thyroid, autoimmune patterns, gut issues, or chronic infections need medical evaluation if suspected, not just supplementation.",
    ],
    closing:
      "Inflammation is one of the fastest drivers to respond — visible improvements in scalp symptoms can show in 4 to 8 weeks once the load drops.",
  },
  oxidative: {
    title: "Address Your Oxidative Driver",
    mechanism:
      "Your follicle cells need fewer free radicals being generated and stronger antioxidant defences clearing what's produced.",
    principles: [
      "Reduce the oxidative inputs — smoking, heavy alcohol, sleep debt, and excessive training without recovery are non-negotiable upstream sources.",
      "Strengthen antioxidant capacity — through diet, targeted supplementation, and protecting the scalp from UV damage.",
      "Support mitochondrial function — specific nutrients fuel the energy production follicle cells depend on for healthy growth cycles.",
    ],
    closing:
      "Oxidative damage compounds slowly and reverses slowly. The lifestyle changes that fix this also reduce risk across most age-related diseases — this is the highest-leverage driver to address for general health, not just hair.",
  },
  vascular: {
    title: "Address Your Vascular Driver",
    mechanism:
      "Your scalp needs more consistent blood flow delivering nutrients, hormones, and oxygen to the follicles.",
    principles: [
      "Increase whole-body circulation — regular movement, adequate hydration, and managing cardiovascular health upstream of any topical intervention.",
      "Manually stimulate scalp microcirculation — daily mechanical stimulation through specific massage techniques opens the capillary network around follicles.",
      "Reduce scalp tension — chronic tightness in the galea aponeurotica restricts blood flow regardless of cardiovascular health.",
    ],
    closing:
      "Vascular improvements can show in scalp warmth and feel within weeks, but follicle-level benefits compound over months.",
  },
  nutritional: {
    title: "Address Your Nutritional Driver",
    mechanism:
      "Your follicles are working with depleted raw materials and need the foundation rebuilt before any topical or hormonal intervention can produce its full effect.",
    principles: [
      "Test, don't guess — full blood work (ferritin, vitamin D, B12, thyroid panel, zinc) tells you exactly which nutrients are short. Supplementing blindly is rarely effective.",
      "Build the nutritional floor — adequate protein, the specific micronutrients flagged by your bloods, and a baseline diet that doesn't actively deplete you.",
      "Address absorption — gut health, age-related stomach acid decline, and medications that block nutrient uptake matter as much as intake.",
    ],
    closing:
      "Nutritional gaps can take 3 to 6 months of corrected supply before follicles reflect the change — they're at the back of the queue when supply was short.",
  },
  fibrosis: {
    title: "Address Your Fibrosis Driver",
    mechanism:
      "Your scalp tissue needs to be physically softened and the perifollicular tightness mechanically released.",
    principles: [
      "Daily mechanical work — sustained scalp manipulation breaks up fibrotic tissue and signals the body to remodel collagen — far more important than any product.",
      "Targeted topical penetration — once tissue is softened, active ingredients can reach the follicle properly. Order matters.",
      "Manage upstream inflammation — fibrosis is the body's response to long-term inflammation, so reducing the cause prevents further hardening even as you reverse what's there.",
    ],
    closing:
      "Fibrosis is the slowest driver to reverse. Realistic expectation: 6 to 12 months of consistent daily work before scalp texture meaningfully changes.",
  },
  growth_signalling: {
    title: "Address Your Growth Signalling Driver",
    mechanism:
      "Your follicles need the regenerative pathways stimulated more aggressively to wake dormant follicles and extend the active growth phase.",
    principles: [
      "Stimulate the Wnt/β-catenin pathway — the molecular switch that signals follicles to enter and stay in the growth phase. Activated through specific topical compounds and consistent mechanical stimulation.",
      "Support stem cell vitality — the bulge stem cells that drive new follicle formation respond to the same general inputs that support tissue regeneration anywhere in the body.",
      "Extend the growth cycle — interventions that lengthen anagen (the active growth phase) and shorten catagen (the transitional phase) directly produce thicker, denser hair.",
    ],
    closing:
      "Growth signalling responds slowly. Visible new growth from dormant follicles typically takes 4 to 6 months to appear, longer to mature.",
  },
  microenvironment: {
    title: "Address Your Scalp Microenvironment Driver",
    mechanism:
      "Your scalp surface ecosystem needs to be rebalanced — the right shampoo, the right cadence, the right management of sebum and microbiome.",
    principles: [
      "Switch to a non-stripping cleanser — harsh sulphates and daily over-washing damage the scalp barrier. Most people are using the wrong product entirely.",
      "Manage Malassezia and sebum — the yeast that causes dandruff and seb derm needs targeted control, not just generic anti-dandruff shampoo on a rotation.",
      "Wash at the right cadence — too often strips the barrier, too little allows microbial overgrowth. There's a specific frequency that works for most scalps.",
    ],
    closing:
      "Microenvironment improvements show fastest of any driver — flaking and itch can resolve in 2 to 4 weeks once the right routine is in place.",
  },
};

// ═══════════════════════════════════════
// SECTION 7 — General Plan Items
// ═══════════════════════════════════════

export interface PlanItem {
  id: string;
  title: string;
  body: string;
  caveat: string;
}

export const GENERAL_PLAN_ITEMS: PlanItem[] = [
  {
    id: "sleep",
    title: "Sleep 7–9 hours, consistently, in a dark room.",
    body: "Hair follicles complete their growth cycle work and DHT clearance during deep sleep. Sleep debt directly elevates cortisol, accelerates oxidative damage, and shortens the anagen growth phase.",
    caveat:
      "Won't fix androgen sensitivity on its own — but no protocol works properly when sleep is broken.",
  },
  {
    id: "shampoo",
    title:
      "Replace daily harsh shampoos with a gentle, non-stripping cleanser used 4 times a week.",
    body: "Most commercial shampoos strip the scalp barrier and disrupt the microbiome — which then causes the dandruff and oiliness people try to fix with stronger shampoo. The cycle compounds. The right cleanser used at the right cadence reverses it.",
    caveat:
      "This is foundational scalp care, not an active hair growth treatment — but it removes a hidden drag on every other intervention.",
  },
  {
    id: "scalp_massage",
    title: "Spend 5 minutes a day on firm scalp massage.",
    body: "Mechanical stimulation improves microcirculation around follicles, breaks up early perifollicular fibrosis, and signals the body to remodel scalp tissue — all without any product applied. There is real research suggesting daily scalp massage alone produces measurable hair density changes over 6+ months.",
    caveat:
      "Slow to show results — first 2–3 months feel like nothing is happening. Stick with it anyway.",
  },
  {
    id: "stress",
    title: "Treat stress as a hair input, not just a mental health issue.",
    body: "Chronic cortisol pushes follicles into the resting phase, suppresses the growth cycle, and drives systemic inflammation. Acute stress events trigger telogen effluvium 2–4 months later — meaning the shedding people see is often a delayed echo of something months ago.",
    caveat:
      "No protocol overrides chronically high cortisol. Whatever your method — exercise, breathwork, therapy, schedule changes — it counts as part of your hair plan.",
  },
  {
    id: "protein",
    title: "Build each meal around 25–40g of protein from real food.",
    body: "Hair is 95% keratin, which is protein. Inadequate protein intake produces miniaturised regrowth even when DHT and other drivers are well-controlled. Most people eating \"healthy\" still under-eat protein.",
    caveat:
      "Eating more protein won't grow hair on its own — but inadequate protein quietly caps every other intervention's ceiling.",
  },
  {
    id: "bloods",
    title:
      "Order a comprehensive blood panel: ferritin, vitamin D, B12, full thyroid (TSH, free T3, free T4, reverse T3), zinc.",
    body: "The cheapest intervention with the highest leverage. Most people losing hair have at least one significant deficiency they don't know about — and supplementing without testing wastes time on the wrong nutrients.",
    caveat:
      "Bloods don't fix anything on their own. They tell you exactly what to fix, which is the more important thing.",
  },
];

export const PLAN_CLOSING_DEFAULT =
  "These six habits are the foundation. They work without any product, supplement, or protocol — but they also have a ceiling. Most people who fix these alone slow their hair loss; few reverse it without targeted intervention on the firing drivers above.";

export const PLAN_CLOSING_LOW_PRESSURE =
  "You don't need targeted intervention right now — these six habits are your protocol. Stay on them and your low-pressure profile is genuinely sustainable.";

export const PLAN_INTRO_STRESS_TELOGEN =
  "Your priority is identifying and addressing the trigger that pushed your hair into the resting phase. The six foundational habits below support recovery — but the most important step is upstream: figure out what triggered this and resolve it.";
