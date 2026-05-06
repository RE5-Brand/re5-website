import React from "react";

interface CheckpointProps {
  afterPart: 1 | 2;
  onContinue: () => void;
}

const CHECKPOINT_DATA = {
  1: {
    summary:
      "We now have your stage, your family pattern, and what's actually happening in the mirror. The heaviest detection from here is lifestyle and body inputs.",
    nextPart: 2 as const,
    nextName: "Your Lifestyle & Body",
    nextTime: "about 2 minutes",
    nextDesc:
      "The daily inputs driving your follicles: sleep, diet, stress, scalp symptoms, and hormonal signals only your body knows about.",
  },
  2: {
    summary:
      "We've mapped your inflammatory, oxidative, hormonal, and scalp-environment drivers — the daily inputs shaping your follicle health.",
    nextPart: 3 as const,
    nextName: "Your Approach",
    nextTime: "about 1 minute, almost done",
    nextDesc:
      "A few final questions about your circulation, structure, and what kind of solution actually fits you.",
  },
};

export function Checkpoint({ afterPart, onContinue }: CheckpointProps) {
  const data = CHECKPOINT_DATA[afterPart];

  return (
    <div className="checkpoint">
      <div className="checkpoint-check">
        ✓ Part {afterPart} complete.
      </div>
      <p className="checkpoint-summary">{data.summary}</p>

      <div className="checkpoint-next-label">
        Coming up — Part {data.nextPart}: {data.nextName}
      </div>
      <div className="checkpoint-next-title">({data.nextTime})</div>
      <p className="checkpoint-next-desc">{data.nextDesc}</p>

      <button className="btn btn-primary" onClick={onContinue}>
        Continue →
      </button>
    </div>
  );
}
