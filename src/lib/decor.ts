import type { EventType } from "../types";

export type DecorSetting = "Indoor" | "Outdoor";
export type StageSize = "Small" | "Medium" | "Large";
export type DecorTheme =
  | "Traditional South Indian"
  | "Floral"
  | "Pastel Minimal"
  | "Royal"
  | "Modern"
  | "Fusion";
export type BudgetBand = "Under ₹50k" | "₹50k–1.5L" | "₹1.5L–3L" | "₹3L+";

export const DECOR_THEMES: DecorTheme[] = [
  "Traditional South Indian",
  "Floral",
  "Pastel Minimal",
  "Royal",
  "Modern",
  "Fusion",
];

export const BUDGET_BANDS: BudgetBand[] = ["Under ₹50k", "₹50k–1.5L", "₹1.5L–3L", "₹3L+"];

const QUALITY_ANCHOR =
  "Premium, elegant, professionally styled event decor, magazine-quality composition, soft natural lighting";

export interface DecorPromptInput {
  eventType: EventType | null;
  setting: DecorSetting;
  stageSize: StageSize;
  guestCount: number | null;
  budgetBand: BudgetBand;
  theme: DecorTheme;
  colourPalette: string[];
  freeText: string;
}

export function buildDecorPrompt(input: DecorPromptInput): string {
  const eventLabel = input.eventType ?? "event";
  const palette = input.colourPalette.length
    ? input.colourPalette.join(", ")
    : "elegant neutral";

  const parts = [
    QUALITY_ANCHOR,
    `Premium ${input.theme} ${eventLabel} stage decoration`,
    input.setting.toLowerCase(),
    `${palette} colour scheme`,
    "elegant Indian event decor",
    `${input.stageSize.toLowerCase()} scale stage`,
    `${input.budgetBand} setup scale`,
    "professional event photography, realistic, high detail, no text, no watermark",
  ];

  if (input.freeText.trim()) {
    parts.push(input.freeText.trim());
  }

  return parts.filter(Boolean).join(", ");
}

export interface DecorConcept {
  id: string;
  label: string;
  pattern: "arch" | "canopy" | "drape" | "backdrop";
}

const CONCEPT_STYLES: { pattern: DecorConcept["pattern"]; label: string }[] = [
  { pattern: "arch", label: "Classic floral arch" },
  { pattern: "canopy", label: "Layered fabric canopy" },
  { pattern: "drape", label: "Draped elegance backdrop" },
  { pattern: "backdrop", label: "Structured statement backdrop" },
];

export function getDecorConcepts(theme: DecorTheme): DecorConcept[] {
  return CONCEPT_STYLES.map((style, i) => ({
    id: `${theme}-${i}`,
    label: style.label,
    pattern: style.pattern,
  }));
}
