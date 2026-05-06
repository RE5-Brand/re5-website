import React from "react";
import { ScoreBand } from "../../../lib/assessment/types";
import { SCORE_BAND_COPY } from "../../../lib/assessment/copy";
import { getScoreBandColor } from "../../../lib/assessment/scoring";

interface HeadlineScoreProps {
  score: number;
  band: ScoreBand;
}

export function HeadlineScore({ score, band }: HeadlineScoreProps) {
  const bandColor = getScoreBandColor(band);

  return (
    <section className="results-section">
      <div className="eyebrow" style={{ marginBottom: 12 }}>
        Your RE5 Hair Loss Risk Score
      </div>
      <div className="headline-score">
        {score}
        <span className="headline-max"> / 100</span>
      </div>
      <div
        className="mono score-band"
        style={{ color: bandColor }}
      >
        {band}
      </div>
      <p className="score-interpretation">{SCORE_BAND_COPY[band]}</p>
    </section>
  );
}
