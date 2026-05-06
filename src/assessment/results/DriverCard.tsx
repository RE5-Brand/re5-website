import React from "react";
import { DriverKey, SeverityLabel } from "../../../lib/assessment/types";
import {
  DRIVER_DISPLAY_NAMES,
  DRIVER_IDS,
  DRIVER_DESCRIPTIONS,
  getDriverConditionalSentence,
} from "../../../lib/assessment/copy";

interface DriverCardProps {
  driverKey: DriverKey;
  displayScore: number;
  severity: SeverityLabel;
}

function severityColor(severity: SeverityLabel): string {
  switch (severity) {
    case "Critical":
      return "var(--ink)";
    case "Elevated":
      return "var(--saffron)";
    case "Moderate":
      return "var(--stone)";
    default:
      return "var(--celadon)";
  }
}

export function DriverCard({ driverKey, displayScore, severity }: DriverCardProps) {
  const conditional = getDriverConditionalSentence(driverKey, severity);
  const color = severityColor(severity);

  return (
    <div className="driver-card">
      <div className="driver-card-header">
        <span className="mono driver-card-id">{DRIVER_IDS[driverKey]}</span>
        <div className="driver-card-score-wrap">
          <span className="driver-card-score">{displayScore}</span>
          <span className="driver-card-max"> / 5</span>
        </div>
      </div>
      <div className="driver-card-name">{DRIVER_DISPLAY_NAMES[driverKey]}</div>
      <div className="mono driver-card-severity" style={{ color }}>
        {severity}
      </div>
      <div className="driver-card-bar">
        <div
          className="driver-card-bar-fill"
          style={{ width: `${(displayScore / 5) * 100}%`, background: color }}
        />
      </div>
      <p className="driver-card-desc">{DRIVER_DESCRIPTIONS[driverKey]}</p>
      {conditional && (
        <p className="driver-card-conditional">{conditional}</p>
      )}
    </div>
  );
}
