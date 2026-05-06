import React from "react";

interface LandingProps {
  onStart: () => void;
}

export function Landing({ onStart }: LandingProps) {
  return (
    <div className="landing">
      <div className="eyebrow">Free Assessment</div>
      <h1 className="landing-title">RE5 Hair Phenotype Assessment</h1>
      <p className="landing-sub">
        26 questions. Under 4 minutes. Get your full driver map, projected
        trajectory, and personalised plan.
      </p>
      <p className="landing-sub" style={{ marginBottom: 0 }}>
        Free. No credit card. We'll show you exactly what's driving your hair
        loss across 8 biological systems — and what to do about it.
      </p>
      <div style={{ marginTop: 36 }}>
        <button className="btn btn-primary" onClick={onStart}>
          Start the Assessment →
        </button>
      </div>
      <ul className="landing-features">
        <li>
          <span className="eyebrow" style={{ fontSize: 11, marginBottom: 0 }}>
            What you'll get at the end:
          </span>
        </li>
        <li>Your RE5 Hair Phenotype (your specific pattern)</li>
        <li>8-driver map showing what's firing</li>
        <li>Projected hair trajectory with and without intervention</li>
        <li>Where you sit vs. everyone else who's taken this</li>
        <li>A personalised plan you can start tonight</li>
      </ul>
      <p className="landing-tagline">Less noise. More follicles.</p>
    </div>
  );
}
