import React from "react";

interface ProgressBarProps {
  part: 1 | 2 | 3;
  partName: string;
  questionInPart: number;
  totalInPart: number;
}

export function ProgressBar({
  part,
  partName,
  questionInPart,
  totalInPart,
}: ProgressBarProps) {
  const pct = (questionInPart / totalInPart) * 100;

  return (
    <div className="progress-header">
      <div className="progress-meta">
        <span className="progress-part">
          Part {part} of 3 — {partName}
        </span>
        <span className="progress-count">
          Question {questionInPart} of {totalInPart}
        </span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
