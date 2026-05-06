import { calculateScores, internalToDisplay, getSeverityLabel, getScoreBand } from "./scoring";
import { assignPhenotype } from "./phenotype";
import { getPercentile, getPercentileCopy, generateLossCurve } from "./graphs";
import { Answers } from "./types";

function test(name: string, answers: Answers) {
  console.log(`\n${"═".repeat(60)}`);
  console.log(`TEST: ${name}`);
  console.log("═".repeat(60));

  const scores = calculateScores(answers);
  const result = assignPhenotype(answers);

  console.log(`\nHeadline Score: ${scores.headlineScore}/100 (${getScoreBand(scores.headlineScore)})`);
  console.log(`Stage Score: ${scores.stageScore}/20`);
  console.log(`Flags: ${[...scores.flags].join(", ") || "none"}`);

  console.log("\nDriver Scores (internal → display):");
  for (const [key, val] of Object.entries(scores.drivers)) {
    const display = internalToDisplay(val);
    console.log(`  ${key.padEnd(20)} ${val}/10 → ${display}/5 (${getSeverityLabel(display)})`);
  }

  console.log(`\nPhenotype: ${result.phenotype}`);
  console.log(`Stage: ${result.stage}`);
  console.log(`Primary Driver: ${result.primaryDriver}`);
  console.log(`Secondary Driver: ${result.secondaryDriver}`);
  console.log(`Special Case: ${result.specialCase}`);
  console.log(`Variant: ${result.variant}`);

  const percentile = getPercentile(scores.headlineScore);
  console.log(`\nPercentile: ${percentile}th — ${getPercentileCopy(percentile)}`);

  if (result.stage && result.variant) {
    const curve = generateLossCurve(
      answers["Q02_AGE"] as number,
      result.phenotype,
      result.stage,
      result.variant,
      2
    );
    const now = curve.find(p => p.age === answers["Q02_AGE"] as number);
    const at60 = curve.find(p => p.age === 60);
    if (now && at60) {
      console.log(`\nLoss Curve @ current age: ${now.noIntervention.toFixed(1)}% density (no intervention), ${now.re5Trajectory.toFixed(1)}% (RE5)`);
      console.log(`Loss Curve @ age 60: ${at60.noIntervention.toFixed(1)}% density (no intervention), ${at60.re5Trajectory.toFixed(1)}% (RE5)`);
    }
  }
}

// Test 1: Classic androgen-dominant male, mid-stage
test("Androgen-Dominant Male, Mid Stage", {
  Q01_SEX: "M",
  Q02_AGE: 35,
  Q03_VISIBLE_LOSS_M: "NW34",
  Q04_ONSET_YEARS: "3-7y",
  Q05_PROGRESSION_RATE: "slow",
  Q06_FH_PATERNAL: "most",
  Q07_FH_MATERNAL: "mild",
  Q08_SCALP_VISIBLE: "mixed",
  Q09_LOSS_PATTERN: "temples_crown",
  Q10_ANDROGEN_SIGNS: "active_signs",
  Q11_HORMONAL_M: "low_t_signs",
  Q12_SLEEP: "short",
  Q13_STRESS: "normal",
  Q14_SMOKING: "never",
  Q15_SCALP_FEEL: "normal",
  Q16_SCALP_VISUAL: "normal",
  Q17_WASH_HABITS: "good",
  Q18_AUTOIMMUNE: "none",
  Q19_RECENT_HEALTH: "none",
  Q20_PERIPHERAL_TEMP: "normal",
  Q21_MOVEMENT: "moderate",
  Q22_DIET_QUALITY: "whole_foods",
  Q23_FIBROSIS_DIRECT: "smooth",
  Q24_GROWTH_SIGNALLING_DIRECT: "normal",
  Q25_PHARMA_OPENNESS: "hybrid",
  Q26_EMAIL: "test@example.com",
});

// Test 2: Stress-telogen female
test("Stress-Telogen Female", {
  Q01_SEX: "F",
  Q02_AGE: 28,
  Q03_VISIBLE_LOSS_F: "LW_DIFFUSE",
  Q04_ONSET_YEARS: "<1y",
  Q05_PROGRESSION_RATE: "rapid",
  Q06_FH_PATERNAL: "none",
  Q07_FH_MATERNAL: "none",
  Q08_SCALP_VISIBLE: "finer",
  Q09_LOSS_PATTERN: "diffuse",
  Q10_ANDROGEN_SIGNS: "none",
  Q11_HORMONAL_F: "post_pregnancy",
  Q12_SLEEP: "poor",
  Q13_STRESS: "acute",
  Q14_SMOKING: "never",
  Q15_SCALP_FEEL: "normal",
  Q16_SCALP_VISUAL: "normal",
  Q17_WASH_HABITS: "good",
  Q18_AUTOIMMUNE: "none",
  Q19_RECENT_HEALTH: "none",
  Q20_PERIPHERAL_TEMP: "normal",
  Q21_MOVEMENT: "moderate",
  Q22_DIET_QUALITY: "mostly_good",
  Q23_FIBROSIS_DIRECT: "no_thinning",
  Q24_GROWTH_SIGNALLING_DIRECT: "fast",
  Q25_PHARMA_OPENNESS: "natural_only",
  Q26_EMAIL: "test@example.com",
});

// Test 3: Autoimmune-suspected
test("Autoimmune-Suspected Male", {
  Q01_SEX: "M",
  Q02_AGE: 42,
  Q03_VISIBLE_LOSS_M: "NW34",
  Q04_ONSET_YEARS: "1-3y",
  Q05_PROGRESSION_RATE: "fast",
  Q06_FH_PATERNAL: "none",
  Q07_FH_MATERNAL: "none",
  Q08_SCALP_VISIBLE: "mixed",
  Q09_LOSS_PATTERN: "patchy",
  Q10_ANDROGEN_SIGNS: "none",
  Q11_HORMONAL_M: "none",
  Q12_SLEEP: "ok",
  Q13_STRESS: "elevated",
  Q14_SMOKING: "never",
  Q15_SCALP_FEEL: "itchy",
  Q16_SCALP_VISUAL: "redness",
  Q17_WASH_HABITS: "good",
  Q18_AUTOIMMUNE: "autoimmune",
  Q19_RECENT_HEALTH: "none",
  Q20_PERIPHERAL_TEMP: "normal",
  Q21_MOVEMENT: "light",
  Q22_DIET_QUALITY: "mostly_good",
  Q23_FIBROSIS_DIRECT: "normal",
  Q24_GROWTH_SIGNALLING_DIRECT: "normal",
  Q25_PHARMA_OPENNESS: "natural_first",
  Q26_EMAIL: "test@example.com",
});

// Test 4: Low-pressure protective
test("Low-Pressure Protective Female", {
  Q01_SEX: "F",
  Q02_AGE: 22,
  Q03_VISIBLE_LOSS_F: "LW0",
  Q04_ONSET_YEARS: "none",
  Q05_PROGRESSION_RATE: "none",
  Q06_FH_PATERNAL: "none",
  Q07_FH_MATERNAL: "none",
  Q08_SCALP_VISIBLE: "no_thinning",
  Q09_LOSS_PATTERN: "none",
  Q10_ANDROGEN_SIGNS: "none",
  Q11_HORMONAL_F: "none",
  Q12_SLEEP: "good",
  Q13_STRESS: "calm",
  Q14_SMOKING: "never",
  Q15_SCALP_FEEL: "normal",
  Q16_SCALP_VISUAL: "normal",
  Q17_WASH_HABITS: "good",
  Q18_AUTOIMMUNE: "none",
  Q19_RECENT_HEALTH: "none",
  Q20_PERIPHERAL_TEMP: "normal",
  Q21_MOVEMENT: "moderate",
  Q22_DIET_QUALITY: "whole_foods",
  Q23_FIBROSIS_DIRECT: "no_thinning",
  Q24_GROWTH_SIGNALLING_DIRECT: "fast",
  Q25_PHARMA_OPENNESS: "natural_only",
  Q26_EMAIL: "test@example.com",
});

// Test 5: Multi-driver cascade
test("Multi-Driver Cascade Male", {
  Q01_SEX: "M",
  Q02_AGE: 48,
  Q03_VISIBLE_LOSS_M: "NW5",
  Q04_ONSET_YEARS: ">7y",
  Q05_PROGRESSION_RATE: "slow",
  Q06_FH_PATERNAL: "all",
  Q07_FH_MATERNAL: "most",
  Q08_SCALP_VISIBLE: "smooth",
  Q09_LOSS_PATTERN: "temples_crown",
  Q10_ANDROGEN_SIGNS: "active_signs",
  Q11_HORMONAL_M: "trt",
  Q12_SLEEP: "poor",
  Q13_STRESS: "high",
  Q14_SMOKING: "daily",
  Q15_SCALP_FEEL: "tender",
  Q16_SCALP_VISUAL: "redness",
  Q17_WASH_HABITS: "daily_generic",
  Q18_AUTOIMMUNE: "none",
  Q19_RECENT_HEALTH: "none",
  Q20_PERIPHERAL_TEMP: "always",
  Q21_MOVEMENT: "sedentary",
  Q22_DIET_QUALITY: "poor",
  Q23_FIBROSIS_DIRECT: "shiny",
  Q24_GROWTH_SIGNALLING_DIRECT: "slow",
  Q25_PHARMA_OPENNESS: "full_pharma",
  Q26_EMAIL: "test@example.com",
});
