import React from "react";
import { Answers } from "../../../lib/assessment/types";
import { calculateScores, getScoreBand, internalToDisplay, getSeverityLabel } from "../../../lib/assessment/scoring";
import { assignPhenotype } from "../../../lib/assessment/phenotype";
import { getPercentile, getPercentileCopy } from "../../../lib/assessment/graphs";

interface ResultsPageProps {
  answers: Answers;
}

const DRIVER_LABELS: Record<string, string> = {
  hormonal: "Hormonal",
  inflammatory: "Inflammatory",
  oxidative: "Oxidative",
  vascular: "Vascular",
  nutritional: "Nutritional",
  fibrosis: "Fibrosis",
  growth_signalling: "Growth Signal",
  microenvironment: "Scalp",
};

export function ResultsPage({ answers }: ResultsPageProps) {
  const scores = calculateScores(answers);
  const phenotype = assignPhenotype(answers);
  const band = getScoreBand(scores.headlineScore);
  const percentile = getPercentile(scores.headlineScore);

  return (
    <div style={{ padding: "48px 0 80px" }}>
      {/* Section 1 — Headline Score */}
      <div className="eyebrow" style={{ marginBottom: 12 }}>
        Your RE5 Hair Loss Risk Score
      </div>
      <div
        style={{
          fontSize: "clamp(56px, 8vw, 80px)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 1,
          marginBottom: 8,
        }}
      >
        {scores.headlineScore}{" "}
        <span style={{ fontSize: "0.4em", color: "var(--stone)", fontWeight: 500 }}>
          / 100
        </span>
      </div>
      <div
        className="mono"
        style={{
          fontSize: 13,
          letterSpacing: "0.12em",
          textTransform: "uppercase" as const,
          color: "var(--stone)",
          marginBottom: 8,
        }}
      >
        {band}
      </div>

      <div style={{ height: 1, background: "var(--border)", margin: "32px 0" }} />

      {/* Section 2 — Driver Cards (simplified for Phase 2) */}
      <p style={{ fontSize: 14, color: "var(--soft)", marginBottom: 24 }}>
        Your score is the sum of eight underlying biological drivers. Here's
        how each is firing.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 10,
          marginBottom: 40,
        }}
      >
        {Object.entries(scores.drivers).map(([key, val]) => {
          const display = internalToDisplay(val);
          const severity = getSeverityLabel(display);
          return (
            <div
              key={key}
              style={{
                background: "white",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "18px 16px",
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  color: "var(--saffron)",
                  textTransform: "uppercase" as const,
                  marginBottom: 6,
                }}
              >
                {DRIVER_LABELS[key] || key}
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
                {display}
                <span style={{ fontSize: 14, color: "var(--stone)", fontWeight: 400 }}>
                  {" "}
                  / 5
                </span>
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  color: "var(--stone)",
                  textTransform: "uppercase" as const,
                }}
              >
                {severity}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ height: 1, background: "var(--border)", margin: "32px 0" }} />

      {/* Section 3 — Phenotype */}
      <div className="eyebrow" style={{ marginBottom: 12 }}>
        Your RE5 Phenotype
      </div>
      <div
        style={{
          fontSize: "clamp(24px, 3.5vw, 32px)",
          fontWeight: 800,
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
          marginBottom: 20,
        }}
      >
        {phenotype.phenotype}
      </div>
      {phenotype.specialCase && (
        <div
          className="mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.12em",
            color: "var(--celadon)",
            textTransform: "uppercase" as const,
            marginBottom: 16,
          }}
        >
          Special case: {phenotype.specialCase}
        </div>
      )}
      {phenotype.variant && (
        <div
          style={{
            fontSize: 15,
            color: "var(--soft)",
            lineHeight: 1.6,
            marginBottom: 16,
          }}
        >
          Recommended variant:{" "}
          <strong style={{ color: "var(--ink)" }}>{phenotype.variant}</strong>
        </div>
      )}

      <div style={{ height: 1, background: "var(--border)", margin: "32px 0" }} />

      {/* Section 5 — Percentile */}
      <div className="eyebrow" style={{ marginBottom: 12 }}>
        Where You Sit
      </div>
      <div style={{ fontSize: 15, color: "var(--soft)", lineHeight: 1.65 }}>
        {getPercentileCopy(percentile)}
      </div>

      <div style={{ height: 1, background: "var(--border)", margin: "48px 0 32px" }} />

      {/* Phase 3 placeholder */}
      <div
        className="mono"
        style={{
          fontSize: 11,
          letterSpacing: "0.15em",
          color: "var(--stone)",
          textTransform: "uppercase" as const,
          textAlign: "center" as const,
          padding: "40px 0",
        }}
      >
        Full results page (graphs, concept solutions, plan, CTA) — Phase 3
      </div>
    </div>
  );
}
