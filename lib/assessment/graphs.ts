import { PatternName, Stage, VariantName } from "./types";

// ═══════════════════════════════════════
// GRAPH 1 — Follicle Loss Curve
// ═══════════════════════════════════════

interface PhenotypeParams {
  L: number;       // lifetime loss % (0-1 scale)
  k: number;       // rate of decline
  midpoint: number; // default inflection age
}

const PHENOTYPE_PARAMS: Record<string, PhenotypeParams> = {
  "Androgen-Dominant":       { L: 0.70, k: 0.15, midpoint: 50 },
  "Inflammation-Led":        { L: 0.40, k: 0.08, midpoint: 55 },
  "Oxidative-Stressed":      { L: 0.35, k: 0.07, midpoint: 58 },
  "Vascular-Compromised":    { L: 0.35, k: 0.07, midpoint: 60 },
  "Nutritionally-Depleted":  { L: 0.30, k: 0.06, midpoint: 60 },
  "Fibrosis-Established":    { L: 0.65, k: 0.20, midpoint: 45 },
  "Regeneration-Compromised":{ L: 0.45, k: 0.10, midpoint: 55 },
  "Scalp-Disrupted":         { L: 0.30, k: 0.06, midpoint: 58 },
  "Multi-Driver Cascade":    { L: 0.75, k: 0.18, midpoint: 45 },
  "Low-Pressure Protective": { L: 0.15, k: 0.03, midpoint: 65 },
};

interface VariantEfficacy {
  L_reduction: number;
}

const VARIANT_EFFICACY: Record<string, VariantEfficacy> = {
  "Natural":                      { L_reduction: 0.30 },
  "Hybrid":                       { L_reduction: 0.475 },
  "Pharma":                       { L_reduction: 0.575 },
  "Pharma — Optimisation Track":  { L_reduction: 0.40 },
};

function getBaseParams(
  phenotypeName: string
): PhenotypeParams {
  // Extract pattern name from full phenotype (e.g. "Androgen-Dominant with Inflammation Overlay, Mid Stage")
  for (const key of Object.keys(PHENOTYPE_PARAMS)) {
    if (phenotypeName.startsWith(key)) {
      return { ...PHENOTYPE_PARAMS[key] };
    }
  }
  // Multi-driver cascade check
  if (phenotypeName.includes("Multi-Driver Cascade")) {
    return { ...PHENOTYPE_PARAMS["Multi-Driver Cascade"] };
  }
  // Low-pressure
  if (phenotypeName.includes("Low-Pressure")) {
    return { ...PHENOTYPE_PARAMS["Low-Pressure Protective"] };
  }
  // Fallback
  return { ...PHENOTYPE_PARAMS["Androgen-Dominant"] };
}

function getVariantKey(variant: VariantName): string {
  // Strip sex prefix: "Men's Natural" → "Natural"
  return variant.replace(/^(Men's|Women's)\s+/, "");
}

export function noInterventionDensity(
  age: number,
  currentAge: number,
  phenotypeName: string,
  stage: Stage | null,
  familyHistoryPoints: number
): number {
  const params = getBaseParams(phenotypeName);
  let { L, k, midpoint } = params;

  // Stage modifier
  if (stage === "Early") midpoint += 5;
  else if (stage === "Mid") midpoint = currentAge + 5;
  else if (stage === "Late") midpoint = currentAge - 3;

  // Family history modifier
  if (familyHistoryPoints === 0) L *= 0.9;
  if (familyHistoryPoints >= 3) {
    L *= 1.1;
    midpoint -= 3;
  }

  const density = 100 * (1 - L / (1 + Math.exp(-k * (age - midpoint))));
  return Math.max(0, Math.min(100, density));
}

export function re5TrajectoryDensity(
  age: number,
  currentAge: number,
  phenotypeName: string,
  stage: Stage | null,
  variant: VariantName,
  familyHistoryPoints: number
): number {
  const params = getBaseParams(phenotypeName);
  const variantKey = getVariantKey(variant);
  const efficacy = VARIANT_EFFICACY[variantKey] ?? VARIANT_EFFICACY["Natural"];

  let L = params.L * (1 - efficacy.L_reduction);
  let { k, midpoint } = params;

  // Stage modifier on base params
  if (stage === "Early") midpoint += 5;
  else if (stage === "Mid") midpoint = currentAge + 5;
  else if (stage === "Late") midpoint = currentAge - 3;

  // Family history modifier
  if (familyHistoryPoints === 0) L *= 0.9;
  if (familyHistoryPoints >= 3) {
    L *= 1.1;
    midpoint -= 3;
  }

  // Stage attenuation on efficacy
  if (stage === "Mid") L *= 1.2;
  if (stage === "Late") L *= 1.5;

  // Protocol effect
  k *= 0.7;
  midpoint += 3;

  const density = 100 * (1 - L / (1 + Math.exp(-k * (age - midpoint))));
  return Math.max(0, Math.min(100, density));
}

export interface CurvePoint {
  age: number;
  noIntervention: number;
  re5Trajectory: number;
}

export function generateLossCurve(
  currentAge: number,
  phenotypeName: string,
  stage: Stage | null,
  variant: VariantName | null,
  familyHistoryPoints: number,
  endAge: number = 70
): CurvePoint[] {
  const points: CurvePoint[] = [];

  const effectiveVariant = variant ?? ("Men's Natural" as VariantName);
  const startAge = Math.max(currentAge - 5, 18);

  for (let age = startAge; age <= endAge; age++) {
    points.push({
      age,
      noIntervention: noInterventionDensity(age, currentAge, phenotypeName, stage, familyHistoryPoints),
      re5Trajectory: re5TrajectoryDensity(age, currentAge, phenotypeName, stage, effectiveVariant, familyHistoryPoints),
    });
  }

  return points;
}

// ═══════════════════════════════════════
// GRAPH 2 — Percentile Distribution
// ═══════════════════════════════════════

const POPULATION_MEAN = 45;
const POPULATION_STD_DEV = 18;

function erf(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);

  const t = 1.0 / (1.0 + p * x);
  const y =
    1.0 -
    ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) *
      t *
      Math.exp(-x * x);

  return sign * y;
}

export function getPercentile(userScore: number): number {
  const z = (userScore - POPULATION_MEAN) / POPULATION_STD_DEV;
  const percentile = 0.5 * (1 + erf(z / Math.SQRT2));
  return Math.round(percentile * 100);
}

export function getPercentileCopy(percentile: number): string {
  if (percentile <= 10)
    return "You're in the best 10% of people who've taken this assessment. Your biological pressure is genuinely low — protect what you have.";
  if (percentile <= 25)
    return "You're in the best 25%. You're well-positioned compared to most people in your age range.";
  if (percentile <= 50)
    return "You sit in the better half of the distribution. Driver activity is moderate but manageable.";
  if (percentile <= 75)
    return "You sit in the worse half. Several drivers are firing at meaningful levels.";
  if (percentile <= 90)
    return "You're in the worst 25%. Your driver profile is more active than most assessment-takers — early intervention pays back the most here.";
  return "You're in the worst 10%. Aggressive driver activation — but the protocol path is clear and the leverage is high.";
}

export interface DistributionPoint {
  score: number;
  density: number;
}

export function generateDistributionCurve(): DistributionPoint[] {
  const points: DistributionPoint[] = [];
  for (let score = 0; score <= 100; score++) {
    const z = (score - POPULATION_MEAN) / POPULATION_STD_DEV;
    const density = Math.exp(-0.5 * z * z) / (POPULATION_STD_DEV * Math.sqrt(2 * Math.PI));
    points.push({ score, density });
  }
  return points;
}
