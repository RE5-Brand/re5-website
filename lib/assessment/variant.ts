import { FlagKey, Sex, VariantName } from "./types";

export function recommendVariant(
  sex: Sex,
  pharmaOpenness: string,
  flags: Set<FlagKey>
): VariantName | null {
  const prefix = sex === "M" ? "Men's" : "Women's";

  if (flags.has("existing_pharma")) {
    return `${prefix} Pharma — Optimisation Track` as VariantName;
  }

  switch (pharmaOpenness) {
    case "natural_only":
    case "natural_first":
      return `${prefix} Natural` as VariantName;
    case "hybrid":
      return `${prefix} Hybrid` as VariantName;
    case "full_pharma":
      return `${prefix} Pharma` as VariantName;
    case "existing_pharma":
      return `${prefix} Pharma — Optimisation Track` as VariantName;
    default:
      return `${prefix} Natural` as VariantName;
  }
}
