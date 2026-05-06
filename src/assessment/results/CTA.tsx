import React from "react";
import { PhenotypeResult } from "../../../lib/assessment/types";

interface CTAProps {
  phenotype: PhenotypeResult;
}

export function CTA({ phenotype }: CTAProps) {
  if (phenotype.specialCase === "autoimmune") {
    return (
      <section className="results-section cta-section">
        <div className="eyebrow" style={{ marginBottom: 12 }}>
          Recommended Next Step
        </div>
        <h3 className="cta-title">See a Dermatologist</h3>
        <p className="cta-body">
          Your loss pattern suggests a possible autoimmune condition that
          requires medical diagnosis before any hair restoration protocol is
          appropriate. Book a dermatologist appointment, get the diagnosis
          confirmed, and come back if a protocol is the right next step.
        </p>
      </section>
    );
  }

  if (phenotype.specialCase === "low_pressure") {
    return (
      <section className="results-section cta-section">
        <div className="eyebrow" style={{ marginBottom: 12 }}>
          Your Next Step
        </div>
        <h3 className="cta-title">Stay Ahead of the Curve</h3>
        <p className="cta-body">
          Your biological pressure is genuinely low — you don't need an active
          intervention protocol right now. The six foundational habits above are
          your protocol. Stay on them, and revisit this assessment in 12 months
          to check your trajectory.
        </p>
        <a href="/" className="btn btn-secondary cta-btn">
          Back to RE5
        </a>
      </section>
    );
  }

  if (phenotype.specialCase === "stress_telogen") {
    return (
      <section className="results-section cta-section">
        <div className="eyebrow" style={{ marginBottom: 12 }}>
          Your Next Step
        </div>
        <h3 className="cta-title">Identify and Resolve the Trigger</h3>
        <p className="cta-body">
          Telogen effluvium is often substantially recoverable. Your first job
          is identifying the stress event, illness, medication change, or
          deficiency that triggered the shedding — then resolving it. The
          supportive habits above accelerate recovery once the trigger is
          addressed.
        </p>
        <a href="/" className="btn btn-primary cta-btn">
          Learn More About RE5
        </a>
      </section>
    );
  }

  const variantName = phenotype.variant ?? "Men's Natural";
  const isOptimisation = variantName.includes("Optimisation");

  return (
    <section className="results-section cta-section">
      <div className="eyebrow" style={{ marginBottom: 12 }}>
        Your Matched Protocol
      </div>
      <h3 className="cta-title">{variantName}</h3>
      <p className="cta-body">
        {isOptimisation
          ? "You're already on pharmaceutical treatment. The RE5 Quick-Start Guide — Optimisation Track shows you how to build the full supporting protocol around what you're already taking, so every intervention reinforces the others."
          : `Based on your phenotype, stage, and treatment preferences, your matched entry point is the ${variantName} Quick-Start Guide. It covers exactly which interventions to start, in what order, and why — tailored to your firing drivers.`}
      </p>
      <a href="/book.html" className="btn btn-primary cta-btn">
        Get Your Quick-Start Guide
      </a>
    </section>
  );
}
