export type Sex = "M" | "F";

export type QuestionType =
  | "single_select"
  | "numeric_input"
  | "image_select"
  | "email_input";

export type DriverKey =
  | "hormonal"
  | "inflammatory"
  | "oxidative"
  | "vascular"
  | "nutritional"
  | "fibrosis"
  | "growth_signalling"
  | "microenvironment";

export type FlagKey =
  | "stress_telogen"
  | "autoimmune"
  | "existing_pharma"
  | "acute_trigger";

export type SeverityLabel =
  | "Minimal"
  | "Mild"
  | "Moderate"
  | "Elevated"
  | "Critical";

export type Stage = "Early" | "Mid" | "Late";

export type ScoreBand =
  | "Minimal Pressure"
  | "Mild Pressure"
  | "Moderate Pressure"
  | "High Pressure"
  | "Severe Pressure";

export interface DriverScoring {
  [key: string]: number; // driver key or "stage" → point value
}

export interface Option {
  id: string;
  text: string;
  scoring: DriverScoring;
  flags?: FlagKey[];
}

export interface NumericScoringRule {
  type: "range";
  target: string; // driver key or "stage"
  ranges: { min: number; max: number; value: number }[];
}

export interface BranchingRule {
  field: "sex";
  value: Sex;
}

export interface Question {
  id: string;
  part: 1 | 2 | 3;
  position: number;
  type: QuestionType;
  questionText: string;
  options?: Option[];
  numericScoring?: NumericScoringRule[];
  validation?: { min: number; max: number; integer: boolean };
  branching?: BranchingRule;
}

export interface DriverScores {
  hormonal: number;
  inflammatory: number;
  oxidative: number;
  vascular: number;
  nutritional: number;
  fibrosis: number;
  growth_signalling: number;
  microenvironment: number;
}

export interface ScoringResult {
  drivers: DriverScores;
  stageScore: number;
  headlineScore: number;
  flags: Set<FlagKey>;
}

export type PatternName =
  | "Androgen-Dominant"
  | "Inflammation-Led"
  | "Oxidative-Stressed"
  | "Vascular-Compromised"
  | "Nutritionally-Depleted"
  | "Fibrosis-Established"
  | "Regeneration-Compromised"
  | "Scalp-Disrupted"
  | "Multi-Driver Cascade";

export type OverlayName =
  | "Hormonal"
  | "Inflammation"
  | "Oxidative"
  | "Vascular"
  | "Nutritional"
  | "Fibrosis"
  | "Regenerative"
  | "Microenvironment";

export type SpecialCase =
  | "autoimmune"
  | "stress_telogen"
  | "low_pressure"
  | null;

export type VariantName =
  | "Men's Natural"
  | "Men's Hybrid"
  | "Men's Pharma"
  | "Men's Pharma — Optimisation Track"
  | "Women's Natural"
  | "Women's Hybrid"
  | "Women's Pharma"
  | "Women's Pharma — Optimisation Track";

export interface PhenotypeResult {
  phenotype: string;
  stage: Stage | null;
  primaryDriver: DriverKey | null;
  secondaryDriver: DriverKey | null;
  specialCase: SpecialCase;
  variant: VariantName | null;
  score: number;
}

export interface Answers {
  [questionId: string]: string | number;
}
