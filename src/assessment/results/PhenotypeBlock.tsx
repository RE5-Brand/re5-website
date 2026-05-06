import React from "react";
import { PhenotypeResult } from "../../../lib/assessment/types";
import {
  PATTERN_PARAGRAPHS,
  STAGE_PARAGRAPHS,
  SPECIAL_CASE_PARAGRAPHS,
} from "../../../lib/assessment/copy";
import { getPatternName } from "../../../lib/assessment/phenotype";

interface PhenotypeBlockProps {
  phenotype: PhenotypeResult;
}

export function PhenotypeBlock({ phenotype }: PhenotypeBlockProps) {
  if (phenotype.specialCase) {
    const paras = SPECIAL_CASE_PARAGRAPHS[phenotype.specialCase];
    if (paras) {
      return (
        <section className="results-section">
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            Your RE5 Phenotype
          </div>
          <div className="phenotype-name">{phenotype.phenotype}</div>
          <div className="mono special-case-label">
            {phenotype.specialCase.replace(/_/g, " ")}
          </div>
          {paras.map((p, i) => (
            <p key={i} className="phenotype-para">
              {p}
            </p>
          ))}
        </section>
      );
    }
  }

  const isMultiDriver = phenotype.phenotype.includes("Multi-Driver Cascade");

  let patternKey: string;
  if (isMultiDriver) {
    patternKey = "Multi-Driver Cascade";
  } else if (phenotype.primaryDriver) {
    patternKey = getPatternName(phenotype.primaryDriver);
  } else {
    patternKey = "Androgen-Dominant";
  }

  const patternParagraph = PATTERN_PARAGRAPHS[patternKey];
  const stageParagraph = phenotype.stage
    ? STAGE_PARAGRAPHS[phenotype.stage]
    : null;

  return (
    <section className="results-section">
      <div className="eyebrow" style={{ marginBottom: 12 }}>
        Your RE5 Phenotype
      </div>
      <div className="phenotype-name">{phenotype.phenotype}</div>
      {phenotype.variant && (
        <div className="phenotype-variant">
          Recommended variant:{" "}
          <strong>{phenotype.variant}</strong>
        </div>
      )}
      {patternParagraph && (
        <p className="phenotype-para">{patternParagraph}</p>
      )}
      {stageParagraph && (
        <p className="phenotype-para">{stageParagraph}</p>
      )}
    </section>
  );
}
