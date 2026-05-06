import { PhenotypeResult } from "./types";

const KIT_FORM_UID = "5fb651eb30";
const KIT_FORM_URL = `https://app.kit.com/forms/${KIT_FORM_UID}/subscriptions`;

interface KitPayload {
  email_address: string;
  fields: Record<string, string>;
}

export function subscribeToKit(
  email: string,
  phenotype: PhenotypeResult,
  newsletterOptin: boolean
): void {
  const fields: Record<string, string> = {
    source: "assessment",
    phenotype: phenotype.phenotype,
    headline_score: String(phenotype.score),
  };

  if (phenotype.variant) {
    fields.variant = phenotype.variant;
  }
  if (phenotype.stage) {
    fields.stage = phenotype.stage;
  }
  if (phenotype.primaryDriver) {
    fields.primary_driver = phenotype.primaryDriver;
  }
  if (phenotype.specialCase) {
    fields.special_case = phenotype.specialCase;
  }
  fields.newsletter_optin = newsletterOptin ? "yes" : "no";

  const payload: KitPayload = { email_address: email, fields };

  fetch(KIT_FORM_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  }).catch(() => {
    // silent — don't block the user flow
  });
}
