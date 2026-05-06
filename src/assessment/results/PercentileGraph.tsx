import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import {
  generateDistributionCurve,
  getPercentile,
  getPercentileCopy,
} from "../../../lib/assessment/graphs";

interface PercentileGraphProps {
  headlineScore: number;
}

export function PercentileGraph({ headlineScore }: PercentileGraphProps) {
  const data = generateDistributionCurve();
  const percentile = getPercentile(headlineScore);
  const copy = getPercentileCopy(percentile);

  return (
    <section className="results-section">
      <div className="eyebrow" style={{ marginBottom: 12 }}>
        Where You Sit
      </div>
      <div className="percentile-callout">
        <span className="percentile-number">{percentile}</span>
        <span className="percentile-suffix">th percentile</span>
      </div>
      <p className="percentile-copy">{copy}</p>
      <div className="graph-container">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="bellGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#2F5F6B" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#2F5F6B" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="score"
              tick={{ fontSize: 10, fontFamily: "IBM Plex Mono" }}
              stroke="var(--stone)"
              tickCount={6}
            />
            <YAxis hide />
            <Area
              type="monotone"
              dataKey="density"
              stroke="#2F5F6B"
              strokeWidth={2}
              fill="url(#bellGradient)"
            />
            <ReferenceLine
              x={headlineScore}
              stroke="#E8893D"
              strokeWidth={2}
              label={{
                value: "You",
                position: "top",
                fontSize: 10,
                fontFamily: "IBM Plex Mono",
                fill: "#E8893D",
                fontWeight: 600,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
