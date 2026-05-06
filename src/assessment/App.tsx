import React, { useState, useCallback } from "react";
import { Answers, Sex } from "../../lib/assessment/types";
import { getQuestionsForSex, PART_NAMES } from "../../lib/assessment/questions";
import { Landing } from "./components/Landing";
import { ProgressBar } from "./components/ProgressBar";
import { Question } from "./components/Question";
import { Checkpoint } from "./components/Checkpoint";
import { EmailGate } from "./components/EmailGate";
import { CalculationAnimation } from "./components/CalculationAnimation";
import { ResultsPage } from "./results/ResultsPage";

type Screen =
  | { type: "landing" }
  | { type: "question"; index: number }
  | { type: "checkpoint"; afterPart: 1 | 2 }
  | { type: "email" }
  | { type: "calculating" }
  | { type: "results" };

export function App() {
  const [screen, setScreen] = useState<Screen>({ type: "landing" });
  const [answers, setAnswers] = useState<Answers>({});
  const [email, setEmail] = useState("");
  const [newsletterOptin, setNewsletterOptin] = useState(false);

  const sex = (answers["Q01_SEX"] as Sex) || "M";
  const questions = getQuestionsForSex(sex);

  const setAnswer = useCallback(
    (questionId: string, value: string | number) => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    },
    []
  );

  const currentQuestion =
    screen.type === "question" ? questions[screen.index] : null;

  const advanceFromQuestion = useCallback(
    (index: number) => {
      const q = questions[index];

      // Check if we just completed a part boundary
      if (q.part === 1 && index + 1 < questions.length && questions[index + 1].part === 2) {
        setScreen({ type: "checkpoint", afterPart: 1 });
        return;
      }
      if (q.part === 2 && index + 1 < questions.length && questions[index + 1].part === 3) {
        setScreen({ type: "checkpoint", afterPart: 2 });
        return;
      }

      // Check if this was the last non-email question
      const nextIndex = index + 1;
      if (nextIndex >= questions.length) {
        setScreen({ type: "email" });
        return;
      }

      const nextQ = questions[nextIndex];
      if (nextQ.type === "email_input") {
        setScreen({ type: "email" });
        return;
      }

      setScreen({ type: "question", index: nextIndex });
    },
    [questions]
  );

  const goBack = useCallback(() => {
    if (screen.type === "question" && screen.index > 0) {
      setScreen({ type: "question", index: screen.index - 1 });
    } else if (screen.type === "question" && screen.index === 0) {
      setScreen({ type: "landing" });
    }
  }, [screen]);

  const continueFromCheckpoint = useCallback(
    (afterPart: 1 | 2) => {
      // Find first question of the next part
      const nextPart = (afterPart + 1) as 2 | 3;
      const idx = questions.findIndex((q) => q.part === nextPart);
      if (idx >= 0) {
        setScreen({ type: "question", index: idx });
      }
    },
    [questions]
  );

  const submitEmail = useCallback(
    (emailValue: string, optin: boolean) => {
      setEmail(emailValue);
      setNewsletterOptin(optin);
      setAnswers((prev) => ({ ...prev, Q26_EMAIL: emailValue }));
      setScreen({ type: "calculating" });
    },
    []
  );

  const showResults = useCallback(() => {
    setScreen({ type: "results" });
  }, []);

  // Compute progress info for the current question
  const getProgressInfo = () => {
    if (screen.type !== "question" || !currentQuestion) return null;

    const part = currentQuestion.part as 1 | 2 | 3;
    const partQuestions = questions.filter((q) => q.part === part && q.type !== "email_input");
    const positionInPart = partQuestions.findIndex((q) => q.id === currentQuestion.id) + 1;

    return {
      part,
      partName: PART_NAMES[part],
      questionInPart: positionInPart,
      totalInPart: partQuestions.length,
    };
  };

  return (
    <>
      <nav className="top-nav">
        <a href="/" className="wordmark">
          RE<span className="five">5</span>
        </a>
      </nav>

      <div className="assessment-shell">
        {screen.type === "landing" && (
          <Landing onStart={() => setScreen({ type: "question", index: 0 })} />
        )}

        {screen.type === "question" && currentQuestion && (() => {
          const progress = getProgressInfo()!;
          return (
            <>
              <ProgressBar
                part={progress.part}
                partName={progress.partName}
                questionInPart={progress.questionInPart}
                totalInPart={progress.totalInPart}
              />
              <Question
                key={currentQuestion.id}
                question={currentQuestion}
                currentAnswer={answers[currentQuestion.id]}
                onAnswer={(value) => {
                  setAnswer(currentQuestion.id, value);
                }}
                onContinue={() => advanceFromQuestion(screen.index)}
                onBack={goBack}
                canGoBack={screen.index > 0}
              />
            </>
          );
        })()}

        {screen.type === "checkpoint" && (
          <Checkpoint
            afterPart={screen.afterPart}
            onContinue={() => continueFromCheckpoint(screen.afterPart)}
          />
        )}

        {screen.type === "email" && (
          <EmailGate onSubmit={submitEmail} />
        )}

        {screen.type === "calculating" && (
          <CalculationAnimation onComplete={showResults} />
        )}

        {screen.type === "results" && (
          <ResultsPage answers={answers} />
        )}
      </div>
    </>
  );
}
