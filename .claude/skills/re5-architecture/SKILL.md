---
name: re5-architecture
description: Page structure, section purposes, and locked design decisions for the RE5 brand website (Bald Research). The site is a three-page architecture — homepage (brand), /book (Book 3 product), /masterclass (Masterclass product). Use this skill whenever building, editing, or extending any page on the RE5 site, the 8 Drivers Checklist PDF, or future planned pages. This skill defines what each page does, what sections appear on which pages, treatment variation rules for shared content, and what must not be changed without explicit user instruction. Apply alongside re5-brand and re5-voice for any web work.
---

# RE5 Web Architecture

## The Site Map
re5-website/
├── index.html              ← HOMEPAGE — RE5 as a brand, both products visible
├── book.html               ← /book — Book 3 product page ("The 30/70 Protocol")
├── masterclass.html        ← /masterclass — Masterclass product page
├── thank-you.html          ← (planned) post-purchase confirmation
├── checklist.html          ← (planned) 8 Drivers Checklist opt-in landing
├── about.html              ← (planned) full Solomon story
├── privacy.html            ← (planned) legal
├── terms.html              ← (planned) legal
├── 404.html                ← (planned) custom not-found
└── assets/                 ← shared images, SVGs, brand assets

Three live pages at launch: `/`, `/book`, `/masterclass`. Five planned pages added later in priority order.

## Tech Stack (Locked)

| Layer | Tool | Why |
|---|---|---|
| Hosting | Vercel (free) | Static HTML, instant deploys, Git-integrated |
| Routing | Vercel auto-routing | `book.html` → `/book` automatic, no config needed |
| Version control | Git + GitHub | Every change tracked, rollback always available |
| Build | Hand-written HTML/CSS | Full design control, no framework overhead |
| Checkout | Payhip | Native digital fulfillment, no integration glue |
| Email | Kit (ConvertKit) | Free up to 10K subs, lead magnet automation |
| Analytics | TBD (Plausible likely) | Privacy-respecting, no cookie banner |

The Carrd build path was abandoned in favour of static HTML on Vercel. Do not re-introduce Carrd dependencies.

## URL Convention (Locked)

| Page | URL | File |
|---|---|---|
| Homepage | `/` | `index.html` |
| Book 3 product | `/book` | `book.html` |
| Masterclass product | `/masterclass` | `masterclass.html` |

Vercel automatically routes `book.html` → `/book` and strips the `.html` from URLs. Do not propose subfolder structures (`/products/book`) — flat is correct.

## Cross-Page Navigation Rules

| From | To | When |
|---|---|---|
| Homepage | `/book` | "Start with the book" CTA in Two Paths section |
| Homepage | `/masterclass` | "Go straight to the full system" CTA in Two Paths section |
| `/book` | `/masterclass` | Soft upsell ("when you're ready for more") in Inside the Book section |
| `/masterclass` | `/book` | NOT recommended — Masterclass buyers shouldn't be downsold |
| All pages | `/` | Wordmark in top nav links to homepage |

Persistent top nav appears on all three pages. Footer is identical on all three pages.

## Treatment Variation Rules

The brand-level concepts (8 drivers, 5 phases, East-West) appear on every page but with different orchestrations matched to the page's job. This is the architectural rule that prevents the pages from feeling like copy-paste.

### Foundational Rule: Compression Reduces Words, Not Visual Structure

When compressing a section for a product page, you reduce **word density** — not the visual elements that make the section recognisably RE5. Cards stay cards. Cells stay cells. Dark surfaces stay dark. The 4×2 grid stays a 4×2 grid. Only the descriptive copy shrinks.

This rule overrides any earlier instruction to "compress to a single line" or "compress to a strip". Those framings led to flattening the visual structure, which broke the brand identity. Always preserve the visual rigor; only the word count varies per page.

### The 8 Drivers

| Page | Treatment | Visual structure | Per-driver word count |
|---|---|---|---|
| Homepage | **Full grid** | 4×2 cells. Each cell: Dn + name + 2-line description. | ~12-15 words |
| `/book` | **Compressed grid** | Same 4×2 cells. Each cell: Dn + name + 1-line description (one short phrase). | ~5-7 words |
| `/masterclass` | **Variant-mapped grid** | Same 4×2 cells. Each cell: Dn + name + which variant addresses it most directly. | ~15-20 words |

### The 5 Phases (RE5 Framework)

| Page | Treatment | Visual structure | Per-phase word count |
|---|---|---|---|
| Homepage | **Full deep-dive** | 5 cards in a row. R5 dark. Each card: Rn + name + 2-line description. Plus 2 paragraphs of framework context above. | ~12-15 words |
| `/book` | **Compressed cards** | Same 5 cards in a row. R5 dark. Each card: Rn + name + 3-word description ("Clear the terrain", "Stop the damage", "Rebuild environment", "Push growth signal", "Sustain long-term"). Headline locked. | 3 words exactly |
| `/masterclass` | **Phase-by-variant grid** | Same 5 cards in a row, but each card expands to show how the phase is executed differently across Natural / Hybrid / Pharma variants. | ~30-50 words |

The 3-word descriptions for /book are LOCKED:
- R1 Reset → "Clear the terrain"
- R2 Reduce → "Stop the damage"
- R3 Restore → "Rebuild environment"
- R4 Regenerate → "Push growth signal"
- R5 Retain → "Sustain long-term"

### East-West Synthesis

| Page | Treatment | Visual structure | Word count |
|---|---|---|---|
| Homepage | **Full two-column + landscape image + Principle card** | Two-column comparison (Eastern Botanical Intelligence / Western Natural Precision) with 3 cards each, plus wide landscape still-life image between header and columns, plus dark Principle card ("Heal the environment. Then activate the growth.") | ~250-300 words total |
| `/book` | **Two-column + landscape image + Principle card** | Same two-column structure as homepage with same image. Slightly tighter card descriptions but full visual treatment retained. | ~200-250 words total |
| `/masterclass` | **Tools distribution treatment** | Restructure to show how East-West tools are stacked across the 6 variants. Less about the philosophy, more about the variant tool layout. Same image. | ~250 words total |

The East-West section is a brand-defining differentiator. It does NOT get aggressively compressed on product pages. It is one of the strongest visual moments on the site — preserve it.

### Solomon's Commitment Statement

**Identical on all three pages.** This is intentional duplication. The commitment is a brand-level emotional anchor that earns its repetition. Same dark card, same wording, same signature.

**Spacing rule:** The card body must be wide enough that lines don't break with a single trailing word. Minimum container max-width: 720px on desktop. Test before deploying.

### Solomon About Section

| Page | Treatment | Word count |
|---|---|---|
| Homepage | **Full bio + pull quote + portrait** | ~70 words |
| `/book` | **Compressed bio + pull quote** (no portrait) | ~40 words |
| `/masterclass` | **Compressed bio + pull quote** (no portrait) | ~40 words |

Full Solomon story lives at /about (planned, not built yet). Product pages link there.

### FAQ

| Page | Treatment | Notes |
|---|---|---|
| Homepage | **Brand-level FAQs** | "What is RE5?" / "Who is this for?" / "Is this evidence-based?" / "Do I need to choose Book or Masterclass?" |
| `/book` | **Book-specific FAQs** | "Will this work for me?" / "$1 trick?" / "I'm on pharma — useful?" / "Why no before-and-afters?" |
| `/masterclass` | **Masterclass-specific FAQs** | "What's in it that's not in the book?" / "Which variant is right for me?" / "Refund policy?" / "Lifetime access?" |

Same FAQ component, different question sets per page.

## Page 1 — Homepage (`index.html` → `/`)

**Job:** Introduce RE5 as a brand. Route traffic to the right product. Capture emails for the 8 Drivers Checklist as the secondary conversion.

**10 sections:**

| # | Section | Purpose | Treatment notes |
|---|---|---|---|
| 1 | Hero | Brand-level promise | Headline: "Hair loss isn't one problem. It's eight." Two CTAs (Book / Masterclass) + email capture for checklist. 3 stat tiles. |
| 2 | Credibility Strip | Numerical authority | Same as Book page: 5,000+ HOURS · 8 DRIVERS · 40 TOOLS · 5 YRS |
| 3 | The 8 Drivers | The diagnostic frame | **Full grid treatment** (4×2 mini-cards) |
| 4 | The 5 Phases | The framework | **Full deep-dive treatment** (concept + 5 phase cards) |
| 5 | East-West | The differentiator | **Full two-column + Principle card** |
| 6 | The Two Paths | Product split | Two cards side-by-side. Book (entry, $1) and Masterclass (full system, $20). Equal visual weight. Each links to its product page. |
| 7 | Solomon's Commitment | Founder accountability | **Identical to other pages** — same dark card |
| 8 | About Solomon | Author credibility | **Full bio + pull quote + portrait** |
| 9 | FAQ | Brand-level objections | **Brand-level FAQs** (4 questions about RE5 the brand, not specific products) |
| 10 | Final CTA + Footer | Email capture + nav | Dark CTA card primarily for 8 Drivers Checklist email capture. Secondary CTAs to both product pages. |

### Locked Homepage Hero Headline
Hair loss isn't one problem.
It's eight.

The bolded "eight" wraps in `<span class="hl-saffron">` (color #E8893D). Locked. Do not propose alternatives without explicit user instruction.

### Locked Two Paths Section (Section 6)

The product split section. Two cards, equal visual weight, paper surface (not dark — the dark card energy is reserved for Section 7 Commitment).
                Two Paths
┌──────────────────────┐    ┌──────────────────────┐
│  THE BOOK            │    │  THE MASTERCLASS     │
│                      │    │                      │
│  $1                  │    │  $20                 │
│                      │    │                      │
│  The 30/70 Protocol  │    │  All 6 variants      │
│  Men's Edition       │    │  Full system         │
│                      │    │                      │
│  Start here if:      │    │  Start here if:      │
│  • You're new        │    │  • You've read the   │
│  • Want to test      │    │    book              │
│  • Need entry point  │    │  • Already on pharma │
│                      │    │  • Want depth        │
│                      │    │                      │
│  [Get the Book →]    │    │  [Explore →]         │
└──────────────────────┘    └──────────────────────┘

This is the routing engine of the homepage. Buyers self-select their path based on which "Start here if" list matches them.

## Page 2 — Book 3 (`book.html` → `/book`)

**Job:** Sell Book 3 specifically. Compress brand-level content to make room for Book-specific depth.

**12 sections** (existing v3-final structure mostly preserved):

| # | Section | Purpose | Treatment notes |
|---|---|---|---|
| 1 | Hero | Product-level promise | "Stop guessing. Start growing your hair back." Hero locked from v3-final. |
| 2 | Credibility Strip | Numerical authority | Same 4 stats |
| 3 | The Problem | What's wrong with industry | Same as v3-final |
| 4 | The 8 Drivers | Diagnostic | **Reference strip treatment** (compressed from current full grid) |
| 5 | The 5 Phases | Framework | **Condensed list treatment** (compressed from current full grid) |
| 6 | East-West | Differentiator | **Brief reference treatment** (compressed from current full version) |
| 7 | 3 Steps to Your Protocol | Buyer journey | Same as v3-final — Read · Build · Run cards |
| 8 | Inside the Book | What's in it | Same as v3-final + Masterclass upsell bar |
| 9 | Solomon's Commitment | Founder accountability | **Identical to homepage** — same dark card |
| 10 | About Solomon | Author credibility | **Compressed bio + pull quote** (no portrait — links to /about) |
| 11 | FAQ | Book-specific objections | **Book-specific FAQs** (4 questions) |
| 12 | Final CTA + Footer | Conversion | Dark CTA card with $1 Book button + Kit email capture |

### Locked Book Hero Headline
Stop guessing.
Start growing your hair back.

The bolded "hair back" wraps in `<span class="hl-saffron">`. Locked verbatim. Do not propose alternatives.

## Page 3 — Masterclass (`masterclass.html` → `/masterclass`)

**Job:** Sell the Masterclass to qualified buyers. Lead with what-you-get, not price. Pricing appears contextually, not as the hero promise.

**12 sections:**

| # | Section | Purpose | Treatment notes |
|---|---|---|---|
| 1 | Hero | Product-level promise | Headline TBD — likely: "The full system. All six variants. One framework." |
| 2 | Credibility Strip | Numerical authority | Same 4 stats — adjust "40 tools" to higher number for full Masterclass scope |
| 3 | What's in the Masterclass | Comprehensive breakdown | List of all components — 6 variants, supplement architecture, day-in-the-life walkthroughs, master tool table |
| 4 | The 8 Drivers | Diagnostic | **Variant-mapped treatment** — each driver shows which variant addresses it most directly |
| 5 | The 5 Phases | Framework | **Phase-by-variant treatment** — how Natural / Hybrid / Pharma differ within each phase |
| 6 | East-West | Differentiator | **Tools distribution treatment** — how East-West tools are stacked across the 6 variants |
| 7 | The 6 Variants | Variant breakdown | Each variant gets a card: who it's for, what's different, expected timeline |
| 8 | Day in the Life | Concrete protocols | 1-3 day-in-the-life walkthroughs to make the protocols tangible |
| 9 | Solomon's Commitment | Founder accountability | **Identical to other pages** |
| 10 | About Solomon | Author credibility | **Compressed bio + pull quote** (no portrait) |
| 11 | FAQ | Masterclass-specific objections | **Masterclass-specific FAQs** |
| 12 | Final CTA + Footer | Conversion | Dark CTA card with $20 Masterclass button + Kit email capture |

### Masterclass Page Tone Notes

The Masterclass page should feel **slightly more premium** than the Book page without crossing into hype. Achieved through:
- More white space between sections
- Slightly larger type on key claims
- The dark Principle card energy used in 1-2 places (not just Sections 9 and 12)
- Component breakdowns at higher visual fidelity (the 6 Variants section deserves real polish)

The Masterclass page should NOT feel like a "premium upgrade" of the Book page — that frames Book as inferior. Instead, it should feel like a **deeper expression of the same brand**.

## Visual Patterns That Repeat Across All 3 Pages

These are non-negotiable across the site:

1. **The eyebrow tag** — IBM Plex Mono 11px / 0.18em letter-spacing / saffron / uppercase. Above every section heading.
2. **The paper surface with 1pt hairline borders.** No drop shadows on cards. Hairlines only.
3. **The dark card as visual punctuation.** Used sparingly per page (3-4 dark surfaces max in 10-12 sections).
4. **The 育 seal as cultural anchor.** Footer corners, inside dark Principle/Commitment cards. Saffron on paper, saffron on dark.
5. **The verb-contrast headlines.** Two parallel verbs in opposing actions. Used in hero headlines and key section headers.
6. **Eyebrow tags identify section purpose** — "THE PROBLEM", "THE FRAMEWORK", "THE COMMITMENT — SIGNED" etc. These guide scrolling readers.

## Top Nav (All 3 Pages)
[ RE5 wordmark ]              [ Book ]   [ Masterclass ]   [ Get the Checklist → ]

- Wordmark on left, links to homepage
- Two product links in middle
- Saffron CTA on right links to email capture (Section 10 of homepage, or to checklist opt-in page when built)
- Sticky on scroll, paper surface with backdrop-blur
- Mobile: collapses to hamburger

## Footer (All 3 Pages, Identical)

Same footer as v3-final. Wordmark + tagline left, link row right (Privacy / Terms / Contact / Masterclass), copy line bottom.

## The 8 Drivers Checklist (Lead Magnet)

The PDF deliverable that drops to subscribers via Kit. 9 pages, A4, brand-faithful editorial design. Source HTML lives in the project repo at `/checklist-source.html`.

Architecture:
- 12 questions (3 answer options each, 0/1/2 points)
- Driver mapping: D1=Q1+Q2, D2=Q3+Q4, D3=Q5+Q12, D4=Q6+Q12, D5=Q7+Q12, D6=Q8, D7=Q9, D8=Q3+Q4
- Stress overlay (Q10+Q11) is a modifier, not a driver
- Output: top 3 ranked drivers + phenotype label match
- Conversion bridge: soft Book CTA only on page 9

Do not change the question count, scoring logic, or phenotype mapping without explicit user instruction.

## Locked Pull Quote (All Solomon About Sections)
"I'm not a dermatologist. I have a map.
This book hands you the map I had to build through trial and error."

Italic, padding-left 20px, border-left 2pt solid saffron. Do not edit the wording.

## Locked Solomon Commitment (All 3 Pages)
I'm not selling you regrowth. I'm selling you the framework that made mine possible.
No fake before-and-afters. No 30-day promises. No hidden upsells.
Read the book. If the framework doesn't deliver on what's promised here, refund the dollar — no questions, no email survey, no exit pop-up. The protocol either earns your trust, or it doesn't.
— Solomon · Founder, RE5

Single dark card, three short paragraphs, signed. Identical across all three pages.

## Future Pages (Out of Scope for Initial Launch)

When the user mentions any of these, flag that they're not yet built:
- `/about` — full Solomon story (referenced from product pages)
- `/checklist` — standalone 8 Drivers Checklist opt-in landing
- `/privacy` and `/terms` — legal pages
- Women's Book landing page (planned next deliverable)
- Future product pages (serum, supplements — not on the immediate roadmap)
- A blog or content section
- Member/login areas

## When This Skill Applies

Apply this skill to:
- Any HTML/CSS work on RE5 website pages
- Section additions, edits, or reorganisations on any of the 3 pages
- Copy edits to locked sections (flag and ask before changing)
- Building the homepage and Masterclass page (use this as the structural reference)
- Refactoring the existing v3-final HTML to become `/book`
- Editing the 8 Drivers Checklist PDF source
- Adding new pages (Privacy, Terms, /about, future products)

If a request would alter a locked section, headline, quote, treatment variation rule, or URL convention, flag it explicitly to the user before proceeding. Locked elements are locked for a reason — usually because the user spent multiple iterations getting them right.
