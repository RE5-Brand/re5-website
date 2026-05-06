import React, { useState, useEffect, useRef } from "react";
import { Question as QuestionType } from "../../../lib/assessment/types";

interface QuestionProps {
  question: QuestionType;
  currentAnswer: string | number | undefined;
  onAnswer: (value: string | number) => void;
  onContinue: () => void;
  onBack: () => void;
  canGoBack: boolean;
}

export function Question({
  question,
  currentAnswer,
  onAnswer,
  onContinue,
  onBack,
  canGoBack,
}: QuestionProps) {
  const [localNumeric, setLocalNumeric] = useState(
    currentAnswer !== undefined ? String(currentAnswer) : ""
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (question.type === "numeric_input" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [question.id, question.type]);

  const handleOptionClick = (optionId: string) => {
    onAnswer(optionId);
    // Auto-advance after selection with a short delay for visual feedback
    setTimeout(onContinue, 250);
  };

  const handleNumericSubmit = () => {
    const val = parseInt(localNumeric, 10);
    if (
      !isNaN(val) &&
      question.validation &&
      val >= question.validation.min &&
      val <= question.validation.max
    ) {
      onAnswer(val);
      onContinue();
    }
  };

  const handleNumericKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleNumericSubmit();
  };

  const isNumericValid = () => {
    const val = parseInt(localNumeric, 10);
    return (
      !isNaN(val) &&
      question.validation &&
      val >= question.validation.min &&
      val <= question.validation.max
    );
  };

  return (
    <>
      <div className="question-screen">
        <h2 className="question-text">{question.questionText}</h2>

        {(question.type === "single_select" ||
          question.type === "image_select") &&
          question.options && (
            <div className="options-list">
              {question.options.map((opt) => (
                <button
                  key={opt.id}
                  className={`option-btn ${currentAnswer === opt.id ? "selected" : ""}`}
                  onClick={() => handleOptionClick(opt.id)}
                >
                  <span className="option-indicator" />
                  {opt.text}
                </button>
              ))}
            </div>
          )}

        {question.type === "numeric_input" && (
          <div>
            <div className="numeric-input-wrap">
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                className="numeric-input"
                value={localNumeric}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "");
                  setLocalNumeric(v);
                }}
                onKeyDown={handleNumericKeyDown}
                placeholder="—"
                maxLength={2}
              />
              <span className="numeric-input-label">years old</span>
            </div>
            <div style={{ marginTop: 32 }}>
              <button
                className="btn btn-primary"
                onClick={handleNumericSubmit}
                disabled={!isNumericValid()}
              >
                Continue →
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="question-nav">
        <button
          className="back-btn"
          onClick={onBack}
          disabled={!canGoBack}
        >
          ← Back
        </button>
        <span />
      </div>
    </>
  );
}
