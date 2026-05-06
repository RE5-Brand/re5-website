import {
  Answers,
  DriverKey,
  OverlayName,
  PatternName,
  PhenotypeResult,
  Stage,
} from "./types";
import { calculateScores, getSortedDrivers } from "./scoring";
import { recommendVariant } from "./variant";

const DRIVER_TO_PATTERN: Record<DriverKey, PatternName> = {
  hormonal: "Androgen-Dominant",
  inflammatory: "Inflammation-Led",
  oxidative: "Oxidative-Stressed",
  vascular: "Vascular-Compromised",
  nutritional: "Nutritionally-Depleted",
  fibrosis: "Fibrosis-Established",
  growth_signalling: "Regeneration-Compromised",
  microenvironment: "Scalp-Disrupted",
};

const DRIVER_TO_OVERLAY: Record<DriverKey, OverlayName> = {
  hormonal: "Hormonal",
  inflammatory: "Inflammation",
  oxidative: "Oxidative",
  vascular: "Vascular",
  nutritional: "Nutritional",
  fibrosis: "Fibrosis",
  growth_signalling: "Regenerative",
  microenvironment: "Microenvironment",
};

export const OVERLAY_VERBS: Record<DriverKey, string> = {
  hormonal: "managed",
  inflammatory: "calmed",
  oxidative: "reduced",
  vascular: "restored",
  nutritional: "restored",
  fibrosis: "softened",
  growth_signalling: "reactivated",
  microenvironment: "rebalanced",
};

function deriveStage(stageScore: number): Stage {
  if (stageScore <= 7) return "Early";
  if (stageScore <= 14) return "Mid";
  return "Late";
}

function derivePatternSignal(answers: Answers): string | null {
  const q9 = answers["Q09_LOSS_PATTERN"];
  if (q9 === "patchy") return "autoimmune";
  return null;
}

export function assignPhenotype(answers: Answers): PhenotypeResult {
  const { drivers, stageScore, headlineScore, flags } = calculateScores(answers);
  const sex = answers["Q01_SEX"] as "M" | "F";
  const pharmaOpenness = answers["Q25_PHARMA_OPENNESS"] as string;
  const patternSignal = derivePatternSignal(answers);
  const stage = deriveStage(stageScore);

  // Override 1: Autoimmune (highest priority)
  if (patternSignal === "autoimmune") {
    return {
      phenotype: "Autoimmune-Suspected",
      stage: null,
      primaryDriver: null,
      secondaryDriver: null,
      specialCase: "autoimmune",
      variant: null,
      score: headlineScore,
    };
  }

  // Override 2: Stress-Telogen
  let triggerCount = 0;
  if (flags.has("acute_trigger")) triggerCount++;
  if (flags.has("stress_telogen")) triggerCount++;
  if (triggerCount >= 2) {
    return {
      phenotype: `Stress-Telogen, ${stage} Stage`,
      stage,
      primaryDriver: null,
      secondaryDriver: null,
      specialCase: "stress_telogen",
      variant: null,
      score: headlineScore,
    };
  }

  // Override 3: Low-Pressure Protective
  const maxDriverScore = Math.max(...Object.values(drivers));
  if (maxDriverScore < 4 && stageScore < 8) {
    return {
      phenotype: "Low-Pressure Protective Profile",
      stage: "Early",
      primaryDriver: null,
      secondaryDriver: null,
      specialCase: "low_pressure",
      variant: null,
      score: headlineScore,
    };
  }

  // Standard phenotype assignment
  const sorted = getSortedDrivers(drivers);
  const primary = sorted[0];
  const secondary = sorted[1];

  // Multi-driver cascade check
  const highDriverCount = sorted.filter((d) => d.score >= 7).length;

  let pattern: string;
  let secondaryDriver: DriverKey | null = null;

  if (highDriverCount >= 3) {
    pattern = "Multi-Driver Cascade";
  } else if (
    secondary.score >= 6 &&
    secondary.score >= primary.score * 0.7
  ) {
    pattern = `${DRIVER_TO_PATTERN[primary.key]} with ${DRIVER_TO_OVERLAY[secondary.key]} Overlay`;
    secondaryDriver = secondary.key;
  } else {
    pattern = DRIVER_TO_PATTERN[primary.key];
  }

  const phenotype = `${pattern}, ${stage} Stage`;
  const variant = recommendVariant(sex, pharmaOpenness, flags);

  return {
    phenotype,
    stage,
    primaryDriver: primary.key,
    secondaryDriver,
    specialCase: null,
    variant,
    score: headlineScore,
  };
}

export function getPatternName(driverKey: DriverKey): PatternName {
  return DRIVER_TO_PATTERN[driverKey];
}

export function getOverlayName(driverKey: DriverKey): OverlayName {
  return DRIVER_TO_OVERLAY[driverKey];
}
