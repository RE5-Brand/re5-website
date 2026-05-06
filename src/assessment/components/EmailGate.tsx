import React, { useState, useRef, useEffect } from "react";

interface EmailGateProps {
  onSubmit: (email: string, newsletterOptin: boolean) => void;
}

export function EmailGate({ onSubmit }: EmailGateProps) {
  const [email, setEmail] = useState("");
  const [optin, setOptin] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) onSubmit(email, optin);
  };

  return (
    <div className="question-screen email-gate">
      <div className="eyebrow" style={{ marginBottom: 16 }}>
        Almost there
      </div>
      <h2 className="email-gate-title">
        Your RE5 Hair Phenotype is ready.
      </h2>
      <p className="email-gate-sub">
        We've analysed your responses across 8 biological drivers. Your
        phenotype, driver map, projected hair trajectory, and personalised
        plan are one click away.
      </p>
      <p className="email-gate-sub" style={{ fontSize: 14 }}>
        Enter your email to see your results — and we'll send you the
        science-backed plan that matches your phenotype, free.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="email-field">
          <input
            ref={inputRef}
            type="email"
            className="email-input"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!isValid}
          >
            Show My Results →
          </button>
        </div>

        <label className="newsletter-checkbox">
          <input
            type="checkbox"
            checked={optin}
            onChange={(e) => setOptin(e.target.checked)}
          />
          <span>
            Yes, send me the RE5 newsletter — protocols, science, and case
            studies. Unsubscribe anytime.
          </span>
        </label>
      </form>

      <p className="email-trust">
        We never sell your data. No spam. No fake before-and-afters.
      </p>
    </div>
  );
}
