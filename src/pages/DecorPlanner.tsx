import { useMemo, useState } from "react";
import { PageShell, Field } from "../components/PageShell";
import { SectionBadge } from "../components/SectionBadge";
import { Chip } from "../components/Chip";
import { ColorSwatchPicker } from "../components/ColorSwatchPicker";
import { DecorConceptCard } from "../components/DecorConceptCard";
import { LeadCaptureCard } from "../components/LeadCaptureCard";
import { useEvent } from "../context/EventContext";
import { EVENT_TYPES, type EventType } from "../types";
import {
  BUDGET_BANDS,
  DECOR_THEMES,
  buildDecorPrompt,
  getDecorConcepts,
  type BudgetBand,
  type DecorConcept,
  type DecorSetting,
  type DecorTheme,
  type StageSize,
} from "../lib/decor";

const SETTINGS: DecorSetting[] = ["Indoor", "Outdoor"];
const STAGE_SIZES: StageSize[] = ["Small", "Medium", "Large"];

type Step = "form" | "loading" | "result";

export default function DecorPlanner() {
  const { event, updateEvent } = useEvent();
  const [step, setStep] = useState<Step>("form");

  const [eventType, setEventType] = useState<EventType | null>(event.eventType);
  const [setting, setSetting] = useState<DecorSetting>("Indoor");
  const [stageSize, setStageSize] = useState<StageSize>("Medium");
  const [guestCount, setGuestCount] = useState(event.guestCount ? String(event.guestCount) : "");
  const [budgetBand, setBudgetBand] = useState<BudgetBand>("₹50k–1.5L");
  const [theme, setTheme] = useState<DecorTheme>("Traditional South Indian");
  const [palette, setPalette] = useState<string[]>(event.colourPalette);
  const [freeText, setFreeText] = useState("");

  const [concepts, setConcepts] = useState<DecorConcept[]>([]);
  const [selected, setSelected] = useState<DecorConcept | null>(null);
  const [regenKey, setRegenKey] = useState(0);

  const canSubmit = Boolean(eventType);

  function runGeneration() {
    const list = getDecorConcepts(theme);
    const shuffled = regenKey % 2 === 1 ? [...list].reverse() : list;
    setConcepts(shuffled);
    setSelected(shuffled[0]);
  }

  function handleSubmit() {
    if (!canSubmit) return;
    updateEvent({ eventType, guestCount: Number(guestCount) || event.guestCount, colourPalette: palette });
    setStep("loading");
    setTimeout(() => {
      runGeneration();
      setStep("result");
    }, 900);
  }

  function handleRegenerate() {
    setStep("loading");
    setRegenKey((k) => k + 1);
    setTimeout(() => {
      runGeneration();
      setStep("result");
    }, 700);
  }

  const prompt = useMemo(
    () =>
      buildDecorPrompt({
        eventType,
        setting,
        stageSize,
        guestCount: Number(guestCount) || null,
        budgetBand,
        theme,
        colourPalette: palette,
        freeText,
      }),
    [eventType, setting, stageSize, guestCount, budgetBand, theme, palette, freeText],
  );

  const resultSummary = `${selected?.label ?? "Decor concept"} — ${theme}, ${setting}, ${stageSize} stage, ${palette.join("/") || "brand palette"}${freeText ? `. Notes: ${freeText}` : ""}`;

  const waMessage = `Hi Magical Realm! I love this decor direction for my ${eventType ?? "event"}: ${selected?.label ?? "concept"} — ${theme}, ${setting}, ${palette.join(", ") || "your signature palette"}${freeText ? `. I was picturing: "${freeText}"` : ""}. Can you build this for real?`;

  return (
    <PageShell title="Decor & Stage Planner">
      {step === "form" && (
        <div className="space-y-6">
          <div>
            <SectionBadge>Decor & Stage Planner</SectionBadge>
            <p className="text-ink/70 text-sm leading-relaxed">
              Tell us your event and theme — we'll put together concept directions you can hand straight to our design team.
            </p>
          </div>

          <Field label="Event type">
            <div className="flex flex-wrap gap-2">
              {EVENT_TYPES.map((t) => (
                <Chip key={t} label={t} selected={eventType === t} onClick={() => setEventType(t)} />
              ))}
            </div>
          </Field>

          <Field label="Setting">
            <div className="flex flex-wrap gap-2">
              {SETTINGS.map((s) => (
                <Chip key={s} label={s} selected={setting === s} onClick={() => setSetting(s)} />
              ))}
            </div>
          </Field>

          <Field label="Stage / mandap size">
            <div className="flex flex-wrap gap-2">
              {STAGE_SIZES.map((s) => (
                <Chip key={s} label={s} selected={stageSize === s} onClick={() => setStageSize(s)} />
              ))}
            </div>
          </Field>

          <Field label="Approx. guest count">
            <input
              type="number"
              inputMode="numeric"
              min={1}
              placeholder="e.g. 300"
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
              className="w-full h-12 rounded-xl px-4 bg-white border border-ink/15 outline-none focus:ring-2 focus:ring-gold"
            />
          </Field>

          <Field label="Budget band">
            <div className="flex flex-wrap gap-2">
              {BUDGET_BANDS.map((b) => (
                <Chip key={b} label={b} selected={budgetBand === b} onClick={() => setBudgetBand(b)} />
              ))}
            </div>
          </Field>

          <Field label="Theme / style">
            <div className="flex flex-wrap gap-2">
              {DECOR_THEMES.map((t) => (
                <Chip key={t} label={t} selected={theme === t} onClick={() => setTheme(t)} />
              ))}
            </div>
          </Field>

          <Field label="Colour palette (up to 3)">
            <ColorSwatchPicker selected={palette} onChange={setPalette} />
          </Field>

          <Field label="Anything specific in your mind?">
            <textarea
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              placeholder="e.g. a floating floral canopy with hanging lanterns…"
              rows={3}
              className="w-full rounded-xl px-4 py-3 bg-white border border-ink/15 outline-none focus:ring-2 focus:ring-gold resize-none"
            />
          </Field>

          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmit}
            className="w-full h-12 rounded-full bg-berry text-cream font-semibold disabled:opacity-40 active:opacity-90"
          >
            Generate concepts
          </button>
        </div>
      )}

      {step === "loading" && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-10 h-10 rounded-full border-2 border-gold border-t-transparent animate-spin mb-4" />
          <p className="font-serif text-lg text-ink">Styling your {theme.toLowerCase()} stage…</p>
          <p className="text-sm text-ink/60 mt-1">This usually takes a few seconds.</p>
        </div>
      )}

      {step === "result" && (
        <div className="space-y-5">
          <div>
            <SectionBadge>Concept directions</SectionBadge>
            <h2 className="font-serif text-xl font-semibold text-ink">
              {theme} · {setting} · {stageSize}
            </h2>
            <p className="text-xs text-ink/50 mt-2 leading-relaxed">
              These are styled concept previews, not final AI renders — tap one, then our design
              team will turn it into a real, on-site build.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {concepts.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelected(c)}
                className={`rounded-2xl text-left ${selected?.id === c.id ? "ring-2 ring-gold" : ""}`}
              >
                <DecorConceptCard concept={c} palette={palette} />
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleRegenerate}
              className="flex-1 h-11 rounded-full border border-ink/15 text-ink/70 font-medium active:bg-cream-soft"
            >
              Regenerate
            </button>
            <button
              type="button"
              onClick={() => setStep("form")}
              className="flex-1 h-11 rounded-full border border-ink/15 text-ink/70 font-medium active:bg-cream-soft"
            >
              Refine
            </button>
          </div>

          <details className="text-xs text-ink/40">
            <summary className="cursor-pointer select-none">Prompt we'd use for full AI renders</summary>
            <p className="mt-2 leading-relaxed">{prompt}</p>
          </details>

          <LeadCaptureCard
            ctaLabel="Love a look? Magical Realm will build it for real →"
            helperText="Send your favourite direction and we'll turn it into an on-site design."
            message={waMessage}
            tool="decor"
            inputs={{ eventType, setting, stageSize, guestCount, budgetBand, theme, palette, freeText, selected: selected?.label }}
            resultSummary={resultSummary}
          />
        </div>
      )}
    </PageShell>
  );
}
