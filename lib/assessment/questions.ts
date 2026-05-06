import { Question } from "./types";

export const QUESTIONS: Question[] = [
  // ═══════════════════════════════════════
  // PART 1 — YOUR HAIR STORY (Q1–Q9)
  // ═══════════════════════════════════════

  {
    id: "Q01_SEX",
    part: 1,
    position: 1,
    type: "single_select",
    questionText: "What's your biological sex?",
    options: [
      { id: "M", text: "Male", scoring: {} },
      { id: "F", text: "Female", scoring: {} },
    ],
  },

  {
    id: "Q02_AGE",
    part: 1,
    position: 2,
    type: "numeric_input",
    questionText: "How old are you?",
    validation: { min: 13, max: 99, integer: true },
    numericScoring: [
      {
        type: "range",
        target: "stage",
        ranges: [
          { min: 13, max: 24, value: 0 },
          { min: 25, max: 34, value: 1 },
          { min: 35, max: 44, value: 2 },
          { min: 45, max: 54, value: 3 },
          { min: 55, max: 99, value: 4 },
        ],
      },
      {
        type: "range",
        target: "growth_signalling",
        ranges: [
          { min: 13, max: 39, value: 0 },
          { min: 40, max: 49, value: 1 },
          { min: 50, max: 59, value: 2 },
          { min: 60, max: 99, value: 3 },
        ],
      },
    ],
  },

  // Q3 — Male variant (Norwood)
  {
    id: "Q03_VISIBLE_LOSS_M",
    part: 1,
    position: 3,
    type: "image_select",
    questionText: "Which best matches what you see in the mirror right now?",
    branching: { field: "sex", value: "M" },
    options: [
      { id: "NW0", text: "No visible loss — I'm here for prevention", scoring: { stage: 0 } },
      { id: "NW2", text: "Slight temple recession only (Norwood II)", scoring: { stage: 1 } },
      { id: "NW34", text: "Clear temple recession, possibly thinning crown (Norwood III/IV)", scoring: { stage: 2 } },
      { id: "NW5", text: "Significant thinning across top, scalp visible in good light (Norwood V)", scoring: { stage: 3 } },
      { id: "NW67", text: "Mostly bald on top, hair on sides only (Norwood VI/VII)", scoring: { stage: 4 } },
    ],
  },

  // Q3 — Female variant (Ludwig)
  {
    id: "Q03_VISIBLE_LOSS_F",
    part: 1,
    position: 3,
    type: "image_select",
    questionText: "Which best matches what you see in the mirror right now?",
    branching: { field: "sex", value: "F" },
    options: [
      { id: "LW0", text: "No visible loss — I'm here for prevention", scoring: { stage: 0 } },
      { id: "LW1", text: "Wider part line than before, mild thinning at the crown (Ludwig I)", scoring: { stage: 1 } },
      { id: "LW2", text: "Clearly visible scalp through the part, noticeable thinning on top (Ludwig II)", scoring: { stage: 2 } },
      { id: "LW3", text: "Significant thinning across the top, scalp very visible (Ludwig III)", scoring: { stage: 3 } },
      { id: "LW_DIFFUSE", text: "Diffuse thinning everywhere including sides", scoring: { stage: 2 }, flags: ["stress_telogen"] },
    ],
  },

  {
    id: "Q04_ONSET_YEARS",
    part: 1,
    position: 4,
    type: "single_select",
    questionText: "When did you first notice you were losing hair?",
    options: [
      { id: "none", text: "I haven't yet — just being proactive", scoring: { stage: 0, fibrosis: 0 } },
      { id: "<1y", text: "Within the last year", scoring: { stage: 1, fibrosis: 0 } },
      { id: "1-3y", text: "1–3 years ago", scoring: { stage: 2, fibrosis: 0 } },
      { id: "3-7y", text: "3–7 years ago", scoring: { stage: 3, fibrosis: 2 } },
      { id: ">7y", text: "More than 7 years ago", scoring: { stage: 4, fibrosis: 3 } },
    ],
  },

  {
    id: "Q05_PROGRESSION_RATE",
    part: 1,
    position: 5,
    type: "single_select",
    questionText: "How is your hair loss changing right now?",
    options: [
      { id: "none", text: "I don't have any visible loss yet", scoring: { stage: 0 } },
      { id: "stable", text: "Stable — looks the same as it did a year ago", scoring: { stage: 1 } },
      { id: "slow", text: "Slowly getting worse over the past year", scoring: { stage: 2 } },
      { id: "fast", text: "Visibly worse in just the last 6 months", scoring: { stage: 3 } },
      { id: "rapid", text: "Rapid loss happening right now — clumps in the shower or on the pillow", scoring: { stage: 4 }, flags: ["acute_trigger", "stress_telogen"] },
    ],
  },

  {
    id: "Q06_FH_PATERNAL",
    part: 1,
    position: 6,
    type: "single_select",
    questionText: "How many men on your father's side of the family lost their hair?",
    options: [
      { id: "none", text: "None that I know of", scoring: { stage: 0, hormonal: 0 } },
      { id: "mild", text: "One or two, mild", scoring: { stage: 1, hormonal: 1 } },
      { id: "most", text: "Most of them, by their 40s or 50s", scoring: { stage: 2, hormonal: 2 } },
      { id: "all", text: "All of them, and many started in their 20s or 30s", scoring: { stage: 3, hormonal: 3 } },
    ],
  },

  {
    id: "Q07_FH_MATERNAL",
    part: 1,
    position: 7,
    type: "single_select",
    questionText: "How many people on your mother's side lost their hair?",
    options: [
      { id: "none", text: "None that I know of", scoring: { stage: 0, hormonal: 0 } },
      { id: "mild", text: "One or two, mild", scoring: { stage: 1, hormonal: 1 } },
      { id: "most", text: "Several, especially the men", scoring: { stage: 2, hormonal: 2 } },
      { id: "all", text: "Heavy pattern across the maternal line", scoring: { stage: 3, hormonal: 3 } },
    ],
  },

  {
    id: "Q08_SCALP_VISIBLE",
    part: 1,
    position: 8,
    type: "single_select",
    questionText: "In the thinning areas, what do you see?",
    options: [
      { id: "no_thinning", text: "I don't have thinning areas yet", scoring: { stage: 0, fibrosis: 0, growth_signalling: 0 } },
      { id: "finer", text: "Hair is just shorter and finer there, but still has some hair", scoring: { stage: 0, fibrosis: 0, growth_signalling: 0 } },
      { id: "mixed", text: "Mix of fine baby hairs and bald patches", scoring: { stage: 1, fibrosis: 1, growth_signalling: 1 } },
      { id: "smooth", text: "Mostly smooth, shiny scalp with very few hairs", scoring: { stage: 2, fibrosis: 2, growth_signalling: 2 } },
      { id: "unsure", text: "I haven't looked closely", scoring: { stage: 0, fibrosis: 0, growth_signalling: 0 } },
    ],
  },

  {
    id: "Q09_LOSS_PATTERN",
    part: 1,
    position: 9,
    type: "single_select",
    questionText: "Where on your scalp is the thinning happening?",
    options: [
      { id: "none", text: "I don't have any thinning yet", scoring: { hormonal: 0, inflammatory: 0 } },
      { id: "temples_crown", text: "Mostly at the temples and/or crown — classic pattern", scoring: { hormonal: 3, inflammatory: 0 } },
      { id: "part_line", text: "Mostly along my part line / top of head", scoring: { hormonal: 2, inflammatory: 0 } },
      { id: "diffuse", text: "Diffusely all over, including sides", scoring: { hormonal: 0, inflammatory: 2 }, flags: ["stress_telogen"] },
      { id: "patchy", text: "In patches or specific spots", scoring: { hormonal: 0, inflammatory: 3 }, flags: ["autoimmune"] },
    ],
  },

  // ═══════════════════════════════════════
  // PART 2 — YOUR LIFESTYLE & BODY (Q10–Q19)
  // ═══════════════════════════════════════

  {
    id: "Q10_ANDROGEN_SIGNS",
    part: 2,
    position: 10,
    type: "single_select",
    questionText: "Outside of your scalp, do any of these sound like you?",
    options: [
      { id: "none", text: "None of these", scoring: { hormonal: 0 } },
      { id: "teen_acne", text: "I had bad acne in my teens but it cleared up", scoring: { hormonal: 1 } },
      { id: "active_signs", text: "I still get adult acne, oily skin, and/or strong body hair growth", scoring: { hormonal: 3 } },
      { id: "dry_sparse", text: "My skin is dry, body hair is sparse", scoring: { hormonal: 0 } },
      { id: "unsure", text: "I'm not sure / haven't paid attention", scoring: { hormonal: 0 } },
    ],
  },

  // Q11 — Male variant
  {
    id: "Q11_HORMONAL_M",
    part: 2,
    position: 11,
    type: "single_select",
    questionText: "Have you noticed any of these changes in the past few years?",
    branching: { field: "sex", value: "M" },
    options: [
      { id: "none", text: "None of these", scoring: { hormonal: 0, nutritional: 0 } },
      { id: "low_t_signs", text: "Lower energy, lower drive, harder to build muscle", scoring: { hormonal: 2, nutritional: 0 } },
      { id: "belly_fat", text: "Increased belly fat without diet changes", scoring: { hormonal: 1, nutritional: 1 } },
      { id: "trt", text: "I take testosterone or other hormone therapy", scoring: { hormonal: 3, nutritional: 0 } },
      { id: "pharma", text: "I had a vasectomy / take finasteride or similar", scoring: { hormonal: 0, nutritional: 0 }, flags: ["existing_pharma"] },
    ],
  },

  // Q11 — Female variant
  {
    id: "Q11_HORMONAL_F",
    part: 2,
    position: 11,
    type: "single_select",
    questionText: "Which of these describes your situation?",
    branching: { field: "sex", value: "F" },
    options: [
      { id: "none", text: "None of these", scoring: { hormonal: 0 } },
      { id: "pcos", text: "I have PCOS, irregular cycles, or have been told I have high androgens", scoring: { hormonal: 3 } },
      { id: "post_pregnancy", text: "My hair loss started after pregnancy", scoring: { hormonal: 1 }, flags: ["stress_telogen"] },
      { id: "birth_control", text: "My hair loss started after going off (or onto) birth control", scoring: { hormonal: 3 } },
      { id: "menopause", text: "My hair loss started around perimenopause or menopause", scoring: { hormonal: 3 } },
    ],
  },

  {
    id: "Q12_SLEEP",
    part: 2,
    position: 12,
    type: "single_select",
    questionText: "How would you describe your sleep over the past few months?",
    options: [
      { id: "good", text: "7–9 hours, deep and restorative", scoring: { oxidative: 0, hormonal: 0 } },
      { id: "ok", text: "7–9 hours but I wake up tired", scoring: { oxidative: 1, hormonal: 0 } },
      { id: "short", text: "6–7 hours most nights", scoring: { oxidative: 2, hormonal: 1 } },
      { id: "poor", text: "Less than 6 hours, or I wake multiple times", scoring: { oxidative: 3, hormonal: 2 }, flags: ["stress_telogen"] },
      { id: "shift", text: "Shift work or wildly irregular schedule", scoring: { oxidative: 3, hormonal: 2 } },
    ],
  },

  {
    id: "Q13_STRESS",
    part: 2,
    position: 13,
    type: "single_select",
    questionText: "How would you rate your stress over the past 6 months?",
    options: [
      { id: "calm", text: "Calm — life is steady and manageable", scoring: { inflammatory: 0, hormonal: 0, vascular: 0 } },
      { id: "normal", text: "Normal stress — good days and bad", scoring: { inflammatory: 0, hormonal: 0, vascular: 0 } },
      { id: "elevated", text: "Elevated — I feel it in my body most weeks", scoring: { inflammatory: 1, hormonal: 1, vascular: 1 } },
      { id: "high", text: "High — I'm overwhelmed regularly", scoring: { inflammatory: 1, hormonal: 2, vascular: 1 }, flags: ["stress_telogen"] },
      { id: "acute", text: "I've been through something major in the past year (loss, illness, divorce, job change, surgery)", scoring: { inflammatory: 1, hormonal: 1, vascular: 0 }, flags: ["acute_trigger", "stress_telogen"] },
    ],
  },

  {
    id: "Q14_SMOKING",
    part: 2,
    position: 14,
    type: "single_select",
    questionText: "Do you smoke or vape?",
    options: [
      { id: "never", text: "No, never", scoring: { oxidative: 0, vascular: 0 } },
      { id: "quit_long", text: "I quit more than 2 years ago", scoring: { oxidative: 0, vascular: 0 } },
      { id: "quit_recent", text: "I quit within the last 2 years", scoring: { oxidative: 1, vascular: 1 } },
      { id: "occasional", text: "Occasionally — social, weekends", scoring: { oxidative: 2, vascular: 2 } },
      { id: "daily", text: "Daily", scoring: { oxidative: 3, vascular: 3 } },
    ],
  },

  {
    id: "Q15_SCALP_FEEL",
    part: 2,
    position: 15,
    type: "single_select",
    questionText: "What does your scalp actually feel like day-to-day?",
    options: [
      { id: "normal", text: "Normal — I don't notice it", scoring: { inflammatory: 0, microenvironment: 0 } },
      { id: "itchy", text: "Itchy in places, especially the thinning areas", scoring: { inflammatory: 2, microenvironment: 0 } },
      { id: "tender", text: "Tender, sore, or sensitive when I touch it", scoring: { inflammatory: 3, microenvironment: 0 } },
      { id: "burning", text: "Burning or tingling sensation", scoring: { inflammatory: 3, microenvironment: 0 } },
      { id: "dry", text: "Dry, tight, or flaky", scoring: { inflammatory: 1, microenvironment: 2 } },
    ],
  },

  {
    id: "Q16_SCALP_VISUAL",
    part: 2,
    position: 16,
    type: "single_select",
    questionText: "When you look at your scalp closely, what do you see?",
    options: [
      { id: "normal", text: "Looks normal", scoring: { inflammatory: 0, microenvironment: 0 } },
      { id: "redness", text: "Some redness, especially in the thinning areas", scoring: { inflammatory: 2, microenvironment: 1 } },
      { id: "dandruff", text: "Dandruff, white flakes that come back no matter what shampoo I use", scoring: { inflammatory: 0, microenvironment: 3 } },
      { id: "greasy", text: "Yellow, greasy flakes / scaling", scoring: { inflammatory: 1, microenvironment: 3 } },
      { id: "bumps", text: "Visible bumps, pimples, or ingrown-looking spots", scoring: { inflammatory: 2, microenvironment: 2 } },
    ],
  },

  {
    id: "Q17_WASH_HABITS",
    part: 2,
    position: 17,
    type: "single_select",
    questionText: "How often do you wash your hair, and what do you use?",
    options: [
      { id: "good", text: "3–5 times a week with a gentle/medicated shampoo", scoring: { microenvironment: 0 } },
      { id: "daily_generic", text: "Daily with whatever shampoo is around", scoring: { microenvironment: 2 } },
      { id: "infrequent", text: "Once a week or less", scoring: { microenvironment: 2 } },
      { id: "alt_method", text: "I use 2-in-1, conditioner-only, or \"no-poo\" methods", scoring: { microenvironment: 2 } },
      { id: "harsh", text: "I use clarifying shampoo, sulphates, or strong drugstore brands", scoring: { microenvironment: 2 } },
    ],
  },

  {
    id: "Q18_AUTOIMMUNE",
    part: 2,
    position: 18,
    type: "single_select",
    questionText: "Have you been diagnosed with any of the following?",
    options: [
      { id: "none", text: "None of these", scoring: { inflammatory: 0, nutritional: 0 } },
      { id: "skin", text: "Eczema, psoriasis, or chronic skin conditions", scoring: { inflammatory: 2, nutritional: 0 } },
      { id: "thyroid", text: "Thyroid condition (Hashimoto's, Graves', hypothyroid, hyperthyroid)", scoring: { inflammatory: 3, nutritional: 2 } },
      { id: "autoimmune", text: "An autoimmune condition (lupus, RA, MS, coeliac, IBD, etc.)", scoring: { inflammatory: 3, nutritional: 0 } },
      { id: "allergies", text: "Severe allergies, food intolerances, or chronic gut issues", scoring: { inflammatory: 2, nutritional: 0 } },
    ],
  },

  {
    id: "Q19_RECENT_HEALTH",
    part: 2,
    position: 19,
    type: "single_select",
    questionText: "In the past 12 months, have you experienced any of the following?",
    options: [
      { id: "none", text: "None of these", scoring: { inflammatory: 0, nutritional: 0 } },
      { id: "illness", text: "A serious illness, hospitalisation, or surgery", scoring: { inflammatory: 2, nutritional: 0 }, flags: ["acute_trigger", "stress_telogen"] },
      { id: "medication", text: "Started a new prescription medication", scoring: { inflammatory: 0, nutritional: 0 }, flags: ["stress_telogen"] },
      { id: "weight_loss", text: "Lost more than 5kg / 10lbs unintentionally or through dieting", scoring: { inflammatory: 0, nutritional: 2 }, flags: ["acute_trigger", "stress_telogen"] },
      { id: "infection", text: "A long bout with COVID, flu, or chronic infection", scoring: { inflammatory: 2, nutritional: 0 }, flags: ["stress_telogen"] },
    ],
  },

  // ═══════════════════════════════════════
  // PART 3 — YOUR APPROACH (Q20–Q26)
  // ═══════════════════════════════════════

  {
    id: "Q20_PERIPHERAL_TEMP",
    part: 3,
    position: 20,
    type: "single_select",
    questionText: "How are your hands and feet most of the time?",
    options: [
      { id: "normal", text: "Normal temperature — I rarely think about it", scoring: { vascular: 0 } },
      { id: "sometimes", text: "Sometimes cold, especially in winter", scoring: { vascular: 1 } },
      { id: "often", text: "Often cold, even when others are comfortable", scoring: { vascular: 2 } },
      { id: "always", text: "Always cold — bluish or numb fingers/toes is common", scoring: { vascular: 3 } },
    ],
  },

  {
    id: "Q21_MOVEMENT",
    part: 3,
    position: 21,
    type: "single_select",
    questionText: "How much do you move your body in a typical week?",
    options: [
      { id: "sedentary", text: "I'm sedentary — desk job, no real exercise", scoring: { vascular: 3, oxidative: 0 } },
      { id: "light", text: "Light walking, occasional movement", scoring: { vascular: 2, oxidative: 0 } },
      { id: "moderate", text: "Moderate exercise 3–5x a week (lifting, walking, casual cardio)", scoring: { vascular: 0, oxidative: 0 } },
      { id: "intense", text: "Intense training 5+ days a week", scoring: { vascular: 0, oxidative: 2 } },
      { id: "endurance", text: "Endurance athlete — long cardio sessions multiple times a week", scoring: { vascular: 0, oxidative: 3 } },
    ],
  },

  {
    id: "Q22_DIET_QUALITY",
    part: 3,
    position: 22,
    type: "single_select",
    questionText: "Which best describes how you eat most days?",
    options: [
      { id: "whole_foods", text: "Whole foods, home-cooked, balanced across food groups", scoring: { nutritional: 0, inflammatory: 0 } },
      { id: "mostly_good", text: "Mostly home-cooked but I rely on convenience foods often", scoring: { nutritional: 1, inflammatory: 0 } },
      { id: "mixed", text: "Mixed — some good meals, lots of takeout / processed snacks", scoring: { nutritional: 2, inflammatory: 1 } },
      { id: "poor", text: "Mostly fast food, processed, or skipping meals regularly", scoring: { nutritional: 3, inflammatory: 2 } },
      { id: "restrictive", text: "Restrictive (low-calorie, very low-carb, fasting protocols, eating disorder history)", scoring: { nutritional: 3, inflammatory: 0 } },
    ],
  },

  {
    id: "Q23_FIBROSIS_DIRECT",
    part: 3,
    position: 23,
    type: "single_select",
    questionText: "In your thinning or bald areas, what's the texture like when you touch and look at the skin itself?",
    options: [
      { id: "no_thinning", text: "I don't have any thinning areas yet", scoring: { fibrosis: 0 } },
      { id: "normal", text: "Skin looks and feels normal — same as the rest of my scalp", scoring: { fibrosis: 0 } },
      { id: "smooth", text: "Slightly smoother and shinier than the rest of my scalp", scoring: { fibrosis: 2 } },
      { id: "shiny", text: "Visibly shiny, taut, almost polished-looking", scoring: { fibrosis: 4 } },
      { id: "thin", text: "Skin feels thinner and more fragile, easy to mark", scoring: { fibrosis: 3 } },
    ],
  },

  {
    id: "Q24_GROWTH_SIGNALLING_DIRECT",
    part: 3,
    position: 24,
    type: "single_select",
    questionText: "How does your body generally heal and recover?",
    options: [
      { id: "fast", text: "Cuts and scrapes heal fast, I bounce back from training quickly", scoring: { growth_signalling: 0, vascular: 0, inflammatory: 0 } },
      { id: "normal", text: "Normal healing, occasional slow recovery from harder workouts", scoring: { growth_signalling: 1, vascular: 0, inflammatory: 0 } },
      { id: "slower", text: "Wounds take longer than they used to, recovery from exercise is slower than 5 years ago", scoring: { growth_signalling: 2, vascular: 0, inflammatory: 0 } },
      { id: "slow", text: "Slow healer — bruises last weeks, scars stay red for months", scoring: { growth_signalling: 3, vascular: 1, inflammatory: 0 } },
      { id: "chronic", text: "I have a chronic condition that affects healing (diabetes, autoimmune, on immunosuppressants)", scoring: { growth_signalling: 4, vascular: 0, inflammatory: 1 } },
    ],
  },

  {
    id: "Q25_PHARMA_OPENNESS",
    part: 3,
    position: 25,
    type: "single_select",
    questionText: "Some hair loss treatments work best with prescription medication (like finasteride or minoxidil), some work entirely with natural ingredients, and some combine both. Where do you stand?",
    options: [
      { id: "natural_only", text: "Natural only — I want to avoid prescription medications", scoring: {} },
      { id: "natural_first", text: "Open to natural-first, with prescription as a backup if needed", scoring: {} },
      { id: "hybrid", text: "Comfortable with a hybrid approach — pharma a few days a week, natural the rest", scoring: {} },
      { id: "full_pharma", text: "I want the strongest possible approach — full pharmaceutical protocol with natural support", scoring: {} },
      { id: "existing_pharma", text: "I'm already on finasteride / minoxidil / dutasteride and want to optimise around it", scoring: {}, flags: ["existing_pharma"] },
    ],
  },

  {
    id: "Q26_EMAIL",
    part: 3,
    position: 26,
    type: "email_input",
    questionText: "Your RE5 Hair Phenotype is ready.",
  },
];

export const PART_NAMES: Record<1 | 2 | 3, string> = {
  1: "Your Hair Story",
  2: "Your Lifestyle & Body",
  3: "Your Approach",
};

export const PART_QUESTION_COUNTS: Record<1 | 2 | 3, number> = {
  1: 9,
  2: 10,
  3: 7,
};

export function getQuestionsForSex(sex: "M" | "F"): Question[] {
  return QUESTIONS.filter((q) => {
    if (!q.branching) return true;
    return q.branching.value === sex;
  });
}
