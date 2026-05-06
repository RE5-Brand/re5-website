type EventName =
  | "assessment_started"
  | "question_answered"
  | "checkpoint_reached"
  | "email_submitted"
  | "results_viewed"
  | "cta_clicked_primary"
  | "cta_clicked_secondary"
  | "assessment_abandoned";

type EventParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: EventName, params?: EventParams): void {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", name, params);
  }
}
