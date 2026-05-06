import React from "react";
import { DriverKey } from "../../../lib/assessment/types";
import { CONCEPT_SOLUTIONS, DRIVER_IDS } from "../../../lib/assessment/copy";

interface ConceptSolutionBlockProps {
  driverKey: DriverKey;
}

export function ConceptSolutionBlock({ driverKey }: ConceptSolutionBlockProps) {
  const solution = CONCEPT_SOLUTIONS[driverKey];

  return (
    <div className="concept-solution">
      <div className="concept-header">
        <span className="mono concept-id">{DRIVER_IDS[driverKey]}</span>
        <h3 className="concept-title">{solution.title}</h3>
      </div>
      <p className="concept-mechanism">{solution.mechanism}</p>
      <ol className="concept-principles">
        {solution.principles.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ol>
      <p className="concept-closing">{solution.closing}</p>
    </div>
  );
}
