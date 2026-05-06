import React from "react";
import { Answers, DriverKey } from "../../../lib/assessment/types";
import {
  calculateScores,
  getScoreBand,
  internalToDisplay,
  getSeverityLabel,
  getSortedDrivers,
  getFamilyHistoryPoints,
} from "../../../lib/assessment/scoring";
import { assignPhenotype } from "../../../lib/assessment/phenotype";
import {
  GENERAL_PLAN_ITEMS,
  PLAN_CLOSING_DEFAULT,
  PLAN_CLOSING_LOW_PRESSURE,
  PLAN_INTRO_STRESS_TELOGEN,
} from "../../../lib/assessment/copy";
import { HeadlineScore } from "./HeadlineScore";
import { DriverCard } from "./DriverCard";
import { PhenotypeBlock } from "./PhenotypeBlock";
import { LossCurveGraph } from "./LossCurveGraph";
import { PercentileGraph } from "./PercentileGraph";
import { ConceptSolutionBlock } from "./ConceptSolutionBlock";
import { GeneralPlanItem } from "./GeneralPlanItem";
import { CTA } from "./CTA";

interface ResultsPageProps {
  answers: Answers;
}

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

const CONCEPT_THRESHOLD = 5;

export function ResultsPage({ answers }: ResultsPageProps) {
  const scores = calculateScores(answers);
  const phenotype = assignPhenotype(answers);
  const band = getScoreBand(scores.headlineScore);
  const currentAge =
    typeof answers["Q02_AGE"] === "number"
      ? answers["Q02_AGE"]
      : parseInt(answers["Q02_AGE"] as string, 10) || 30;
  const familyHistoryPoints = getFamilyHistoryPoints(answers);

  const sorted = getSortedDrivers(scores.drivers);
  const elevatedDrivers = sorted.filter(
    (d) => d.score >= CONCEPT_THRESHOLD
  );

  const showLossCurve = phenotype.specialCase !== "autoimmune";

  const planClosing =
    phenotype.specialCase === "low_pressure"
      ? PLAN_CLOSING_LOW_PRESSURE
      : PLAN_CLOSING_DEFAULT;

  return (
    <div className="results-page">
      {/* 1 — Headline Score */}
      <HeadlineScore score={scores.headlineScore} band={band} />

      <div className="results-divider" />

      {/* 2 — Driver Cards */}
      <section className="results-section">
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          Your Eight Biological Drivers
        </div>
        <p className="results-lead">
          Your score is the sum of eight underlying biological drivers. Here's
          how each is firing.
        </p>
        <div className="driver-cards-grid">
          {DRIVER_KEYS.map((key) => {
            const display = internalToDisplay(scores.drivers[key]);
            const severity = getSeverityLabel(display);
            return (
              <DriverCard
                key={key}
                driverKey={key}
                displayScore={display}
                severity={severity}
              />
            );
          })}
        </div>
      </section>

      <div className="results-divider" />

      {/* 3 — Phenotype */}
      <PhenotypeBlock phenotype={phenotype} />

      <div className="results-divider" />

      {/* 4 — Loss Curve Graph */}
      {showLossCurve && (
        <>
          <LossCurveGraph
            currentAge={currentAge}
            phenotypeName={phenotype.phenotype}
            stage={phenotype.stage}
            variant={phenotype.variant}
            familyHistoryPoints={familyHistoryPoints}
          />
          <div className="results-divider" />
        </>
      )}

      {/* 5 — Percentile Graph */}
      <PercentileGraph headlineScore={scores.headlineScore} />

      <div className="results-divider" />

      {/* 6 — Concept Solutions */}
      {elevatedDrivers.length > 0 && (
        <>
          <section className="results-section">
            <div className="eyebrow" style={{ marginBottom: 8 }}>
              What to Address
            </div>
            <p className="results-lead">
              Concept-level solutions for your elevated drivers — the
              principles behind what any effective protocol needs to do.
            </p>
            <div className="concept-solutions-list">
              {elevatedDrivers.map((d) => (
                <ConceptSolutionBlock key={d.key} driverKey={d.key} />
              ))}
            </div>
          </section>
          <div className="results-divider" />
        </>
      )}

      {/* 7 — General Plan */}
      <section className="results-section">
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          The Six Foundations
        </div>
        {phenotype.specialCase === "stress_telogen" && (
          <p className="results-lead plan-intro-stress">
            {PLAN_INTRO_STRESS_TELOGEN}
          </p>
        )}
        <p className="results-lead">
          Six habits that support every hair protocol — regardless of your
          phenotype.
        </p>
        <div className="plan-items-list">
          {GENERAL_PLAN_ITEMS.map((item, i) => (
            <GeneralPlanItem key={item.id} item={item} index={i} />
          ))}
        </div>
        <p className="plan-closing">{planClosing}</p>
      </section>

      <div className="results-divider" />

      {/* 8 — CTA */}
      <CTA phenotype={phenotype} />
    </div>
  );
}
