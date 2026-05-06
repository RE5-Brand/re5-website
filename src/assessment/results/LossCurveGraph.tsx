import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { generateLossCurve } from "../../../lib/assessment/graphs";
import { Stage, VariantName } from "../../../lib/assessment/types";

interface LossCurveGraphProps {
  currentAge: number;
  phenotypeName: string;
  stage: Stage | null;
  variant: VariantName | null;
  familyHistoryPoints: number;
}

export function LossCurveGraph({
  currentAge,
  phenotypeName,
  stage,
  variant,
  familyHistoryPoints,
}: LossCurveGraphProps) {
  const data = generateLossCurve(
    currentAge,
    phenotypeName,
    stage,
    variant,
    familyHistoryPoints
  );

  return (
    <section className="results-section">
      <div className="eyebrow" style={{ marginBottom: 12 }}>
        Projected Hair Density
      </div>
      <p className="graph-subtitle">
        Two trajectories: what happens without intervention, and what's
        possible with your matched RE5 protocol.
      </p>
      <div className="graph-container">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="savedGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#E8893D" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#E8893D" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="age"
              tick={{ fontSize: 11, fontFamily: "IBM Plex Mono" }}
              stroke="var(--stone)"
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fontFamily: "IBM Plex Mono" }}
              stroke="var(--stone)"
              tickFormatter={(v: number) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                fontFamily: "IBM Plex Mono",
                fontSize: 12,
                background: "var(--paper)",
                border: "1px solid var(--border)",
                borderRadius: 6,
              }}
              formatter={(value) => [`${Math.round(Number(value))}%`]}
            />
            <Area
              type="monotone"
              dataKey="re5Trajectory"
              stroke="#E8893D"
              strokeWidth={2.5}
              fill="url(#savedGradient)"
              name="With RE5 Protocol"
            />
            <Area
              type="monotone"
              dataKey="noIntervention"
              stroke="var(--stone)"
              strokeWidth={2}
              strokeDasharray="6 4"
              fill="none"
              name="No Intervention"
            />
            <ReferenceLine
              x={currentAge}
              stroke="var(--celadon)"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              label={{
                value: "You are here",
                position: "top",
                fontSize: 10,
                fontFamily: "IBM Plex Mono",
                fill: "var(--celadon)",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="graph-disclosure">
        Projections are modelled estimates based on your assessment inputs and
        published research — not clinical predictions. Individual outcomes vary
        with adherence, genetics, and cofactors.
      </p>
    </section>
  );
}
