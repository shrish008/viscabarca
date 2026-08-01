import { useMemo, useState } from "react";
import { PageShell, Field, Card } from "../components/PageShell";
import { SectionBadge } from "../components/SectionBadge";
import { Chip } from "../components/Chip";
import { LeadCaptureCard } from "../components/LeadCaptureCard";
import { useEvent } from "../context/EventContext";
import { EVENT_TYPES, type EventType } from "../types";
import { allocateBudget, getVerdict, type BudgetCategory, type BudgetPriority } from "../lib/budget";

const PRIORITIES: BudgetPriority[] = ["Decor", "Food", "Photography"];

function formatRupees(n: number) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

type Step = "form" | "loading" | "result";

export default function BudgetPlanner() {
  const { event, updateEvent } = useEvent();
  const [step, setStep] = useState<Step>("form");

  const [eventType, setEventType] = useState<EventType | null>(event.eventType);
  const [guestCount, setGuestCount] = useState<string>(event.guestCount ? String(event.guestCount) : "");
  const [city, setCity] = useState(event.city || "Chennai");
  const [totalBudget, setTotalBudget] = useState<string>(event.budget ? String(event.budget) : "");
  const [priority, setPriority] = useState<BudgetPriority | null>(null);

  const [categories, setCategories] = useState<BudgetCategory[]>([]);

  const budgetNum = Number(totalBudget) || 0;
  const guestNum = Number(guestCount) || 0;
  const canSubmit = eventType && guestNum > 0 && budgetNum > 0;

  function handleSubmit() {
    if (!canSubmit) return;
    updateEvent({ eventType, guestCount: guestNum, city, budget: budgetNum });
    setCategories(allocateBudget(budgetNum, priority));
    setStep("loading");
    setTimeout(() => setStep("result"), 600);
  }

  function handleSliderChange(key: string, newShare: number) {
    setCategories((prev) => {
      const current = prev.find((c) => c.key === key);
      if (!current) return prev;
      const clamped = Math.max(0, Math.min(100, newShare));
      const delta = clamped - current.share;
      const others = prev.filter((c) => c.key !== key);
      const othersTotal = others.reduce((s, c) => s + c.share, 0) || 1;

      return prev.map((c) => {
        if (c.key === key) {
          const amount = Math.round((clamped / 100) * budgetNum / 100) * 100;
          return { ...c, share: clamped, amount };
        }
        const newCatShare = Math.max(0, c.share - delta * (c.share / othersTotal));
        const amount = Math.round((newCatShare / 100) * budgetNum / 100) * 100;
        return { ...c, share: newCatShare, amount };
      });
    });
  }

  const verdict = useMemo(
    () => getVerdict(eventType, guestNum, budgetNum),
    [eventType, guestNum, budgetNum],
  );

  const resultSummary = useMemo(() => {
    const lines = categories.map(
      (c) => `${c.label}: ${formatRupees(c.amount)} (${Math.round(c.share)}%)`,
    );
    return [
      `Event: ${eventType} in ${city}, ${guestNum} guests`,
      `Total budget: ${formatRupees(budgetNum)} (${formatRupees(verdict.perHead)}/head — ${verdict.verdict})`,
      ...lines,
    ].join("\n");
  }, [categories, eventType, city, guestNum, budgetNum, verdict]);

  const waMessage = `Hi Magical Realm! I used the Budget Planner for my ${eventType ?? "event"} — ${guestNum} guests in ${city}, total budget ${formatRupees(budgetNum)}. Here's my breakdown:\n${resultSummary}\n\nWant us to hit this budget without it looking cheap?`;

  const verdictColor =
    verdict.verdict === "Comfortable"
      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
      : verdict.verdict === "Tight"
      ? "text-gold bg-gold/10 border-gold/30"
      : "text-red-700 bg-red-50 border-red-200";

  return (
    <PageShell title="Budget Planner">
      {step === "form" && (
        <div className="space-y-6">
          <div>
            <SectionBadge>Event Budget Planner</SectionBadge>
            <p className="text-ink/70 text-sm leading-relaxed">
              Tell us the basics — we'll give you an itemized breakdown and an honest verdict.
            </p>
          </div>

          <Field label="Event type">
            <div className="flex flex-wrap gap-2">
              {EVENT_TYPES.map((t) => (
                <Chip key={t} label={t} selected={eventType === t} onClick={() => setEventType(t)} />
              ))}
            </div>
          </Field>

          <Field label="Guest count">
            <input
              type="number"
              inputMode="numeric"
              min={1}
              placeholder="e.g. 300"
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
              className="w-full h-12 rounded-xl px-4 bg-paper border border-ink/15 outline-none focus:ring-2 focus:ring-gold"
            />
          </Field>

          <Field label="City">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full h-12 rounded-xl px-4 bg-paper border border-ink/15 outline-none focus:ring-2 focus:ring-gold"
            />
          </Field>

          <Field label="Total budget (₹)">
            <input
              type="number"
              inputMode="numeric"
              min={1}
              placeholder="e.g. 1500000"
              value={totalBudget}
              onChange={(e) => setTotalBudget(e.target.value)}
              className="w-full h-12 rounded-xl px-4 bg-paper border border-ink/15 outline-none focus:ring-2 focus:ring-gold"
            />
          </Field>

          <Field label="Top priority (optional)">
            <div className="flex flex-wrap gap-2">
              {PRIORITIES.map((p) => (
                <Chip
                  key={p}
                  label={p}
                  selected={priority === p}
                  onClick={() => setPriority(priority === p ? null : p)}
                />
              ))}
            </div>
          </Field>

          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmit}
            className="w-full h-12 rounded-full bg-berry text-cream font-semibold disabled:opacity-40 active:opacity-90"
          >
            See my breakdown
          </button>
        </div>
      )}

      {step === "loading" && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-10 h-10 rounded-full border-2 border-gold border-t-transparent animate-spin mb-4" />
          <p className="font-serif text-lg text-ink">Crunching the numbers for your {eventType?.toLowerCase()}…</p>
          <p className="text-sm text-ink/60 mt-1">Balancing venue, catering, decor and more.</p>
        </div>
      )}

      {step === "result" && (
        <div className="space-y-5">
          <div>
            <SectionBadge>Your breakdown</SectionBadge>
            <h2 className="font-serif text-xl font-semibold text-ink">
              {eventType} · {guestNum} guests · {city}
            </h2>
          </div>

          <Card>
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-ink/60">Per-head cost</span>
              <span className="font-serif text-xl font-semibold text-ink font-tabular">{formatRupees(verdict.perHead)}</span>
            </div>
            <div className={`mt-3 rounded-lg border px-3 py-2 text-sm font-semibold ${verdictColor}`}>
              {verdict.verdict}
            </div>
            <p className="text-sm text-ink/70 mt-2 leading-relaxed">{verdict.note}</p>
          </Card>

          <Card>
            <p className="font-serif font-semibold text-ink mb-3">Itemized breakdown</p>
            <p className="text-xs text-ink/50 mb-4">Drag any slider — the rest rebalance automatically.</p>
            <div className="space-y-4">
              {categories.map((c) => (
                <div key={c.key}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-ink">{c.label}</span>
                    <span className="text-ink/60 font-tabular">
                      {formatRupees(c.amount)} · {Math.round(c.share)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={Math.round(c.share)}
                    onChange={(e) => handleSliderChange(c.key, Number(e.target.value))}
                    className="w-full accent-berry"
                  />
                </div>
              ))}
            </div>
          </Card>

          <LeadCaptureCard
            ctaLabel="Want us to hit this budget without it looking cheap?"
            helperText="Send your breakdown to Magical Realm and we'll tell you exactly what's possible."
            message={waMessage}
            tool="budget"
            inputs={{ eventType, guestCount: guestNum, city, totalBudget: budgetNum, priority }}
            resultSummary={resultSummary}
          />

          <button
            type="button"
            onClick={() => setStep("form")}
            className="w-full h-11 rounded-full border border-ink/15 text-ink/70 font-medium active:bg-paper"
          >
            Edit details
          </button>
        </div>
      )}
    </PageShell>
  );
}
