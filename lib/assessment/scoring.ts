import {
  Answers,
  DriverKey,
  DriverScores,
  FlagKey,
  ScoreBand,
  ScoringResult,
  SeverityLabel,
} from "./types";
import { QUESTIONS } from "./questions";

const DRIVER_KEYS: DriverKey[] = [
  "hormonal",
  "inflammatory",
  "oxidative",
  "vascular",
  "nutritional",
  "fibrosis",
  "growth_signalling",
  "microenvironment",
];

const DRIVER_CAP = 10;
const STAGE_CAP = 20;
const FAMILY_HISTORY_STAGE_CAP = 4;

export function calculateScores(answers: Answers): ScoringResult {
  const drivers: DriverScores = {
    hormonal: 0,
    inflammatory: 0,
    oxidative: 0,
    vascular: 0,
    nutritional: 0,
    fibrosis: 0,
    growth_signalling: 0,
    microenvironment: 0,
  };

  let stageScore = 0;
  const flags = new Set<FlagKey>();

  const sex = answers["Q01_SEX"] as string;

  for (const question of QUESTIONS) {
    if (question.branching) {
      if (question.branching.field === "sex" && question.branching.value !== sex) {
        continue;
      }
    }

    const answer = answers[question.id];
    if (answer === undefined || answer === null) continue;

    if (question.type === "numeric_input" && question.numericScoring) {
      const numValue = typeof answer === "number" ? answer : parseInt(answer as string, 10);
      if (isNaN(numValue)) continue;

      for (const rule of question.numericScoring) {
        for (const range of rule.ranges) {
          if (numValue >= range.min && numValue <= range.max) {
            if (rule.target === "stage") {
              stageScore += range.value;
            } else {
              const driverKey = rule.target as DriverKey;
              drivers[driverKey] += range.value;
            }
            break;
          }
        }
      }
      continue;
    }

    if (question.type === "email_input") continue;

    if (question.options) {
      const selectedOption = question.options.find((o) => o.id === answer);
      if (!selectedOption) continue;

      for (const [key, value] of Object.entries(selectedOption.scoring)) {
        if (key === "stage") {
          stageScore += value;
        } else {
          const driverKey = key as DriverKey;
          drivers[driverKey] += value;
        }
      }

      if (selectedOption.flags) {
        for (const flag of selectedOption.flags) {
          flags.add(flag);
        }
      }
    }
  }

  // Apply Q6+Q7 combined stage cap (4 points max from family history)
  const q6Answer = answers["Q06_FH_PATERNAL"];
  const q7Answer = answers["Q07_FH_MATERNAL"];
  if (q6Answer && q7Answer) {
    const q6 = QUESTIONS.find((q) => q.id === "Q06_FH_PATERNAL")!;
    const q7 = QUESTIONS.find((q) => q.id === "Q07_FH_MATERNAL")!;
    const q6Stage = q6.options?.find((o) => o.id === q6Answer)?.scoring.stage ?? 0;
    const q7Stage = q7.options?.find((o) => o.id === q7Answer)?.scoring.stage ?? 0;
    const rawFamilyStage = q6Stage + q7Stage;
    if (rawFamilyStage > FAMILY_HISTORY_STAGE_CAP) {
      stageScore -= rawFamilyStage - FAMILY_HISTORY_STAGE_CAP;
    }
  }

  // Cap each driver at 10
  for (const key of DRIVER_KEYS) {
    drivers[key] = Math.min(drivers[key], DRIVER_CAP);
  }

  // Cap stage at 20
  stageScore = Math.min(stageScore, STAGE_CAP);
  stageScore = Math.max(stageScore, 0);

  const totalDrivers = DRIVER_KEYS.reduce((sum, key) => sum + drivers[key], 0);
  const headlineScore = totalDrivers + stageScore;

  return { drivers, stageScore, headlineScore, flags };
}

export function internalToDisplay(internal: number): number {
  const raw = Math.ceil(internal / 2);
  return Math.max(1, Math.min(5, raw));
}

export function getSeverityLabel(displayScore: number): SeverityLabel {
  if (displayScore <= 1) return "Minimal";
  if (displayScore <= 2) return "Mild";
  if (displayScore <= 3) return "Moderate";
  if (displayScore <= 4) return "Elevated";
  return "Critical";
}

export function getScoreBand(headlineScore: number): ScoreBand {
  if (headlineScore <= 20) return "Minimal Pressure";
  if (headlineScore <= 40) return "Mild Pressure";
  if (headlineScore <= 60) return "Moderate Pressure";
  if (headlineScore <= 80) return "High Pressure";
  return "Severe Pressure";
}

export function getScoreBandColor(band: ScoreBand): string {
  switch (band) {
    case "Minimal Pressure": return "#2F5F6B";
    case "Mild Pressure": return "#5A8B95";
    case "Moderate Pressure": return "#8A8578";
    case "High Pressure": return "#E8893D";
    case "Severe Pressure": return "#1A1A1A";
  }
}

export function getFamilyHistoryPoints(answers: Answers): number {
  const q6 = QUESTIONS.find((q) => q.id === "Q06_FH_PATERNAL")!;
  const q7 = QUESTIONS.find((q) => q.id === "Q07_FH_MATERNAL")!;
  const q6Stage = q6.options?.find((o) => o.id === answers["Q06_FH_PATERNAL"])?.scoring.stage ?? 0;
  const q7Stage = q7.options?.find((o) => o.id === answers["Q07_FH_MATERNAL"])?.scoring.stage ?? 0;
  return Math.min(q6Stage + q7Stage, FAMILY_HISTORY_STAGE_CAP);
}

export function getSortedDrivers(drivers: DriverScores): { key: DriverKey; score: number }[] {
  const PRIORITY: DriverKey[] = [
    "hormonal",
    "inflammatory",
    "vascular",
    "nutritional",
    "oxidative",
    "microenvironment",
    "fibrosis",
    "growth_signalling",
  ];

  return DRIVER_KEYS.map((key) => ({ key, score: drivers[key] })).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return PRIORITY.indexOf(a.key) - PRIORITY.indexOf(b.key);
  });
}
