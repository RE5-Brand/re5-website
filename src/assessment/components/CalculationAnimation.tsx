import React, { useState, useEffect } from "react";

const DRIVERS = [
  { id: "D1", name: "Hormonal" },
  { id: "D2", name: "Inflammatory" },
  { id: "D3", name: "Oxidative" },
  { id: "D4", name: "Vascular" },
  { id: "D5", name: "Nutritional" },
  { id: "D6", name: "Fibrosis" },
  { id: "D7", name: "Growth Signal" },
  { id: "D8", name: "Scalp" },
];

interface CalculationAnimationProps {
  onComplete: () => void;
}

export function CalculationAnimation({ onComplete }: CalculationAnimationProps) {
  const [litCount, setLitCount] = useState(0);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLitCount((prev) => {
        if (prev >= DRIVERS.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (litCount >= DRIVERS.length) {
      const timer = setTimeout(() => setShowStatus(true), 400);
      return () => clearTimeout(timer);
    }
  }, [litCount]);

  useEffect(() => {
    if (showStatus) {
      const timer = setTimeout(onComplete, 1200);
      return () => clearTimeout(timer);
    }
  }, [showStatus, onComplete]);

  return (
    <div className="calculation">
      <div className="eyebrow" style={{ marginBottom: 32 }}>
        Analysing your profile
      </div>

      <div className="calc-drivers">
        {DRIVERS.map((d, i) => (
          <div
            key={d.id}
            className={`calc-driver ${i < litCount ? "lit" : ""}`}
          >
            <span className="calc-driver-id">{d.id}</span>
            <span className="calc-driver-name">{d.name}</span>
          </div>
        ))}
      </div>

      <div className={`calc-status ${showStatus ? "visible" : ""}`}>
        Phenotype identified.
      </div>
    </div>
  );
}
