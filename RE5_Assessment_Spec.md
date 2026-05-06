# RE5 Hair Assessment — Build Specification

**Version:** 1.0
**Status:** Locked across all 7 strategy steps
**Target framework:** Next.js / React (single-page interactive assessment + results)
**Project folder:** `re5-website/`
**Brand identity:** RE5 v4 (Apr 2026)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Page Architecture & User Flow](#2-page-architecture--user-flow)
3. [The 26 Questions — Full Specification](#3-the-26-questions--full-specification)
4. [Scoring Engine — Driver Math + Stage Overlay](#4-scoring-engine--driver-math--stage-overlay)
5. [Phenotype Assignment Algorithm](#5-phenotype-assignment-algorithm)
6. [Variant Recommendation Routing](#6-variant-recommendation-routing)
7. [Results Page — Full Copy Library](#7-results-page--full-copy-library)
8. [Graph Specifications](#8-graph-specifications)
9. [Brand Styling — Colors, Typography, Components](#9-brand-styling--colors-typography-components)
10. [Suggested File Structure](#10-suggested-file-structure)
11. [Integrations — Email, Analytics, CRM](#11-integrations--email-analytics-crm)
12. [Pre-Launch Checklist](#12-pre-launch-checklist)

---

## 1. Project Overview

### Purpose
A free, sub-4-minute online assessment that diagnoses a user's hair loss profile across 8 biological drivers, assigns them an RE5 Hair Phenotype, projects their hair trajectory with and without intervention, and routes them to the matching $1 Quick-Start book.

### Primary goals
1. **Trust building** — give every user real, actionable value regardless of whether they purchase
2. **Lead capture** — gated email reveal at the end, list-build for newsletter + funnel
3. **Variant routing** — match each user to one of 6 RE5 protocol variants (Men's/Women's × Natural/Hybrid/Pharma)
4. **Conversion** — $1 Quick-Start book matched to phenotype as the primary CTA

### Non-goals
- Not a medical diagnostic tool. Disclosed throughout.
- Not a sales funnel for branded supplements. RE5 sells the framework.
- Not a one-size-fits-all output. Conditional logic personalises every results page.

### Target completion time
**Sub-4 minutes.** 26 questions, all single-tap or single numeric input, three checkpoints break perceived length.

---

## 2. Page Architecture & User Flow

### Flow diagram (linear with branching)

```
Landing → Q1 (sex gate) → Q2-Q9 (Part 1: Hair Story)
                                 ↓
                      Checkpoint 1
                                 ↓
                      Q10-Q19 (Part 2: Lifestyle & Body)
                                 ↓
                      Checkpoint 2
                                 ↓
                      Q20-Q26 (Part 3: Your Approach)
                                 ↓
                      Q27 (Email gate)
                                 ↓
                      Calculation animation (2-3 sec)
                                 ↓
                      Results page (8 sections, conditional rendering)
                                 ↓
                      CTA → matched $1 Quick-Start (or special-case CTA)
```

### Part split
- **Part 1 — Your Hair Story:** 9 questions (Q1–Q9)
- **Part 2 — Your Lifestyle & Body:** 10 questions (Q10–Q19)
- **Part 3 — Your Approach:** 7 questions (Q20–Q26) + email gate

### Progress indicators (every question screen)
- Top-left small badge: `Part [X] of 3 — [Part Name]`
- Progress bar: fills 0–100% within current part (not overall)
- Above progress bar: small counter `Question [N] of [Part Total]`

### Checkpoint screen template
```
✓ Part [N] complete.

[Personalised summary line]

Coming up — Part [N+1]: [Part Name]  ([estimated time])
[Coming up description]

[ Continue → ]
```

### Landing page (before Q1)
```
RE5 Hair Phenotype Assessment

26 questions. Under 4 minutes. Get your full driver map, projected trajectory, and personalised plan.

Free. No credit card. We'll show you exactly what's driving your hair loss across 8 biological systems — and what to do about it.

[ Start the Assessment → ]

---

What you'll get at the end:
• Your RE5 Hair Phenotype (your specific pattern)
• 8-driver map showing what's firing
• Projected hair trajectory with and without intervention
• Where you sit vs. everyone else who's taken this
• A personalised plan you can start tonight

Less noise. More follicles.
```

---

## 3. The 26 Questions — Full Specification

### Question schema (each question object)
```typescript
interface Question {
  id: string;                    // Q01_SEX, Q02_AGE, etc.
  part: 1 | 2 | 3;
  position: number;              // 1-26
  type: "single_select" | "numeric_input" | "image_select";
  question_text: string;
  options?: Option[];            // for single_select / image_select
  validation?: ValidationRule;   // for numeric_input
  branching?: BranchingRule;     // optional sex-gated branching
  scoring_rules: ScoringRule[];  // how each answer feeds drivers + stage
}

interface Option {
  id: string;
  text: string;
  scoring: { [driver_or_stage: string]: number };
  flag?: string[];  // optional special flags (e.g., "stress_telogen", "autoimmune", "existing_pharma")
}
```

### Driver bucket keys (used in scoring)
- `hormonal`, `inflammatory`, `oxidative`, `vascular`, `nutritional`, `fibrosis`, `growth_signalling`, `microenvironment`
- `stage` (the /20 overlay)
- `flags`: `stress_telogen`, `autoimmune`, `existing_pharma`, `acute_trigger`

### PART 1 — YOUR HAIR STORY (9 questions)

#### Q1 — Sex
- **id:** `Q01_SEX`
- **type:** `single_select`
- **text:** "What's your biological sex?"
- **options:**
  - "Male" → branching gate: `sex = M`
  - "Female" → branching gate: `sex = F`
- **scoring:** routing only

#### Q2 — Age
- **id:** `Q02_AGE`
- **type:** `numeric_input`
- **text:** "How old are you?"
- **validation:** integer 13–99
- **scoring (derived from input value):**
  - Stage points: `<25 → 0; 25-34 → 1; 35-44 → 2; 45-54 → 3; 55+ → 4`
  - Growth Signalling cross-feed: `<40 → 0; 40-49 → 1; 50-59 → 2; 60+ → 3`
- **also stored:** raw age value used for graph plotting

#### Q3 — Visible loss (sex-branched)
- **id:** `Q03_VISIBLE_LOSS_M` (if sex=M) / `Q03_VISIBLE_LOSS_F` (if sex=F)
- **type:** `image_select` (Norwood for men, Ludwig for women)
- **text:** "Which best matches what you see in the mirror right now?"

**Men's options (Norwood):**
| Option | Text | Stage pts |
|---|---|---|
| 1 | No visible loss — I'm here for prevention | 0 |
| 2 | Slight temple recession only (Norwood II) | 1 |
| 3 | Clear temple recession, possibly thinning crown (Norwood III/IV) | 2 |
| 4 | Significant thinning across top, scalp visible in good light (Norwood V) | 3 |
| 5 | Mostly bald on top, hair on sides only (Norwood VI/VII) | 4 |

**Women's options (Ludwig):**
| Option | Text | Stage pts |
|---|---|---|
| 1 | No visible loss — I'm here for prevention | 0 |
| 2 | Wider part line than before, mild thinning at the crown (Ludwig I) | 1 |
| 3 | Clearly visible scalp through the part, noticeable thinning on top (Ludwig II) | 2 |
| 4 | Significant thinning across the top, scalp very visible (Ludwig III) | 3 |
| 5 | Diffuse thinning everywhere including sides | 2 + flag: `stress_telogen` |

**Asset requirement:** commission/source open-license Norwood + Ludwig line illustrations.

#### Q4 — Years since onset
- **id:** `Q04_ONSET_YEARS`
- **type:** `single_select`
- **text:** "When did you first notice you were losing hair?"
- **options:**
  | Text | Stage pts | Fibrosis |
  |---|---|---|
  | I haven't yet — just being proactive | 0 | 0 |
  | Within the last year | 1 | 0 |
  | 1–3 years ago | 2 | 0 |
  | 3–7 years ago | 3 | +2 |
  | More than 7 years ago | 4 | +3 |

#### Q5 — Rate of progression
- **id:** `Q05_PROGRESSION_RATE`
- **type:** `single_select`
- **text:** "How is your hair loss changing right now?"
- **options:**
  | Text | Stage pts | Flags |
  |---|---|---|
  | I don't have any visible loss yet | 0 | — |
  | Stable — looks the same as it did a year ago | 1 | — |
  | Slowly getting worse over the past year | 2 | — |
  | Visibly worse in just the last 6 months | 3 | — |
  | Rapid loss happening right now — clumps in the shower or on the pillow | 4 | `acute_trigger`, `stress_telogen` |

#### Q6 — Family history (paternal)
- **id:** `Q06_FH_PATERNAL`
- **type:** `single_select`
- **text:** "How many men on your father's side of the family lost their hair?"
- **options:**
  | Text | Stage pts | Hormonal |
  |---|---|---|
  | None that I know of | 0 | 0 |
  | One or two, mild | 1 | +1 |
  | Most of them, by their 40s or 50s | 2 | +2 |
  | All of them, and many started in their 20s or 30s | 3 | +3 |

#### Q7 — Family history (maternal)
- **id:** `Q07_FH_MATERNAL`
- **type:** `single_select`
- **text:** "How many people on your mother's side lost their hair?"
- **options:**
  | Text | Stage pts | Hormonal |
  |---|---|---|
  | None that I know of | 0 | 0 |
  | One or two, mild | 1 | +1 |
  | Several, especially the men | 2 | +2 |
  | Heavy pattern across the maternal line | 3 | +3 |

**Combined Q6+Q7 stage cap:** 4 points total (avoid double-counting). They feed Hormonal driver independently.

#### Q8 — Visible scalp in thinning areas
- **id:** `Q08_SCALP_VISIBLE`
- **type:** `single_select`
- **text:** "In the thinning areas, what do you see?"
- **options:**
  | Text | Stage tiebreak | Fibrosis | Growth Signalling |
  |---|---|---|---|
  | I don't have thinning areas yet | 0 | 0 | 0 |
  | Hair is just shorter and finer there, but still has some hair | 0 | 0 | 0 |
  | Mix of fine baby hairs and bald patches | 1 | +1 | +1 |
  | Mostly smooth, shiny scalp with very few hairs | 2 | +2 | +2 |
  | I haven't looked closely | 0 | 0 | 0 |

#### Q9 — Pattern of loss
- **id:** `Q09_LOSS_PATTERN`
- **type:** `single_select`
- **text:** "Where on your scalp is the thinning happening?"
- **options:**
  | Text | Hormonal | Inflammatory | Flags |
  |---|---|---|---|
  | I don't have any thinning yet | 0 | 0 | — |
  | Mostly at the temples and/or crown — classic pattern | +3 | 0 | — |
  | Mostly along my part line / top of head | +2 | 0 | — |
  | Diffusely all over, including sides | 0 | +2 | `stress_telogen` |
  | In patches or specific spots | 0 | +3 | `autoimmune` |

### CHECKPOINT 1
```
✓ Part 1 complete.

We now have your stage, your family pattern, and what's actually happening in the mirror. The heaviest detection from here is lifestyle and body inputs.

Coming up — Part 2: Your Lifestyle & Body  (about 2 minutes)
The daily inputs driving your follicles: sleep, diet, stress, scalp symptoms, and hormonal signals only your body knows about.

[ Continue → ]
```

### PART 2 — YOUR LIFESTYLE & BODY (10 questions)

#### Q10 — Body hair and skin
- **id:** `Q10_ANDROGEN_SIGNS`
- **type:** `single_select`
- **text:** "Outside of your scalp, do any of these sound like you?"
- **options:**
  | Text | Hormonal |
  |---|---|
  | None of these | 0 |
  | I had bad acne in my teens but it cleared up | +1 |
  | I still get adult acne, oily skin, and/or strong body hair growth | +3 |
  | My skin is dry, body hair is sparse | 0 |
  | I'm not sure / haven't paid attention | 0 |

#### Q11 — Hormonal (sex-branched)
- **id:** `Q11_HORMONAL_M` (if sex=M) / `Q11_HORMONAL_F` (if sex=F)
- **type:** `single_select`

**Men's version:**
- **text:** "Have you noticed any of these changes in the past few years?"
- **options:**
  | Text | Hormonal | Nutritional | Flags |
  |---|---|---|---|
  | None of these | 0 | 0 | — |
  | Lower energy, lower drive, harder to build muscle | +2 | 0 | — |
  | Increased belly fat without diet changes | +1 | +1 | — |
  | I take testosterone or other hormone therapy | +3 | 0 | — |
  | I had a vasectomy / take finasteride or similar | 0 | 0 | `existing_pharma` |

**Women's version:**
- **text:** "Which of these describes your situation?"
- **options:**
  | Text | Hormonal | Flags |
  |---|---|---|
  | None of these | 0 | — |
  | I have PCOS, irregular cycles, or have been told I have high androgens | +3 | — |
  | My hair loss started after pregnancy | +1 | `stress_telogen` |
  | My hair loss started after going off (or onto) birth control | +3 | — |
  | My hair loss started around perimenopause or menopause | +3 | — |

#### Q12 — Sleep
- **id:** `Q12_SLEEP`
- **type:** `single_select`
- **text:** "How would you describe your sleep over the past few months?"
- **options:**
  | Text | Oxidative | Hormonal | Flags |
  |---|---|---|---|
  | 7–9 hours, deep and restorative | 0 | 0 | — |
  | 7–9 hours but I wake up tired | +1 | 0 | — |
  | 6–7 hours most nights | +2 | +1 | — |
  | Less than 6 hours, or I wake multiple times | +3 | +2 | `stress_telogen` |
  | Shift work or wildly irregular schedule | +3 | +2 | — |

#### Q13 — Stress
- **id:** `Q13_STRESS`
- **type:** `single_select`
- **text:** "How would you rate your stress over the past 6 months?"
- **options:**
  | Text | Inflammatory | Hormonal | Vascular | Flags |
  |---|---|---|---|---|
  | Calm — life is steady and manageable | 0 | 0 | 0 | — |
  | Normal stress — good days and bad | 0 | 0 | 0 | — |
  | Elevated — I feel it in my body most weeks | +1 | +1 | +1 | — |
  | High — I'm overwhelmed regularly | +1 | +2 | +1 | `stress_telogen` |
  | I've been through something major in the past year (loss, illness, divorce, job change, surgery) | +1 | +1 | 0 | `acute_trigger`, `stress_telogen` |

#### Q14 — Smoking
- **id:** `Q14_SMOKING`
- **type:** `single_select`
- **text:** "Do you smoke or vape?"
- **options:**
  | Text | Oxidative | Vascular |
  |---|---|---|
  | No, never | 0 | 0 |
  | I quit more than 2 years ago | 0 | 0 |
  | I quit within the last 2 years | +1 | +1 |
  | Occasionally — social, weekends | +2 | +2 |
  | Daily | +3 | +3 |

#### Q15 — Scalp sensation
- **id:** `Q15_SCALP_FEEL`
- **type:** `single_select`
- **text:** "What does your scalp actually feel like day-to-day?"
- **options:**
  | Text | Inflammatory | Microenvironment |
  |---|---|---|
  | Normal — I don't notice it | 0 | 0 |
  | Itchy in places, especially the thinning areas | +2 | 0 |
  | Tender, sore, or sensitive when I touch it | +3 | 0 |
  | Burning or tingling sensation | +3 | 0 |
  | Dry, tight, or flaky | +1 | +2 |

#### Q16 — Visible scalp condition
- **id:** `Q16_SCALP_VISUAL`
- **type:** `single_select`
- **text:** "When you look at your scalp closely, what do you see?"
- **options:**
  | Text | Inflammatory | Microenvironment |
  |---|---|---|
  | Looks normal | 0 | 0 |
  | Some redness, especially in the thinning areas | +2 | +1 |
  | Dandruff, white flakes that come back no matter what shampoo I use | 0 | +3 |
  | Yellow, greasy flakes / scaling | +1 | +3 |
  | Visible bumps, pimples, or ingrown-looking spots | +2 | +2 |

#### Q17 — Shampoo & wash habits
- **id:** `Q17_WASH_HABITS`
- **type:** `single_select`
- **text:** "How often do you wash your hair, and what do you use?"
- **options:**
  | Text | Microenvironment |
  |---|---|
  | 3–5 times a week with a gentle/medicated shampoo | 0 |
  | Daily with whatever shampoo is around | +2 |
  | Once a week or less | +2 |
  | I use 2-in-1, conditioner-only, or "no-poo" methods | +2 |
  | I use clarifying shampoo, sulphates, or strong drugstore brands | +2 |

#### Q18 — Autoimmune & skin conditions
- **id:** `Q18_AUTOIMMUNE`
- **type:** `single_select`
- **text:** "Have you been diagnosed with any of the following?"
- **options:**
  | Text | Inflammatory | Nutritional |
  |---|---|---|
  | None of these | 0 | 0 |
  | Eczema, psoriasis, or chronic skin conditions | +2 | 0 |
  | Thyroid condition (Hashimoto's, Graves', hypothyroid, hyperthyroid) | +3 | +2 |
  | An autoimmune condition (lupus, RA, MS, coeliac, IBD, etc.) | +3 | 0 |
  | Severe allergies, food intolerances, or chronic gut issues | +2 | 0 |

#### Q19 — Recent illness or medication
- **id:** `Q19_RECENT_HEALTH`
- **type:** `single_select`
- **text:** "In the past 12 months, have you experienced any of the following?"
- **options:**
  | Text | Inflammatory | Nutritional | Flags |
  |---|---|---|---|
  | None of these | 0 | 0 | — |
  | A serious illness, hospitalisation, or surgery | +2 | 0 | `acute_trigger`, `stress_telogen` |
  | Started a new prescription medication | 0 | 0 | `stress_telogen` |
  | Lost more than 5kg / 10lbs unintentionally or through dieting | 0 | +2 | `acute_trigger`, `stress_telogen` |
  | A long bout with COVID, flu, or chronic infection | +2 | 0 | `stress_telogen` |

### CHECKPOINT 2
```
✓ Part 2 complete.

We've mapped your inflammatory, oxidative, hormonal, and scalp-environment drivers — the daily inputs shaping your follicle health.

Coming up — Part 3: Your Approach  (about 1 minute, almost done)
A few final questions about your circulation, structure, and what kind of solution actually fits you.

[ Continue → ]
```

### PART 3 — YOUR APPROACH (7 questions + email gate)

#### Q20 — Hand and foot temperature
- **id:** `Q20_PERIPHERAL_TEMP`
- **type:** `single_select`
- **text:** "How are your hands and feet most of the time?"
- **options:**
  | Text | Vascular |
  |---|---|
  | Normal temperature — I rarely think about it | 0 |
  | Sometimes cold, especially in winter | +1 |
  | Often cold, even when others are comfortable | +2 |
  | Always cold — bluish or numb fingers/toes is common | +3 |

#### Q21 — Movement & cardiovascular activity
- **id:** `Q21_MOVEMENT`
- **type:** `single_select`
- **text:** "How much do you move your body in a typical week?"
- **options:**
  | Text | Vascular | Oxidative |
  |---|---|---|
  | I'm sedentary — desk job, no real exercise | +3 | 0 |
  | Light walking, occasional movement | +2 | 0 |
  | Moderate exercise 3–5x a week (lifting, walking, casual cardio) | 0 | 0 |
  | Intense training 5+ days a week | 0 | +2 |
  | Endurance athlete — long cardio sessions multiple times a week | 0 | +3 |

#### Q22 — Diet quality
- **id:** `Q22_DIET_QUALITY`
- **type:** `single_select`
- **text:** "Which best describes how you eat most days?"
- **options:**
  | Text | Nutritional | Inflammatory |
  |---|---|---|
  | Whole foods, home-cooked, balanced across food groups | 0 | 0 |
  | Mostly home-cooked but I rely on convenience foods often | +1 | 0 |
  | Mixed — some good meals, lots of takeout / processed snacks | +2 | +1 |
  | Mostly fast food, processed, or skipping meals regularly | +3 | +2 |
  | Restrictive (low-calorie, very low-carb, fasting protocols, eating disorder history) | +3 | 0 |

#### Q23 — Scalp shine and texture
- **id:** `Q23_FIBROSIS_DIRECT`
- **type:** `single_select`
- **text:** "In your thinning or bald areas, what's the texture like when you touch and look at the skin itself?"
- **options:**
  | Text | Fibrosis |
  |---|---|
  | I don't have any thinning areas yet | 0 |
  | Skin looks and feels normal — same as the rest of my scalp | 0 |
  | Slightly smoother and shinier than the rest of my scalp | +2 |
  | Visibly shiny, taut, almost polished-looking | +4 |
  | Skin feels thinner and more fragile, easy to mark | +3 |

#### Q24 — Regenerative capacity
- **id:** `Q24_GROWTH_SIGNALLING_DIRECT`
- **type:** `single_select`
- **text:** "How does your body generally heal and recover?"
- **options:**
  | Text | Growth Signalling | Vascular | Inflammatory |
  |---|---|---|---|
  | Cuts and scrapes heal fast, I bounce back from training quickly | 0 | 0 | 0 |
  | Normal healing, occasional slow recovery from harder workouts | +1 | 0 | 0 |
  | Wounds take longer than they used to, recovery from exercise is slower than 5 years ago | +2 | 0 | 0 |
  | Slow healer — bruises last weeks, scars stay red for months | +3 | +1 | 0 |
  | I have a chronic condition that affects healing (diabetes, autoimmune, on immunosuppressants) | +4 | 0 | +1 |

#### Q25 — Pharma openness
- **id:** `Q25_PHARMA_OPENNESS`
- **type:** `single_select`
- **text:** "Some hair loss treatments work best with prescription medication (like finasteride or minoxidil), some work entirely with natural ingredients, and some combine both. Where do you stand?"
- **options:**
  | Text | Variant route | Flag |
  |---|---|---|
  | Natural only — I want to avoid prescription medications | Natural | — |
  | Open to natural-first, with prescription as a backup if needed | Natural (with Hybrid as upgrade path) | — |
  | Comfortable with a hybrid approach — pharma a few days a week, natural the rest | Hybrid | — |
  | I want the strongest possible approach — full pharmaceutical protocol with natural support | Pharma | — |
  | I'm already on finasteride / minoxidil / dutasteride and want to optimise around it | Pharma — Optimisation Track | `existing_pharma` |
- **scoring:** routing only, no driver impact

#### Q26 — Email gate (treated as final question for completion stats)
- **id:** `Q26_EMAIL`
- **type:** `email_input`
- **screen:**
  ```
  Your RE5 Hair Phenotype is ready.

  We've analysed your responses across 8 biological drivers. Your phenotype, driver map, projected hair trajectory, and personalised plan are one click away.

  Enter your email to see your results — and we'll send you the science-backed plan that matches your phenotype, free.

  [____________________ Email address ]

  ☐ Yes, send me the RE5 newsletter — protocols, science, and case studies. Unsubscribe anytime.

  [ Show My Results → ]

  We never sell your data. No spam. No fake before-and-afters.
  ```
- **validation:** valid email format
- **newsletter checkbox:** opt-in, NOT pre-checked
- **on submit:** save to CRM, trigger calculation animation, render results page

### Calculation animation
- 2–3 second screen between Q26 submit and results render
- 8 driver icons light up sequentially (one per ~250ms)
- "Phenotype identified" text fades in at the end
- Then transition to results page

---

## 4. Scoring Engine — Driver Math + Stage Overlay

### Internal vs display

Drivers are scored **0–10 internally**, displayed as **1–5** on results cards.

**Conversion formula:**
```
display_score = ceil(internal_score / 2)
display_score = max(1, min(5, display_score))
```

| Internal | Display | Severity Label |
|---|---|---|
| 0–1 | 1 | Minimal |
| 2–3 | 2 | Mild |
| 4–5 | 3 | Moderate |
| 6–7 | 4 | Elevated |
| 8–10 | 5 | Critical |

### Headline score formula

```
total_internal_drivers = sum(min(driver_score, 10) for each of 8 drivers)
// internal max = 80

stage_total = min(sum(stage_points), 20)
// internal max = 20

headline_score = total_internal_drivers + stage_total
// max = 100
```

### Driver caps
Each driver caps at 10 internal points. If question scoring would push it above 10, cap at 10.

### Stage cap rules
- Q6 + Q7 combined cap at 4 stage points (avoid double-counting family history)
- Total stage caps at 20

### Score band → Color coding (for headline display)
| Score | Band | Color (RE5 palette) |
|---|---|---|
| 0–20 | Minimal Pressure | Deep teal #2F5F6B |
| 21–40 | Mild Pressure | Light teal #5A8B95 |
| 41–60 | Moderate Pressure | Stone #8A8578 |
| 61–80 | High Pressure | Saffron #E8893D |
| 81–100 | Severe Pressure | Carbon ink #1A1A1A |

---

## 5. Phenotype Assignment Algorithm

### Algorithm steps (in order)

```
function assignPhenotype(answers):

  // 1. Calculate raw inputs
  driver_scores = calculateDriverScores(answers)  // dict of 8 drivers, 0-10 each
  stage_score = calculateStageScore(answers)       // 0-20
  flags = collectFlags(answers)                    // set of strings
  sex = answers.Q01_SEX
  pharma_openness = answers.Q25_PHARMA_OPENNESS
  pattern_signal = derivePatternSignal(answers.Q09_LOSS_PATTERN)

  // 2. Determine Stage label
  if stage_score <= 7:    stage = "Early"
  elif stage_score <= 14: stage = "Mid"
  else:                   stage = "Late"

  // 3. Check special override phenotypes (priority routing)

  // Override 1: Autoimmune (highest priority)
  if pattern_signal == "autoimmune":
    return {
      phenotype: "Autoimmune-Suspected",
      stage: null,
      special_case: "autoimmune",
      variant: null  // no variant — derm referral
    }

  // Override 2: Stress-Telogen
  acute_trigger_count = count(flags where flag in ["acute_trigger", "stress_telogen"])
  if acute_trigger_count >= 2:
    return {
      phenotype: "Stress-Telogen, " + stage + " Stage",
      stage: stage,
      special_case: "stress_telogen",
      variant: null  // no variant — telogen recovery guide
    }

  // Override 3: Low-Pressure Protective
  if max(driver_scores.values) < 4 AND stage_score < 8:
    return {
      phenotype: "Low-Pressure Protective Profile",
      stage: "Early",
      special_case: "low_pressure",
      variant: null  // no variant — free foundation guide
    }

  // 4. Standard phenotype assignment

  // Tie-breaker priority order
  PRIORITY = ["hormonal", "inflammatory", "vascular", "nutritional",
              "oxidative", "microenvironment", "fibrosis", "growth_signalling"]

  // Sort drivers by score DESC, then by priority (lower index = higher priority)
  sorted_drivers = sort(driver_scores, key=lambda x: (-x.score, PRIORITY.index(x.name)))

  primary = sorted_drivers[0]
  secondary = sorted_drivers[1]

  // Multi-driver cascade check
  high_drivers_count = count(d for d in driver_scores if d.score >= 7)
  if high_drivers_count >= 3:
    pattern = "Multi-Driver Cascade"
  // Overlay check
  elif secondary.score >= 6 AND secondary.score >= (primary.score * 0.7):
    pattern = patternName(primary.name) + " with " + overlayName(secondary.name) + " Overlay"
  else:
    pattern = patternName(primary.name)

  phenotype_full = pattern + ", " + stage + " Stage"

  // 5. Variant recommendation
  variant = recommendVariant(sex, pharma_openness, flags)

  return {
    phenotype: phenotype_full,
    stage: stage,
    primary_driver: primary.name,
    secondary_driver: secondary.name if has_overlay else null,
    special_case: null,
    variant: variant,
    score: total_internal_drivers + stage_total
  }
```

### Driver-to-pattern name mapping

| Driver | Pattern name | Overlay name |
|---|---|---|
| hormonal | Androgen-Dominant | Hormonal |
| inflammatory | Inflammation-Led | Inflammation |
| oxidative | Oxidative-Stressed | Oxidative |
| vascular | Vascular-Compromised | Vascular |
| nutritional | Nutritionally-Depleted | Nutritional |
| fibrosis | Fibrosis-Established | Fibrosis |
| growth_signalling | Regeneration-Compromised | Regenerative |
| microenvironment | Scalp-Disrupted | Microenvironment |

### Overlay verb mapping (used in overlay paragraph)

| Overlay driver | Verb |
|---|---|
| inflammatory | calmed |
| nutritional | restored |
| hormonal | managed |
| microenvironment | rebalanced |
| vascular | restored |
| oxidative | reduced |
| fibrosis | softened |
| growth_signalling | reactivated |

---

## 6. Variant Recommendation Routing

```
function recommendVariant(sex, pharma_openness, flags):

  sex_prefix = "Men's" if sex == "M" else "Women's"

  if "existing_pharma" in flags:
    return sex_prefix + " Pharma — Optimisation Track"

  if pharma_openness in [1, 2]:
    return sex_prefix + " Natural"

  if pharma_openness == 3:
    return sex_prefix + " Hybrid"

  if pharma_openness == 4:
    return sex_prefix + " Pharma"

  // pharma_openness == 5 (existing pharma) handled above
```

**Six standard variants:**
- Men's Natural / Hybrid / Pharma
- Women's Natural / Hybrid / Pharma

**Plus two special routes:**
- `[sex] Pharma — Optimisation Track` (for existing pharma users)
- `null` (for autoimmune / stress-telogen / low-pressure phenotypes — no variant CTA)

---

## 7. Results Page — Full Copy Library

### Section structure (8 sections, in order)

1. Headline Score
2. Driver Cards (8 cards)
3. Phenotype paragraph
4. Loss Curve graph
5. Percentile Distribution graph
6. Concept Solutions (conditional, ≥3/5 driver threshold)
7. General Plan (6 universal items, conditionally ordered)
8. CTA (variant-matched)

### SECTION 1 — Headline Score

**Layout:**
```
Your RE5 Hair Loss Risk Score

[X] / 100

[Interpretation line — based on score band]
```

**Score band copy:**

| Score | Band | Interpretation line |
|---|---|---|
| 0–20 | **Minimal Pressure** | Your follicles are under genuinely low biological pressure. You have more runway than most — focus on staying ahead. |
| 21–40 | **Mild Pressure** | A few drivers are starting to fire, but nothing is dominant yet. This is the easiest stage to reverse. |
| 41–60 | **Moderate Pressure** | Multiple drivers are active. Without intervention, you're on the projected loss curve. With intervention, this is recoverable. |
| 61–80 | **High Pressure** | Significant biological pressure across multiple drivers. The window for prevention is closing — but the window for active intervention is wide open. |
| 81–100 | **Severe Pressure** | Aggressive driver activation across most systems. Honest framing: full reversal is unlikely, but meaningful retention and partial regrowth is realistic with the right protocol. |

### Transition §1 → §2
> Your score is the sum of eight underlying biological drivers. Here's how each is firing.

### SECTION 2 — Driver Cards

**Card layout (one per driver, 8 total):**
```
[Driver Name]                [X] / 5  [Severity Label]

[Description sentence (universal, fixed per driver)]

[Conditional second sentence based on display score]
```

#### Driver 1 — Hormonal / Androgen Driver

**Description:** Your follicles' sensitivity to DHT — the hormone that miniaturises hair over time. This includes genetic loading from family history, current androgen exposure, and lifecycle hormone shifts.

**Conditional second sentence:**
| Score | Sentence |
|---|---|
| Mild | Right now this isn't your primary driver — your genetic and hormonal context is relatively favourable. |
| Moderate | This driver is active and worth managing. Alone it won't cause major loss, but combined with other firing drivers it accelerates. |
| Elevated | This is a strong driver in your profile. Most of the actual miniaturisation in your hair is being signalled here. |
| Critical | This is firing hard. Hormonal management — natural, hybrid, or pharmaceutical — is the highest-leverage move you can make. |

#### Driver 2 — Inflammatory / Immune Driver

**Description:** Hidden inflammation around your follicles — itching, tenderness, redness, or systemic immune activity that quietly damages hair-producing cells. Often unnoticed until it's checked for.

**Conditional second sentence:**
| Score | Sentence |
|---|---|
| Mild | Your inflammatory baseline is low. Maintain it — chronic inflammation is one of the easiest drivers to let creep up unnoticed. |
| Moderate | Some inflammatory signal is present. Worth addressing now while it's still subclinical, before it starts visibly affecting follicle function. |
| Elevated | Your scalp and/or system is inflamed. This driver is doing real damage to follicle output independent of any hormonal pattern. |
| Critical | Heavy inflammatory load. This needs to be calmed before any other intervention will work efficiently — inflamed follicles don't respond well to growth signals. |

#### Driver 3 — Oxidative / Mitochondrial Driver

**Description:** Cellular damage from free radicals — driven by smoking, alcohol, poor sleep, chronic stress, or excessive training without recovery. Your follicle cells need clean energy to produce healthy hair.

**Conditional second sentence:**
| Score | Sentence |
|---|---|
| Mild | Your oxidative load is manageable. The lifestyle inputs that drive this are mostly working in your favour. |
| Moderate | Lifestyle factors are starting to add up. The follicle is one of the most metabolically active tissues in the body — it shows oxidative damage early. |
| Elevated | Your daily inputs are loading the system with oxidative stress faster than your body can clear it. Mitochondrial damage in the dermal papilla compounds quickly. |
| Critical | Severe oxidative load. The lifestyle pattern driving this is also damaging tissues you can't see yet — addressing it pays back across far more than just hair. |

#### Driver 4 — Vascular / Circulation Driver

**Description:** The blood supply reaching your scalp. Without good microcirculation, follicles can't get the nutrients, hormones, or oxygen they need — even if everything else is in order.

**Conditional second sentence:**
| Score | Sentence |
|---|---|
| Mild | Your circulation is supporting follicle delivery well. Movement and scalp work will keep it that way. |
| Moderate | Microcirculation is moderately compromised. Your follicles are getting fewer nutrients than they should — fixable with movement and scalp manipulation. |
| Elevated | Significant perfusion deficit. Even perfect nutrition and hormones won't reach follicles efficiently until circulation improves. |
| Critical | Severe vascular compromise. The scalp is starved — restoring circulation is upstream of every other intervention working. |

#### Driver 5 — Nutritional / Metabolic Driver

**Description:** The raw materials your follicles need to build hair: protein, iron, zinc, vitamin D, B vitamins. Hair is the first thing your body deprioritises when supply is short.

**Conditional second sentence:**
| Score | Sentence |
|---|---|
| Mild | Your nutritional foundation is solid. Follicles have what they need to operate. |
| Moderate | Some gaps in the nutritional floor. Worth getting blood work to identify exactly which nutrients are short — supplementing blind is rarely effective. |
| Elevated | Your follicles are building hair on a depleted foundation. This is the cheapest driver to fix — bloods first, then targeted intervention. |
| Critical | Significant deficiency pattern. Until the foundation is rebuilt, no other protocol will produce its full effect. Get full bloods before doing anything else. |

#### Driver 6 — Fibrosis / Structural Driver

**Description:** The physical hardening of scalp tissue around follicles over time — collagen tightening, sebaceous gland atrophy, shiny skin. Once established, it traps follicles and resists regrowth.

**Conditional second sentence:**
| Score | Sentence |
|---|---|
| Mild | Minimal structural changes. You're well within the window where prevention is straightforward. |
| Moderate | Early structural changes are beginning. This is the stage where consistent scalp work has the most impact — once fibrosis establishes, it's significantly harder to reverse. |
| Elevated | Established perifollicular fibrosis. Reactivation is possible but requires sustained mechanical and biochemical intervention — there's no fast path through this. |
| Critical | Significant fibrosis is locked in. Honest framing: fully smooth, shiny scalp areas have largely lost the follicle real estate. Surrounding areas are still defendable and partially reactivatable. |

#### Driver 7 — Growth Signalling / Stem Cell Driver

**Description:** Your follicles' regenerative capacity — the molecular signals that wake dormant follicles and produce new hair. Declines naturally with age, faster with chronic stress to the hair cycle.

**Conditional second sentence:**
| Score | Sentence |
|---|---|
| Mild | Strong regenerative capacity. Your follicles still respond well to growth signals — this is your biggest asset. |
| Moderate | Regenerative capacity is reduced but functional. Still very responsive to the right stimulation if applied consistently. |
| Elevated | Significantly reduced regenerative signalling. Reactivation requires more aggressive and sustained input — the biology is slower to respond than it was 10 years ago. |
| Critical | Heavily compromised growth signalling. Realistic expectation is partial reactivation of dormant follicles, not full restoration. The protocol shifts toward retention as the primary goal. |

#### Driver 8 — Scalp Microenvironment Driver

**Description:** The ecosystem on your scalp surface: sebum balance, microbiome (the yeast and bacteria that live there), pH, and product residue. Disruption here drives flaking, itching, and chronic low-grade follicle stress.

**Conditional second sentence:**
| Score | Sentence |
|---|---|
| Mild | Your scalp surface is in good balance. Maintain with the right shampoo cadence and you won't have to think about this driver. |
| Moderate | Some microenvironment disruption — likely dandruff, oiliness imbalance, or product residue building up. Cheap and fast to correct. |
| Elevated | Significant scalp surface disruption. This is creating a chronic low-grade inflammatory load that compounds with every other driver. The shampoo and scalp routine matter as much as the actives you put on top. |
| Critical | Severe microenvironment imbalance — likely active seborrhoeic dermatitis or persistent fungal overgrowth. This needs to be resolved at the surface before any follicle-level protocol can work properly. |

### Transition §2 → §3
> These driver patterns combine into a recognisable type. Yours is below.

### SECTION 3 — Phenotype paragraph

**Layout:**
```
Your RE5 Phenotype

[Pattern Name], [Stage] Stage

[Pattern paragraph — 3 sentences]

[Optional overlay paragraph — if secondary driver qualifies]

[Stage modifier paragraph — 2 sentences]

Below is what your follicle trajectory looks like from here — with and without intervention.
```

#### Pattern paragraphs

**Androgen-Dominant:**
> Your hair loss is being driven primarily by hormonal sensitivity at the follicle. DHT — the metabolite of testosterone produced by 5-alpha reductase — is binding to androgen receptors in your scalp follicles and signalling them to miniaturise over each successive growth cycle. This is the most common pattern globally, and the one with the most established intervention pathways across natural, hybrid, and pharmaceutical routes.

**Inflammation-Led:**
> Your hair loss is being driven primarily by chronic perifollicular inflammation. Inflammatory cytokines around the follicle damage hair-producing cells, disrupt the growth cycle, and contribute to early miniaturisation independent of hormonal patterns. Inflammation-led loss is often missed because it doesn't always cause visible itching or redness — but addressed properly, it's one of the most reversible patterns.

**Oxidative-Stressed:**
> Your hair loss is being driven primarily by oxidative damage to the cellular machinery inside follicle cells. Free radicals from smoking, chronic stress, sleep debt, alcohol, or excessive training overwhelm your antioxidant defences and damage the mitochondria your follicles depend on for energy. Hair is one of the most metabolically demanding tissues in the body, which is why it shows oxidative stress earlier than most other systems.

**Vascular-Compromised:**
> Your hair loss is being driven primarily by reduced microcirculation to the scalp. Without consistent blood flow, follicles can't access the nutrients, hormones, and oxygen they need — even when the supply elsewhere in your system is adequate. The scalp is peripheral tissue, which is why circulation issues often show in your hair before they show anywhere else you'd notice.

**Nutritionally-Depleted:**
> Your hair loss is being driven primarily by inadequate nutritional building blocks for follicle function. Hair is built from protein, sustained by iron, zinc, vitamin D, and B vitamins, and the body deprioritises hair production whenever supply is short. This is the cheapest driver to address — but blindly supplementing without knowing your specific deficiencies wastes time and rarely works.

**Fibrosis-Established:**
> Your hair loss is now being driven primarily by structural changes in the scalp tissue itself. Years of inflammation and follicle stress have caused collagen tightening around the follicle and atrophy of the supporting structures, creating a physical environment that traps follicles and resists regrowth. This pattern is harder to reverse than the upstream drivers — but defending the surrounding follicles and partially reactivating dormant ones is realistic.

**Regeneration-Compromised:**
> Your hair loss is being driven primarily by reduced regenerative signalling — the molecular pathways that wake dormant follicles and produce new hair are running quietly. This is partly age-related (regenerative capacity declines naturally) and partly the consequence of long-term stress on the hair cycle. Reactivation is possible but slower than at younger ages, and the protocol focus shifts toward consistent stimulation over months, not weeks.

**Multi-Driver Cascade:**
> Your hair loss isn't being driven by one dominant pattern — it's being driven by several drivers firing simultaneously, each amplifying the others. Multi-driver cascades are biologically more aggressive than single-driver patterns and respond poorly to single-target interventions like a shampoo or one supplement. The protocol path here is full-system: addressing each firing driver in parallel, because fixing one while ignoring the others doesn't move the outcome.

#### Overlay paragraph (conditional, if secondary driver qualifies)

Template:
> Layered on top of this, your [secondary driver name] is also firing significantly. This means the protocol needs to address both — your primary pattern won't fully respond until the [secondary driver name in lowercase] driver is also [verb from overlay verb mapping].

#### Stage modifier paragraphs

**Early Stage:**
> You're catching this in the prevention window. Drivers are firing but visible loss is minimal or absent — meaning the protocol can focus on stopping miniaturisation before it accelerates, rather than trying to recover what's already been lost.

**Mid Stage:**
> You're in the active intervention window. Visible loss is in progress, but enough functional follicles remain that the protocol can both halt further loss and produce meaningful regrowth. This is the stage where intervention pays back the most across both retention and reactivation.

**Late Stage:**
> You're past the prevention window. Significant loss is established and structural changes have set in, which means the protocol shifts focus: defending the follicles you still have, partially reactivating dormant ones, and managing the realistic ceiling on what's recoverable. Honest framing matters here — full restoration is unlikely, meaningful retention and partial regrowth is realistic.

### SPECIAL-CASE PHENOTYPES (override Section 3)

#### Stress-Telogen
> Your hair loss pattern points to acute telogen effluvium — a stress-triggered shedding event, not the gradual miniaturisation of androgenetic loss. Recent illness, major life events, rapid weight changes, new medications, or post-pregnancy hormonal shifts can push large numbers of follicles into the resting phase simultaneously, with shedding becoming visible 2 to 4 months after the trigger. This is mechanistically different from genetic hair loss — and importantly, it's often substantially recoverable once the trigger is identified and addressed.
>
> The protocol path here is different from a standard RE5 variant. The first job is identifying and resolving the underlying trigger — stress, deficiency, medication, post-illness recovery — rather than starting a long-term hair protocol. Once the trigger is addressed, the follicles in the resting phase typically re-enter the growth phase on their own, often within 3 to 6 months.
>
> *Below is the recovery curve you can realistically expect from telogen effluvium, and the supportive interventions that accelerate it.*

#### Autoimmune-Suspected
> Your loss pattern — patchy, defined areas of complete hair loss rather than diffuse thinning or recession — suggests possible alopecia areata or another autoimmune-mediated hair condition. Alopecia areata is an autoimmune disease where the immune system attacks the hair follicles, and it requires medical evaluation: a dermatologist needs to confirm the diagnosis, rule out related conditions (lupus, lichen planopilaris, alopecia totalis), and discuss treatments specific to autoimmune presentations like topical immunomodulators, intralesional steroids, or JAK inhibitors.
>
> RE5 is built around the eight biological drivers of androgenetic and stress-related hair loss. Those drivers are not what's causing this pattern, and applying a general hair restoration protocol without first confirming the diagnosis would be the wrong intervention. Honest framing: this is a place where the right next step is a doctor, not a protocol.
>
> *We're not recommending a variant. We're recommending you book a dermatologist appointment, get the diagnosis confirmed, and come back if it turns out a hair restoration protocol is appropriate alongside whatever they prescribe.*

#### Low-Pressure Protective
> Your assessment came back with genuinely low biological pressure across all eight drivers. No single pattern is firing meaningfully, your stage indicators are early, and your lifestyle inputs are largely working in your favour. This is the rare result where the honest answer is: your current trajectory is good, and the smartest move is protecting what you have rather than aggressively intervening.
>
> The right protocol for you is preventive — the lifestyle and scalp habits that keep drivers from activating later, without the supplemental and topical layer that someone with active loss needs. Hair loss is gradual and often genetic, so this can change in the future — but right now, you have more runway than most people who take this assessment.
>
> *Below is your projected trajectory at current trends, and the simple preventive habits that keep you on it.*

### SECTION 4 — Loss Curve graph
*See Section 8 of this spec for full graph specification.*

### Transition §4 → §5
> That trajectory is where you sit personally. Here's how it compares to everyone else who's taken this assessment.

### SECTION 5 — Percentile Distribution graph
*See Section 8 of this spec for full graph specification.*

### Transition §5 → §6
> Knowing where you stand is half the work. Knowing what to do about it is the other half. The principles that match your firing drivers are below.

### SECTION 6 — Concept Solutions

**Display logic:** Each block appears only when corresponding driver scores ≥3/5 (display) = ≥5/10 (internal).

**Block layout:**
```
[Icon] Address Your [Driver Name] Driver

[Mechanism statement — 1 sentence]

• [Principle 1 — bold action + 1 sentence explanation, no products]
• [Principle 2]
• [Principle 3]

[Closing line — realistic timeline or critical caveat]
```

#### Block 1 — Hormonal
> ### Address Your Hormonal Driver
>
> Your follicles need less DHT exposure and reduced androgen receptor sensitivity in the scalp.
>
> - **Block DHT at the source** — naturally through 5-alpha reductase inhibitors, pharmaceutically through prescription medication, or through a hybrid approach combining both.
> - **Reduce androgen receptor sensitivity** — botanical compounds and topical antiandrogens that calm the receptor's response without systemic hormonal disruption.
> - **Manage downstream sebum and inflammation** — DHT drives both, so addressing them lowers the secondary damage cascade.
>
> *Hormonal protocols take a minimum of 6 months to show meaningful change and 12 months to show their full effect. There is no fast path here — biology runs on its own timeline.*

#### Block 2 — Inflammatory
> ### Address Your Inflammatory Driver
>
> Your scalp and/or system needs the inflammatory load reduced before any other intervention will work efficiently.
>
> - **Calm scalp surface inflammation** — anti-inflammatory topicals and gentle cleansers replace the products quietly making it worse.
> - **Lower systemic inflammation** — diet, sleep, and targeted nutritional support reduce the inflammatory baseline your body is operating from.
> - **Address underlying conditions** — thyroid, autoimmune patterns, gut issues, or chronic infections need medical evaluation if suspected, not just supplementation.
>
> *Inflammation is one of the fastest drivers to respond — visible improvements in scalp symptoms can show in 4 to 8 weeks once the load drops.*

#### Block 3 — Oxidative
> ### Address Your Oxidative Driver
>
> Your follicle cells need fewer free radicals being generated and stronger antioxidant defences clearing what's produced.
>
> - **Reduce the oxidative inputs** — smoking, heavy alcohol, sleep debt, and excessive training without recovery are non-negotiable upstream sources.
> - **Strengthen antioxidant capacity** — through diet, targeted supplementation, and protecting the scalp from UV damage.
> - **Support mitochondrial function** — specific nutrients fuel the energy production follicle cells depend on for healthy growth cycles.
>
> *Oxidative damage compounds slowly and reverses slowly. The lifestyle changes that fix this also reduce risk across most age-related diseases — this is the highest-leverage driver to address for general health, not just hair.*

#### Block 4 — Vascular
> ### Address Your Vascular Driver
>
> Your scalp needs more consistent blood flow delivering nutrients, hormones, and oxygen to the follicles.
>
> - **Increase whole-body circulation** — regular movement, adequate hydration, and managing cardiovascular health upstream of any topical intervention.
> - **Manually stimulate scalp microcirculation** — daily mechanical stimulation through specific massage techniques opens the capillary network around follicles.
> - **Reduce scalp tension** — chronic tightness in the galea aponeurotica restricts blood flow regardless of cardiovascular health.
>
> *Vascular improvements can show in scalp warmth and feel within weeks, but follicle-level benefits compound over months.*

#### Block 5 — Nutritional
> ### Address Your Nutritional Driver
>
> Your follicles are working with depleted raw materials and need the foundation rebuilt before any topical or hormonal intervention can produce its full effect.
>
> - **Test, don't guess** — full blood work (ferritin, vitamin D, B12, thyroid panel, zinc) tells you exactly which nutrients are short. Supplementing blindly is rarely effective.
> - **Build the nutritional floor** — adequate protein, the specific micronutrients flagged by your bloods, and a baseline diet that doesn't actively deplete you.
> - **Address absorption** — gut health, age-related stomach acid decline, and medications that block nutrient uptake matter as much as intake.
>
> *Nutritional gaps can take 3 to 6 months of corrected supply before follicles reflect the change — they're at the back of the queue when supply was short.*

#### Block 6 — Fibrosis
> ### Address Your Fibrosis Driver
>
> Your scalp tissue needs to be physically softened and the perifollicular tightness mechanically released.
>
> - **Daily mechanical work** — sustained scalp manipulation breaks up fibrotic tissue and signals the body to remodel collagen — far more important than any product.
> - **Targeted topical penetration** — once tissue is softened, active ingredients can reach the follicle properly. Order matters.
> - **Manage upstream inflammation** — fibrosis is the body's response to long-term inflammation, so reducing the cause prevents further hardening even as you reverse what's there.
>
> *Fibrosis is the slowest driver to reverse. Realistic expectation: 6 to 12 months of consistent daily work before scalp texture meaningfully changes.*

#### Block 7 — Growth Signalling
> ### Address Your Growth Signalling Driver
>
> Your follicles need the regenerative pathways stimulated more aggressively to wake dormant follicles and extend the active growth phase.
>
> - **Stimulate the Wnt/β-catenin pathway** — the molecular switch that signals follicles to enter and stay in the growth phase. Activated through specific topical compounds and consistent mechanical stimulation.
> - **Support stem cell vitality** — the bulge stem cells that drive new follicle formation respond to the same general inputs that support tissue regeneration anywhere in the body.
> - **Extend the growth cycle** — interventions that lengthen anagen (the active growth phase) and shorten catagen (the transitional phase) directly produce thicker, denser hair.
>
> *Growth signalling responds slowly. Visible new growth from dormant follicles typically takes 4 to 6 months to appear, longer to mature.*

#### Block 8 — Microenvironment
> ### Address Your Scalp Microenvironment Driver
>
> Your scalp surface ecosystem needs to be rebalanced — the right shampoo, the right cadence, the right management of sebum and microbiome.
>
> - **Switch to a non-stripping cleanser** — harsh sulphates and daily over-washing damage the scalp barrier. Most people are using the wrong product entirely.
> - **Manage Malassezia and sebum** — the yeast that causes dandruff and seb derm needs targeted control, not just generic anti-dandruff shampoo on a rotation.
> - **Wash at the right cadence** — too often strips the barrier, too little allows microbial overgrowth. There's a specific frequency that works for most scalps.
>
> *Microenvironment improvements show fastest of any driver — flaking and itch can resolve in 2 to 4 weeks once the right routine is in place.*

### Transition §6 → §7
> Whichever protocol you choose — or even if you choose none — these are the foundational habits underneath all of it.

### SECTION 7 — General Plan

**Layout:**
```
Your Foundation Plan

Whatever protocol you choose — natural, hybrid, pharmaceutical, or none — these are the upstream habits that determine whether any intervention actually works. Start here.

[6 items in conditionally ordered sequence]

[Closing line]
```

**Default order:** Sleep → Shampoo → Scalp Massage → Stress → Protein → Bloods

**Conditional priority boost rules:**
- Q12 (sleep) elevated/critical → Sleep floats to #1
- Q15 or Q16 (scalp condition) elevated → Shampoo floats to #1
- Q20 cold extremities OR Q21 sedentary OR Q23 scalp shine elevated → Scalp Massage floats up
- Q13 (stress) elevated/critical → Stress floats up
- Q22 restrictive eating or fast food → Protein floats up
- Q18 (autoimmune/thyroid) OR Q19 (recent illness) OR Q22 (diet) elevated → Bloods floats to top 3

#### Item 1 — Sleep
> **Sleep 7–9 hours, consistently, in a dark room.**
> Hair follicles complete their growth cycle work and DHT clearance during deep sleep. Sleep debt directly elevates cortisol, accelerates oxidative damage, and shortens the anagen growth phase.
> *Won't fix androgen sensitivity on its own — but no protocol works properly when sleep is broken.*

#### Item 2 — Shampoo
> **Replace daily harsh shampoos with a gentle, non-stripping cleanser used 4 times a week.**
> Most commercial shampoos strip the scalp barrier and disrupt the microbiome — which then causes the dandruff and oiliness people try to fix with stronger shampoo. The cycle compounds. The right cleanser used at the right cadence reverses it.
> *This is foundational scalp care, not an active hair growth treatment — but it removes a hidden drag on every other intervention.*

#### Item 3 — Scalp Massage
> **Spend 5 minutes a day on firm scalp massage.**
> Mechanical stimulation improves microcirculation around follicles, breaks up early perifollicular fibrosis, and signals the body to remodel scalp tissue — all without any product applied. There is real research suggesting daily scalp massage alone produces measurable hair density changes over 6+ months.
> *Slow to show results — first 2–3 months feel like nothing is happening. Stick with it anyway.*

#### Item 4 — Stress
> **Treat stress as a hair input, not just a mental health issue.**
> Chronic cortisol pushes follicles into the resting phase, suppresses the growth cycle, and drives systemic inflammation. Acute stress events trigger telogen effluvium 2–4 months later — meaning the shedding people see is often a delayed echo of something months ago.
> *No protocol overrides chronically high cortisol. Whatever your method — exercise, breathwork, therapy, schedule changes — it counts as part of your hair plan.*

#### Item 5 — Protein
> **Build each meal around 25–40g of protein from real food.**
> Hair is 95% keratin, which is protein. Inadequate protein intake produces miniaturised regrowth even when DHT and other drivers are well-controlled. Most people eating "healthy" still under-eat protein.
> *Eating more protein won't grow hair on its own — but inadequate protein quietly caps every other intervention's ceiling.*

#### Item 6 — Bloods
> **Order a comprehensive blood panel: ferritin, vitamin D, B12, full thyroid (TSH, free T3, free T4, reverse T3), zinc.**
> The cheapest intervention with the highest leverage. Most people losing hair have at least one significant deficiency they don't know about — and supplementing without testing wastes time on the wrong nutrients.
> *Bloods don't fix anything on their own. They tell you exactly what to fix, which is the more important thing.*

#### Closing line (default):
> *These six habits are the foundation. They work without any product, supplement, or protocol — but they also have a ceiling. Most people who fix these alone slow their hair loss; few reverse it without targeted intervention on the firing drivers above.*

#### Closing line (Low-Pressure Protective override):
> *You don't need targeted intervention right now — these six habits are your protocol. Stay on them and your low-pressure profile is genuinely sustainable.*

#### Intro line (Stress-Telogen override):
> *Your priority is identifying and addressing the trigger that pushed your hair into the resting phase. The six foundational habits below support recovery — but the most important step is upstream: figure out what triggered this and resolve it.*

#### Section 7 (Autoimmune-Suspected override):
**Section omitted entirely.** Replaced by dermatologist-referral block in Section 8.

### SECTION 8 — CTA

#### Standard variant CTA template
```
Your Next Step

The RE5 [Variant Name] Quick-Start — $1

Your phenotype — [Phenotype Name] — most efficiently maps to the [Variant Name] protocol. We built a focused $1 Quick-Start that walks you through exactly how to run it, in the order that matters.

In the Quick-Start you'll find:
• The exact daily, weekly, and monthly protocol for your variant — what to do, when, and why
• A 100+ product review database — every relevant supplement, topical, and tool ranked honestly, with what's worth your money and what isn't
• Access to the RE5 community group and video tutorials — for when written instructions aren't enough

What this is: a structured, science-backed protocol with honest expectations. What it isn't: a miracle cure, a one-size-fits-all stack, or a sales funnel for branded supplements. We don't sell hair products. We sell the framework for choosing the right ones.

[ Get the [Variant] Quick-Start — $1 ]

Or: [Read the science behind your driver profile (free) →]
```

#### Stress-Telogen CTA
```
Your Next Step

The RE5 Telogen Recovery Guide — Free

Your phenotype — Stress-Telogen — is mechanistically different from genetic hair loss. Selling you a long-term protocol when you most likely need a short-term recovery plan would be dishonest. We've put the recovery guide in your inbox at no cost.

If your shedding doesn't resolve within 4–6 months of addressing the trigger, that's when the standard RE5 assessment becomes relevant — at that point, come back and re-take it. Your phenotype may have shifted.

[ Send me the Recovery Guide ]
```
*CRM action: tag user as `telogen_recovery` segment, send guide PDF via email.*

#### Autoimmune-Suspected CTA
```
Your Next Step

Book a Dermatologist Appointment

We're not recommending a protocol because doing so would be the wrong intervention. Patchy hair loss patterns require a dermatologist to confirm the diagnosis and rule out related conditions. Treatments specific to alopecia areata and similar autoimmune conditions exist and work — but they're prescribed by doctors, not chosen from a quiz.

If a dermatologist confirms your loss is androgenetic or stress-related rather than autoimmune, please come back and re-take this assessment. We'll be here.

[ Find a Dermatologist Near You → ]

We've also sent you a short email with the questions worth asking at the appointment, and what to do if it does turn out to be autoimmune.
```
*Routes to a region-detected derm directory link (NHS for UK, AAD for US, etc.). CRM action: tag as `autoimmune_referral`.*

#### Low-Pressure Protective CTA
```
Your Next Step

The RE5 Foundation Habits Guide — Free

Your assessment came back genuinely low-pressure across all eight drivers. We don't sell preventive guides for $1, because at this stage the foundation habits below are all you need.

If your situation changes — visible shedding starts, family pattern catches up to you, life stress spikes — come back and re-take this assessment. Your phenotype may have shifted, and at that point a structured protocol becomes useful. Until then, the free guide and these habits are the right intervention.

[ Send me the Foundation Guide ]
```
*CRM action: tag as `preventive_segment`.*

#### Existing Pharma User CTA
```
Your Next Step

The RE5 Pharma Optimisation Track — $1

Your phenotype — [Phenotype Name] — combined with your existing prescription protocol means you're not starting from zero. The Pharma Optimisation Track is for people already on finasteride, minoxidil, or dutasteride who want to layer the RE5 system around what's already working.

In the Optimisation Track you'll find:
• How to integrate the RE5 protocol with your current medications without conflicts (and the small number of natural compounds to avoid alongside finasteride or minoxidil)
• The botanical and topical layer that addresses the drivers your prescription doesn't reach
• When and how to consider stepping down or off pharmaceuticals if you choose to in future, without losing what you've gained

What this is: integration, not replacement. We don't tell people to come off their prescriptions. We tell them how to build a fuller system around them.

[ Get the Optimisation Track — $1 ]

Or: [Read about ingredient interactions with finasteride and minoxidil (free) →]
```

---

## 8. Graph Specifications

### GRAPH 1 — The Follicle Loss Curve

**Position:** Section 4 of results page
**Purpose:** Visualise projected hair density trajectory at current trends vs. on matched RE5 protocol

#### Visual layout
- **X-axis:** Age, from current age to 70
- **Y-axis:** Hair density (relative scale 0–100%, normalised to age-25 baseline)
- **Two lines:**
  - **"No Intervention" line:** Carbon ink #1A1A1A, solid, weight 2px
  - **"RE5 Trajectory" line:** Celadon Teal #2F5F6B, solid, weight 2px
- **User's current age:** Vertical dotted line + "You are here" label
- **Shaded area between lines:** Saffron #E8893D at 10% opacity (visualises "what's at stake")
- **Disclosure caption** (small text below graph):
  > Modelled from published clinical data on hair loss progression and intervention efficacy specific to your variant. Individual results vary — these are projections, not predictions.

#### "No Intervention" curve math

Modified logistic decay:
```javascript
function noInterventionDensity(age, phenotype, stage, familyHistoryPoints) {
  const params = PHENOTYPE_PARAMS[phenotype];
  let L = params.L;
  let k = params.k;
  let midpoint = params.midpoint;

  // Stage modifier
  if (stage === "Early") midpoint += 5;
  if (stage === "Mid") midpoint = currentAge + 5;
  if (stage === "Late") midpoint = currentAge - 3;

  // Family history modifier
  if (familyHistoryPoints === 0) L *= 0.9;
  if (familyHistoryPoints >= 3) {
    L *= 1.1;
    midpoint -= 3;
  }

  // Logistic decay
  return 100 * (1 - L / (1 + Math.exp(-k * (age - midpoint))));
}
```

#### Phenotype parameters

| Phenotype | L (lifetime loss %) | k (rate) | Default midpoint |
|---|---|---|---|
| Androgen-Dominant | 60–80 (varies by stage) | 0.10–0.20 | 50 (Early), currentAge+5 (Mid), currentAge-3 (Late) |
| Inflammation-Led | 40 | 0.08 | 55 |
| Oxidative-Stressed | 35 | 0.07 | 58 |
| Vascular-Compromised | 35 | 0.07 | 60 |
| Nutritionally-Depleted | 30 | 0.06 | 60 |
| Fibrosis-Established | varies by stage | high | currentAge |
| Multi-Driver Cascade | 75 | 0.18 | currentAge + 3 |
| Low-Pressure Protective | 15 | 0.03 | 65 |

#### "RE5 Trajectory" curve math

Same logistic curve, with intervention efficacy applied to L:
```javascript
function re5TrajectoryDensity(age, phenotype, stage, variant, familyHistoryPoints) {
  const params = PHENOTYPE_PARAMS[phenotype];
  const efficacy = VARIANT_EFFICACY[variant];

  let L = params.L * (1 - efficacy.L_reduction);

  // Stage attenuation
  if (stage === "Mid") L *= 1.2;   // 80% of stated efficacy
  if (stage === "Late") L *= 1.5;  // 50% of stated efficacy

  let k = params.k * 0.7;  // protocol slows progression rate
  let midpoint = params.midpoint + 3;  // protocol delays midpoint

  return 100 * (1 - L / (1 + Math.exp(-k * (age - midpoint))));
}
```

#### Variant efficacy coefficients

| Variant | L_reduction | Effect onset |
|---|---|---|
| Natural | 0.30 (30% reduction in projected loss) | 6–12 months |
| Hybrid | 0.475 (47.5% reduction) | 6–9 months |
| Pharma | 0.575 (57.5% reduction) | 4–8 months |
| Pharma Optimisation Track | 0.40 (additive on existing pharma) | 4–8 months |

#### Edge cases

**Stress-Telogen phenotype:** Replace graph entirely with a recovery curve — density drops from current age - 0.3 years to current age (steep drop), then recovers from current age over 6–12 months back toward baseline. Two lines: with vs. without trigger resolution.

**Autoimmune-Suspected:** Graph omitted (entire Section 4 omitted).

**Existing Pharma User:** Three-line graph:
1. "Your current trajectory on existing pharma" (gentler decline than fully untreated)
2. "Without RE5 layered on top" (same as line 1)
3. "With RE5 + your existing pharma" (additional benefit visualised)

### GRAPH 2 — The Percentile Distribution

**Position:** Section 5 of results page
**Purpose:** Show user where they sit in the population of assessment-takers

#### Visual layout
- **Bell curve** (normal distribution shape) labelled "Hair Loss Risk Score Distribution"
- **X-axis:** Score 0–100
- **Y-axis:** Unlabelled (curve density only)
- **User's score plotted:** Vertical line + dot in saffron #E8893D, with score number above
- **Percentile callout above chart:** *"You're in the worst [X]%..."* or *"You're in the best [X]%..."*
- **Curve fill:** Stone #8A8578 at 30% opacity
- **Color zones underneath x-axis (small horizontal bar):**
  - 0–40: deep teal #2F5F6B
  - 41–70: stone #8A8578
  - 71–100: deep amber/saffron #E8893D

#### Distribution math

**Launch (Option A — modelled distribution):**
```javascript
// Synthetic normal distribution calibrated to published AGA prevalence
const populationMean = 45;
const populationStdDev = 18;

function getPercentile(userScore) {
  // Z-score
  const z = (userScore - populationMean) / populationStdDev;

  // Cumulative distribution function (Erf approximation)
  const percentile = 0.5 * (1 + erf(z / Math.sqrt(2)));

  return Math.round(percentile * 100);
}
```

**Disclosure caption:**
> Modelled distribution based on published hair loss prevalence data.

**Post-launch (Option B — live data):**
After 1,000+ completed assessments, switch to live percentile calculation from actual user data.

**Disclosure caption (post-launch):**
> Distribution based on [N] users who've taken this assessment.

#### Percentile copy bands

| Percentile | Copy |
|---|---|
| 1–10 (best) | You're in the best 10% of people who've taken this assessment. Your biological pressure is genuinely low — protect what you have. |
| 11–25 | You're in the best 25%. You're well-positioned compared to most people in your age range. |
| 26–50 | You sit in the better half of the distribution. Driver activity is moderate but manageable. |
| 51–75 | You sit in the worse half. Several drivers are firing at meaningful levels. |
| 76–90 | You're in the worst 25%. Your driver profile is more active than most assessment-takers — early intervention pays back the most here. |
| 91–99 | You're in the worst 10%. Aggressive driver activation — but the protocol path is clear and the leverage is high. |

#### Edge cases

**Low-Pressure Protective:** Graph still shown — they earned the best 10–25% slot and it's genuine positive feedback.

**Stress-Telogen / Autoimmune:** Graph still shown but with adjusted copy noting the score doesn't capture phenotype-specific issues.

---

## 9. Brand Styling — Colors, Typography, Components

### Color palette (RE5 v4)
```css
:root {
  --lab-paper:    #FAFAF7;  /* Background */
  --carbon-ink:   #1A1A1A;  /* Primary text, "no intervention" line */
  --saffron:      #E8893D;  /* Primary CTA, user marker, accent */
  --celadon:      #2F5F6B;  /* "RE5 trajectory" line, system accent */
  --stone:        #8A8578;  /* Muted text, distribution fill */
  --celadon-light:#5A8B95;  /* Mild scoring */
  --teal-deep:    #1F4555;  /* Hover state for celadon */
}
```

### Typography
- **Display / body:** Nunito Sans (via @fontsource/nunito-sans)
- **Data / labels / monospace:** IBM Plex Mono (via @fontsource/ibm-plex-mono)

### Components needed (suggested)
- `<Question />` — handles all 4 question types
- `<ProgressBar />` — displays Part X of 3 + within-part progress
- `<Checkpoint />` — between-parts celebration screen
- `<DriverCard />` — single driver result card (8 of these on results)
- `<PhenotypeBlock />` — pattern + overlay + stage paragraph composer
- `<LossCurveGraph />` — Recharts or D3 implementation of Graph 1
- `<PercentileGraph />` — Recharts or D3 implementation of Graph 2
- `<ConceptSolutionBlock />` — single driver concept block (conditional render)
- `<GeneralPlanItem />` — single foundation habit item
- `<CTA />` — variant-matched call-to-action block
- `<EmailGate />` — Q26 email capture screen
- `<CalculationAnimation />` — between Q26 and results

### Graph library recommendation
Use **Recharts** (declarative, React-native, supports custom curves and area fills). D3 if you need finer control over the logistic curve animation.

### Mobile considerations
- All question screens are full-viewport on mobile
- Tap targets minimum 44×44px (Apple HIG)
- Numeric input (Q2 age) uses `inputMode="numeric"` to trigger numeric keyboard
- Graphs render responsively — consider simplified mobile versions if needed

---

## 10. Suggested File Structure

```
re5-website/
├── pages/
│   └── assessment/
│       ├── index.tsx              // Landing page
│       ├── [step].tsx             // Question routing (1-26)
│       └── results.tsx            // Results page
├── components/
│   └── assessment/
│       ├── Question.tsx
│       ├── ProgressBar.tsx
│       ├── Checkpoint.tsx
│       ├── EmailGate.tsx
│       ├── CalculationAnimation.tsx
│       ├── results/
│       │   ├── HeadlineScore.tsx
│       │   ├── DriverCard.tsx
│       │   ├── PhenotypeBlock.tsx
│       │   ├── LossCurveGraph.tsx
│       │   ├── PercentileGraph.tsx
│       │   ├── ConceptSolutionBlock.tsx
│       │   ├── GeneralPlanItem.tsx
│       │   └── CTA.tsx
├── lib/
│   └── assessment/
│       ├── questions.ts           // Full question array (the 26)
│       ├── scoring.ts             // Driver/stage scoring engine
│       ├── phenotype.ts           // Phenotype assignment algorithm
│       ├── variant.ts             // Variant routing
│       ├── graphs.ts              // Curve math (logistic, percentile)
│       └── copy.ts                // Results page copy library
├── public/
│   └── assessment/
│       ├── norwood/               // Norwood illustrations (commissioned)
│       └── ludwig/                // Ludwig illustrations (commissioned)
└── styles/
    └── assessment.css             // Brand variables + assessment-specific styles
```

---

## 11. Integrations — Email, Analytics, CRM

### Email capture (Q26)
- **Provider:** Whatever the existing RE5 newsletter uses (ConvertKit / Beehiiv / Klaviyo / etc.)
- **On submit:**
  1. Save email to CRM with tags:
     - `assessment_completed`
     - `phenotype_[normalized phenotype name]` (e.g., `phenotype_androgen_dominant_mid`)
     - `variant_[normalized variant name]` (e.g., `variant_mens_hybrid`)
     - `newsletter_optin` (if checkbox ticked)
  2. Trigger phenotype-matched welcome email sequence (3 emails — to be designed in next phase)
  3. Render results page

### Analytics events to fire
| Event | Trigger |
|---|---|
| `assessment_started` | Landing page CTA clicked |
| `question_answered` | Each question (with question_id) |
| `checkpoint_reached` | Each of 2 checkpoint screens |
| `email_submitted` | Q26 submit |
| `results_viewed` | Results page render |
| `cta_clicked_primary` | Primary CTA button clicked (with variant + phenotype) |
| `cta_clicked_secondary` | Secondary "read the science" link |
| `assessment_abandoned` | User leaves before Q26 (with last_question reached) |

Recommended: GA4 + a product analytics tool (PostHog, Amplitude, Mixpanel) for funnel analysis.

### Drop-off tracking
Critical metric. Watch for clusters of abandonment at specific questions — those questions need attention.

---

## 12. Pre-Launch Checklist

### Content
- [ ] Norwood illustrations sourced/commissioned (5 images)
- [ ] Ludwig illustrations sourced/commissioned (5 images)
- [ ] Solomon's review of all 26 question wordings
- [ ] Solomon's review of all 32 driver card conditional sentences
- [ ] Solomon's review of all 8 pattern paragraphs + 3 stage modifiers
- [ ] Solomon's review of all 3 special-case override paragraphs
- [ ] Solomon's review of all 8 concept solution blocks
- [ ] Solomon's review of all 6 general plan items
- [ ] Solomon's review of all 5 CTA variations

### Engineering
- [ ] All 26 questions wired with correct scoring rules
- [ ] Branching logic working (sex gate at Q1)
- [ ] Phenotype algorithm produces correct phenotype for ≥10 test cases
- [ ] Variant routing correct for all pharma_openness × sex combinations
- [ ] Loss Curve graph renders for each phenotype
- [ ] Percentile graph renders correctly with modelled distribution
- [ ] Special-case page modifications (Stress-Telogen / Autoimmune / Low-Pressure) render correctly
- [ ] Email capture working with CRM integration
- [ ] Mobile responsive on test devices
- [ ] All analytics events firing correctly

### Scientific defensibility
- [ ] Solomon personally verifies Loss Curve phenotype parameters against published literature
- [ ] Disclosure caption present and prominent under Loss Curve
- [ ] Disclosure caption present under Percentile Distribution
- [ ] Autoimmune referral page tested for tone — must clearly NOT sell

### Launch
- [ ] Privacy policy linked from email gate
- [ ] Terms of use linked
- [ ] Unsubscribe working in welcome email
- [ ] Test the full flow end-to-end with 10 different test profiles before going live
- [ ] Set up dashboard to monitor: completion rate, drop-off by question, phenotype distribution, CTA click-through

---

## End of Specification

Total questions: **26**
Estimated completion time: **3.5–4 minutes**
Total results page copy: **~6,700 words** (conditional rendering = ~1,200–2,000 words per individual user)
Phenotypes possible: **24 standard + 3 special-case overrides + 1 existing pharma route = 28 distinct user paths**

For Claude Code: this document is the source of truth. Any divergence between this spec and what gets built should be flagged to the user before implementation.

**Solomon's review notes:** Add any modifications to this spec before passing to Claude Code. The Loss Curve parameters in Section 8 specifically warrant a careful read against your own knowledge of the literature.
