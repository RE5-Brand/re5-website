import { chromium, Page } from "playwright";

const BASE = "http://localhost:5173/assessment/";

interface ProfileStep {
  type: "select" | "numeric";
  value: string;
}

async function selectOption(page: Page, text: string) {
  await page.locator(".option-btn").filter({ hasText: text }).click();
  await page.waitForTimeout(350);
}

async function enterNumeric(page: Page, value: string) {
  await page.locator(".numeric-input").fill(value);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(350);
}

async function clickContinue(page: Page) {
  await page.locator(".btn").filter({ hasText: "Continue" }).click();
  await page.waitForTimeout(350);
}

async function passCheckpoint(page: Page) {
  await page.waitForSelector(".checkpoint", { timeout: 3000 }).catch(() => null);
  if (await page.locator(".checkpoint").isVisible()) {
    await clickContinue(page);
  }
}

async function runProfile(
  page: Page,
  name: string,
  sex: "Male" | "Female",
  answers: ProfileStep[],
  expectedPhenotype: string
) {
  console.log(`\n── ${name} ──`);
  await page.goto(BASE);
  await page.waitForSelector(".landing");

  // Start
  await page.locator(".btn-primary").click();
  await page.waitForTimeout(350);

  // Q1: Sex
  await page.getByRole("button", { name: sex, exact: true }).click();
  await page.waitForTimeout(350);

  // Q2–Q25 (answers array)
  for (let i = 0; i < answers.length; i++) {
    const step = answers[i];

    // Check for checkpoint between parts
    if (await page.locator(".checkpoint").isVisible()) {
      await clickContinue(page);
      await page.waitForTimeout(300);
    }

    if (step.type === "numeric") {
      await enterNumeric(page, step.value);
    } else {
      await selectOption(page, step.value);
    }
  }

  // Should be on email gate
  await page.waitForSelector(".email-gate", { timeout: 5000 });
  await page.locator(".email-input").fill("e2e-test@example.com");
  await page.locator("button[type='submit']").click();
  await page.waitForTimeout(300);

  // Calculation animation
  await page.waitForSelector(".calculation", { timeout: 3000 });
  await page.waitForSelector(".results-page", { timeout: 15000 });

  // Verify results page rendered
  const headline = await page.locator(".headline-score").textContent();
  console.log(`  Score: ${headline?.trim()}`);

  const phenotype = await page.locator(".phenotype-name").textContent();
  console.log(`  Phenotype: ${phenotype?.trim()}`);

  if (phenotype && !phenotype.includes(expectedPhenotype)) {
    console.error(`  ❌ Expected "${expectedPhenotype}" in phenotype, got "${phenotype.trim()}"`);
    process.exitCode = 1;
  } else {
    console.log(`  ✓ Matches expected: "${expectedPhenotype}"`);
  }

  // Verify key sections rendered
  const sections = await page.locator(".results-section").count();
  console.log(`  Sections rendered: ${sections}`);
  if (sections < 4) {
    console.error(`  ❌ Too few sections (expected ≥4)`);
    process.exitCode = 1;
  }

  return { headline, phenotype };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  // Profile 1: Androgen-Dominant Male
  await runProfile(page, "Androgen-Dominant Male", "Male", [
    { type: "numeric", value: "35" },
    { type: "select", value: "Clear temple recession" },
    { type: "select", value: "3–7 years ago" },
    { type: "select", value: "Slowly getting worse" },
    { type: "select", value: "Most of them" },
    { type: "select", value: "One or two, mild" },
    { type: "select", value: "Mix of fine baby hairs" },
    { type: "select", value: "Mostly at the temples" },
    // Part 2
    { type: "select", value: "I still get adult acne" },
    { type: "select", value: "Lower energy" },
    { type: "select", value: "6–7 hours most nights" },
    { type: "select", value: "Normal stress" },
    { type: "select", value: "No, never" },
    { type: "select", value: "Normal — I don't notice it" },
    { type: "select", value: "Looks normal" },
    { type: "select", value: "3–5 times a week" },
    { type: "select", value: "None of these" },
    { type: "select", value: "None of these" },
    // Part 3
    { type: "select", value: "Normal temperature" },
    { type: "select", value: "Moderate exercise" },
    { type: "select", value: "Whole foods" },
    { type: "select", value: "Slightly smoother" },
    { type: "select", value: "Normal healing" },
    { type: "select", value: "Comfortable with a hybrid" },
  ], "Androgen-Dominant");

  // Profile 2: Stress-Telogen Female
  await runProfile(page, "Stress-Telogen Female", "Female", [
    { type: "numeric", value: "28" },
    { type: "select", value: "Diffuse thinning everywhere" },
    { type: "select", value: "Within the last year" },
    { type: "select", value: "Rapid loss happening right now" },
    { type: "select", value: "None that I know of" },
    { type: "select", value: "None that I know of" },
    { type: "select", value: "Hair is just shorter and finer" },
    { type: "select", value: "Diffusely all over" },
    // Part 2
    { type: "select", value: "None of these" },
    { type: "select", value: "My hair loss started after pregnancy" },
    { type: "select", value: "Less than 6 hours" },
    { type: "select", value: "I've been through something major" },
    { type: "select", value: "No, never" },
    { type: "select", value: "Normal — I don't notice it" },
    { type: "select", value: "Looks normal" },
    { type: "select", value: "3–5 times a week" },
    { type: "select", value: "None of these" },
    { type: "select", value: "None of these" },
    // Part 3
    { type: "select", value: "Normal temperature" },
    { type: "select", value: "Moderate exercise" },
    { type: "select", value: "Mostly home-cooked" },
    { type: "select", value: "I don't have any thinning areas" },
    { type: "select", value: "Cuts and scrapes heal fast" },
    { type: "select", value: "Natural only" },
  ], "Stress-Telogen");

  // Profile 3: Low-Pressure Protective Female
  await runProfile(page, "Low-Pressure Female", "Female", [
    { type: "numeric", value: "22" },
    { type: "select", value: "No visible loss" },
    { type: "select", value: "I haven't yet" },
    { type: "select", value: "I don't have any visible loss yet" },
    { type: "select", value: "None that I know of" },
    { type: "select", value: "None that I know of" },
    { type: "select", value: "I don't have thinning areas" },
    { type: "select", value: "I don't have any thinning yet" },
    // Part 2
    { type: "select", value: "None of these" },
    { type: "select", value: "None of these" },
    { type: "select", value: "7–9 hours, deep and restorative" },
    { type: "select", value: "Calm" },
    { type: "select", value: "No, never" },
    { type: "select", value: "Normal — I don't notice it" },
    { type: "select", value: "Looks normal" },
    { type: "select", value: "3–5 times a week" },
    { type: "select", value: "None of these" },
    { type: "select", value: "None of these" },
    // Part 3
    { type: "select", value: "Normal temperature" },
    { type: "select", value: "Moderate exercise" },
    { type: "select", value: "Whole foods" },
    { type: "select", value: "I don't have any thinning areas" },
    { type: "select", value: "Cuts and scrapes heal fast" },
    { type: "select", value: "Natural only" },
  ], "Low-Pressure");

  // Profile 4: Autoimmune Male
  await runProfile(page, "Autoimmune-Suspected Male", "Male", [
    { type: "numeric", value: "42" },
    { type: "select", value: "Clear temple recession" },
    { type: "select", value: "1–3 years ago" },
    { type: "select", value: "Visibly worse in just the last 6 months" },
    { type: "select", value: "None that I know of" },
    { type: "select", value: "None that I know of" },
    { type: "select", value: "Mix of fine baby hairs" },
    { type: "select", value: "In patches or specific spots" },
    // Part 2
    { type: "select", value: "None of these" },
    { type: "select", value: "None of these" },
    { type: "select", value: "7–9 hours but I wake up tired" },
    { type: "select", value: "Elevated" },
    { type: "select", value: "No, never" },
    { type: "select", value: "Itchy in places" },
    { type: "select", value: "Some redness" },
    { type: "select", value: "3–5 times a week" },
    { type: "select", value: "An autoimmune condition" },
    { type: "select", value: "None of these" },
    // Part 3
    { type: "select", value: "Normal temperature" },
    { type: "select", value: "Light walking" },
    { type: "select", value: "Mostly home-cooked" },
    { type: "select", value: "Skin looks and feels normal" },
    { type: "select", value: "Normal healing" },
    { type: "select", value: "Open to natural-first" },
  ], "Autoimmune");

  // Profile 5: Multi-Driver Cascade Male
  await runProfile(page, "Multi-Driver Cascade Male", "Male", [
    { type: "numeric", value: "48" },
    { type: "select", value: "Significant thinning across top" },
    { type: "select", value: "More than 7 years ago" },
    { type: "select", value: "Slowly getting worse" },
    { type: "select", value: "All of them, and many started" },
    { type: "select", value: "Several, especially the men" },
    { type: "select", value: "Mostly smooth, shiny scalp" },
    { type: "select", value: "Mostly at the temples" },
    // Part 2
    { type: "select", value: "I still get adult acne" },
    { type: "select", value: "I take testosterone" },
    { type: "select", value: "Less than 6 hours" },
    { type: "select", value: "High — I'm overwhelmed" },
    { type: "select", value: "Daily" },
    { type: "select", value: "Tender, sore" },
    { type: "select", value: "Some redness" },
    { type: "select", value: "Daily with whatever" },
    { type: "select", value: "None of these" },
    { type: "select", value: "None of these" },
    // Part 3
    { type: "select", value: "Always cold" },
    { type: "select", value: "I'm sedentary" },
    { type: "select", value: "Mostly fast food" },
    { type: "select", value: "Visibly shiny, taut" },
    { type: "select", value: "Slow healer" },
    { type: "select", value: "I want the strongest possible" },
  ], "Multi-Driver Cascade");

  // Mobile viewport test - Profile 6
  await context.close();
  const mobileContext = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const mobilePage = await mobileContext.newPage();

  await runProfile(mobilePage, "Mobile: Vascular-Compromised Male", "Male", [
    { type: "numeric", value: "30" },
    { type: "select", value: "Slight temple recession" },
    { type: "select", value: "1–3 years ago" },
    { type: "select", value: "Slowly getting worse" },
    { type: "select", value: "One or two, mild" },
    { type: "select", value: "None that I know of" },
    { type: "select", value: "Hair is just shorter and finer" },
    { type: "select", value: "Mostly at the temples" },
    // Part 2
    { type: "select", value: "I had bad acne in my teens" },
    { type: "select", value: "None of these" },
    { type: "select", value: "7–9 hours but I wake up tired" },
    { type: "select", value: "Elevated" },
    { type: "select", value: "Occasionally" },
    { type: "select", value: "Normal — I don't notice it" },
    { type: "select", value: "Looks normal" },
    { type: "select", value: "3–5 times a week" },
    { type: "select", value: "None of these" },
    { type: "select", value: "None of these" },
    // Part 3
    { type: "select", value: "Always cold" },
    { type: "select", value: "I'm sedentary" },
    { type: "select", value: "Mostly home-cooked" },
    { type: "select", value: "Skin looks and feels normal" },
    { type: "select", value: "Normal healing" },
    { type: "select", value: "Comfortable with a hybrid" },
  ], "Vascular-Compromised");

  await mobileContext.close();
  await browser.close();

  if (process.exitCode) {
    console.log("\n❌ Some tests failed.");
  } else {
    console.log("\n✓ All E2E tests passed.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
