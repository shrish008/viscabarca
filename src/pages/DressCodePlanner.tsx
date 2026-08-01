import { useMemo, useState } from "react";
import { PageShell, Field, Card } from "../components/PageShell";
import { SectionBadge } from "../components/SectionBadge";
import { Chip } from "../components/Chip";
import { ColorSwatchPicker } from "../components/ColorSwatchPicker";
import { LeadCaptureCard } from "../components/LeadCaptureCard";
import { useEvent } from "../context/EventContext";
import { EVENT_TYPES, type EventType } from "../types";
import {
  DRESS_GROUPS,
  DRESS_VIBES,
  getDressSuggestions,
  type DressGroup,
  type DressSuggestion,
  type DressVibe,
} from "../lib/dressCode";

type Step = "form" | "loading" | "result";

export default function DressCodePlanner() {
  const { event, updateEvent } = useEvent();
  const [step, setStep] = useState<Step>("form");

  const [eventType, setEventType] = useState<EventType | null>(event.eventType);
  const [group, setGroup] = useState<DressGroup>("Friends gang");
  const [vibe, setVibe] = useState<DressVibe>("Traditional");
  const [palette, setPalette] = useState<string[]>(event.colourPalette);
  const [budgetPerPerson, setBudgetPerPerson] = useState("");

  const [suggestions, setSuggestions] = useState<DressSuggestion[]>([]);

  const canSubmit = Boolean(eventType);

  function handleSubmit() {
    if (!canSubmit) return;
    updateEvent({ eventType, colourPalette: palette });
    setSuggestions(getDressSuggestions({ eventType, group, vibe, palette }));
    setStep("loading");
    setTimeout(() => setStep("result"), 600);
  }

  const resultSummary = useMemo(
    () =>
      suggestions
        .map((s) => `${s.title}\n  ${s.menLook}\n  ${s.womenLook}`)
        .join("\n\n"),
    [suggestions],
  );

  const waMessage = `Hi Magical Realm! I used the Dress Code Planner for my ${eventType ?? "event"} (${group}, ${vibe} vibe). Here's what it suggested:\n\n${resultSummary}\n\nPlanning the whole event, not just the outfits?`;

  return (
    <PageShell title="Dress Code Planner">
      {step === "form" && (
        <div className="space-y-6">
          <div>
            <SectionBadge>Dress Code Planner</SectionBadge>
            <p className="text-ink/70 text-sm leading-relaxed">
              Coordinated outfit and colour ideas for your group — no more "poatta enna nu varum".
            </p>
          </div>

          <Field label="Event type">
            <div className="flex flex-wrap gap-2">
              {EVENT_TYPES.map((t) => (
                <Chip key={t} label={t} selected={eventType === t} onClick={() => setEventType(t)} />
              ))}
            </div>
          </Field>

          <Field label="Who's this for?">
            <div className="flex flex-wrap gap-2">
              {DRESS_GROUPS.map((g) => (
                <Chip key={g} label={g} selected={group === g} onClick={() => setGroup(g)} />
              ))}
            </div>
          </Field>

          <Field label="Vibe">
            <div className="flex flex-wrap gap-2">
              {DRESS_VIBES.map((v) => (
                <Chip key={v} label={v} selected={vibe === v} onClick={() => setVibe(v)} />
              ))}
            </div>
          </Field>

          <Field label="Event colour palette (optional, up to 3)">
            <ColorSwatchPicker selected={palette} onChange={setPalette} />
          </Field>

          <Field label="Budget per person (optional)">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="e.g. 3000"
              value={budgetPerPerson}
              onChange={(e) => setBudgetPerPerson(e.target.value)}
              className="w-full h-12 rounded-xl px-4 bg-paper border border-ink/15 outline-none focus:ring-2 focus:ring-gold"
            />
          </Field>

          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmit}
            className="w-full h-12 rounded-full bg-berry text-cream font-semibold disabled:opacity-40 active:opacity-90"
          >
            Show me looks
          </button>
        </div>
      )}

      {step === "loading" && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-10 h-10 rounded-full border-2 border-gold border-t-transparent animate-spin mb-4" />
          <p className="font-serif text-lg text-ink">Coordinating looks for your {group.toLowerCase()}…</p>
          <p className="text-sm text-ink/60 mt-1">Matching colours to your {vibe.toLowerCase()} vibe.</p>
        </div>
      )}

      {step === "result" && (
        <div className="space-y-5">
          <div>
            <SectionBadge>Suggested looks</SectionBadge>
            <h2 className="font-serif text-xl font-semibold text-ink">
              {group} · {vibe}
            </h2>
          </div>

          {suggestions.map((s, i) => (
            <Card key={i}>
              <p className="font-serif font-semibold text-ink capitalize">{s.title}</p>
              <div className="flex gap-2 mt-3">
                {s.colours.map((c) => (
                  <span
                    key={c}
                    className="text-xs font-medium px-3 py-1 rounded-full bg-cream border border-ink/10 text-ink/70"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <div className="mt-3 space-y-1 text-sm text-ink/80">
                <p>{s.menLook}</p>
                <p>{s.womenLook}</p>
              </div>
              <p className="text-xs text-ink/50 mt-3 leading-snug">{s.note}</p>
            </Card>
          ))}

          <LeadCaptureCard
            ctaLabel="Planning the whole event, not just the outfits?"
            helperText="Send this to Magical Realm and let's plan everything around this palette."
            message={waMessage}
            tool="dress"
            inputs={{ eventType, group, vibe, palette, budgetPerPerson }}
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
