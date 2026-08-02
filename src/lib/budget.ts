import type { EventType } from "../types";

export type BudgetPriority = "Decor" | "Food" | "Photography";

export interface BudgetCategory {
  key: string;
  label: string;
  share: number; // percent, 0-100
  amount: number; // rupees
}

export interface BudgetResult {
  categories: BudgetCategory[];
  perHead: number;
  verdict: "Comfortable" | "Tight" | "You'll need to prioritise";
  verdictNote: string;
}

const BASE_SHARES: Record<string, number> = {
  venue: 22.5,
  catering: 27.5,
  decor: 15,
  photography: 10,
  attire: 12.5,
  invitations: 4,
  misc: 8.5,
};

const LABELS: Record<string, string> = {
  venue: "Venue",
  catering: "Catering",
  decor: "Decor",
  photography: "Photography / Video",
  attire: "Attire & Jewellery",
  invitations: "Invitations & Gifts",
  misc: "Entertainment / Misc / Buffer",
};

const PRIORITY_KEY: Record<BudgetPriority, string> = {
  Decor: "decor",
  Food: "catering",
  Photography: "photography",
};

// Rough planning benchmarks (₹ per guest) for a mid-to-premium Chennai event.
// These are heuristics to give visitors a directional verdict — calibrate
// against real vendor quotes before treating them as authoritative.
const PER_HEAD_BENCHMARK: Record<EventType, { comfortable: number; tight: number }> = {
  Wedding: { comfortable: 2500, tight: 1200 },
  Reception: { comfortable: 2000, tight: 1000 },
  Engagement: { comfortable: 1800, tight: 900 },
  Birthday: { comfortable: 1200, tight: 600 },
  Corporate: { comfortable: 2000, tight: 1000 },
};

function normalizeShares(shares: Record<string, number>): Record<string, number> {
  const total = Object.values(shares).reduce((a, b) => a + b, 0);
  const normalized: Record<string, number> = {};
  for (const key of Object.keys(shares)) {
    normalized[key] = (shares[key] / total) * 100;
  }
  return normalized;
}

export function allocateBudget(
  totalBudget: number,
  priority?: BudgetPriority | null,
): BudgetCategory[] {
  let shares = { ...BASE_SHARES };

  if (priority) {
    const boostKey = PRIORITY_KEY[priority];
    const boost = 5;
    const otherKeys = Object.keys(shares).filter((k) => k !== boostKey);
    const otherTotal = otherKeys.reduce((sum, k) => sum + shares[k], 0);

    shares[boostKey] += boost;
    for (const key of otherKeys) {
      shares[key] -= (shares[key] / otherTotal) * boost;
    }
  }

  shares = normalizeShares(shares);

  return Object.keys(shares).map((key) => {
    const share = shares[key];
    const rawAmount = (share / 100) * totalBudget;
    const amount = Math.round(rawAmount / 100) * 100;
    return { key, label: LABELS[key], share, amount };
  });
}

export function getVerdict(
  eventType: EventType | null,
  guestCount: number,
  totalBudget: number,
): { verdict: BudgetResult["verdict"]; note: string; perHead: number } {
  const perHead = guestCount > 0 ? totalBudget / guestCount : 0;
  const benchmark = eventType ? PER_HEAD_BENCHMARK[eventType] : PER_HEAD_BENCHMARK.Wedding;

  if (perHead >= benchmark.comfortable) {
    return {
      verdict: "Comfortable",
      note: "This budget comfortably covers a premium setup for your guest count — you'll have room to add finishing touches.",
      perHead,
    };
  }

  if (perHead >= benchmark.tight) {
    return {
      verdict: "Tight",
      note: "This is workable, but it's tight — expect to make trade-offs between categories rather than maxing out every one.",
      perHead,
    };
  }

  return {
    verdict: "You'll need to prioritise",
    note: `At this guest count, this budget is below what typical Chennai vendors charge for a premium look — either raise the budget, trim the guest list, or pick 1–2 categories to prioritise and go simpler on the rest.`,
    perHead,
  };
}

export function getBudgetResult(
  eventType: EventType | null,
  guestCount: number,
  totalBudget: number,
  priority?: BudgetPriority | null,
): BudgetResult {
  const categories = allocateBudget(totalBudget, priority);
  const { verdict, note, perHead } = getVerdict(eventType, guestCount, totalBudget);
  return { categories, perHead, verdict, verdictNote: note };
}
