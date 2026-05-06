import { chromium } from "playwright";

const BASE = "http://localhost:5173/assessment/";
const SHOTS = "/tmp/assessment-walkthrough";

async function main() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  await page.goto(BASE);
  await page.waitForSelector(".landing");
  await page.screenshot({ path: `${SHOTS}/01-landing.png`, fullPage: true });
  console.log("01 Landing ✓");

  // Start
  await page.locator(".btn-primary").click();
  await page.waitForTimeout(400);

  // Q1: Sex
  await page.screenshot({ path: `${SHOTS}/02-q1-sex.png` });
  console.log("02 Q1 Sex ✓");
  await page.getByRole("button", { name: "Male", exact: true }).click();
  await page.waitForTimeout(400);

  // Q2: Age
  await page.screenshot({ path: `${SHOTS}/03-q2-age.png` });
  console.log("03 Q2 Age ✓");
  await page.locator(".numeric-input").fill("35");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(400);

  // Q3: Norwood
  await page.screenshot({ path: `${SHOTS}/04-q3-norwood.png` });
  console.log("04 Q3 Norwood ✓");
  await page.locator(".option-btn").filter({ hasText: "Clear temple recession" }).click();
  await page.waitForTimeout(400);

  // Q4–Q9
  const part1Answers = [
    "3–7 years ago",
    "Slowly getting worse",
    "Most of them",
    "One or two, mild",
    "Mix of fine baby hairs",
    "Mostly at the temples",
  ];
  for (const ans of part1Answers) {
    await page.locator(".option-btn").filter({ hasText: ans }).click();
    await page.waitForTimeout(350);
  }
  await page.screenshot({ path: `${SHOTS}/05-checkpoint1.png` });
  console.log("05 Checkpoint 1 ✓");

  // Continue past checkpoint
  await page.locator(".btn").filter({ hasText: "Continue" }).click();
  await page.waitForTimeout(400);

  // Part 2: Q10–Q19
  const part2Answers = [
    "I still get adult acne",
    "Lower energy",
    "6–7 hours most nights",
    "Normal stress",
    "No, never",
    "Normal — I don't notice it",
    "Looks normal",
    "3–5 times a week",
    "None of these",
    "None of these",
  ];
  for (let i = 0; i < part2Answers.length; i++) {
    await page.locator(".option-btn").filter({ hasText: part2Answers[i] }).click();
    await page.waitForTimeout(350);
    if (i === 0) {
      await page.screenshot({ path: `${SHOTS}/06-q10-part2.png` });
      console.log("06 Q10 Part 2 start ✓");
    }
  }
  await page.screenshot({ path: `${SHOTS}/07-checkpoint2.png` });
  console.log("07 Checkpoint 2 ✓");

  // Continue past checkpoint 2
  await page.locator(".btn").filter({ hasText: "Continue" }).click();
  await page.waitForTimeout(400);

  // Part 3: Q20–Q25
  const part3Answers = [
    "Normal temperature",
    "Moderate exercise",
    "Whole foods",
    "Slightly smoother",
    "Normal healing",
    "Comfortable with a hybrid",
  ];
  for (const ans of part3Answers) {
    await page.locator(".option-btn").filter({ hasText: ans }).click();
    await page.waitForTimeout(350);
  }

  // Email gate
  await page.waitForSelector(".email-gate", { timeout: 5000 });
  await page.screenshot({ path: `${SHOTS}/08-email-gate.png` });
  console.log("08 Email Gate ✓");

  await page.locator(".email-input").fill("walkthrough@re5test.com");
  await page.locator("button[type='submit']").click();
  await page.waitForTimeout(300);

  // Calculation animation
  await page.waitForSelector(".calculation", { timeout: 3000 });
  await page.screenshot({ path: `${SHOTS}/09-calculating.png` });
  console.log("09 Calculating ✓");

  // Wait for results
  await page.waitForSelector(".results-page", { timeout: 15000 });
  await page.waitForTimeout(500);

  // Screenshot results in sections by scrolling
  await page.screenshot({ path: `${SHOTS}/10-results-top.png` });
  console.log("10 Results top ✓");

  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${SHOTS}/11-results-drivers.png` });
  console.log("11 Results drivers ✓");

  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${SHOTS}/12-results-phenotype.png` });
  console.log("12 Results phenotype ✓");

  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${SHOTS}/13-results-graph.png` });
  console.log("13 Results graph ✓");

  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${SHOTS}/14-results-percentile.png` });
  console.log("14 Results percentile ✓");

  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${SHOTS}/15-results-solutions.png` });
  console.log("15 Results solutions ✓");

  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${SHOTS}/16-results-plan.png` });
  console.log("16 Results plan ✓");

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${SHOTS}/17-results-cta.png` });
  console.log("17 Results CTA ✓");

  console.log("\n✓ Walkthrough complete — 17 screenshots saved to " + SHOTS);

  await page.waitForTimeout(3000);
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
