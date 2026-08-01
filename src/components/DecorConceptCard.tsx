import type { DecorConcept } from "../lib/decor";
import { colourNameToHex } from "./ColorSwatchPicker";

function PatternArt({ pattern, primary, secondary }: { pattern: DecorConcept["pattern"]; primary: string; secondary: string }) {
  switch (pattern) {
    case "arch":
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path d="M40 190V90a60 60 0 01120 0v100" fill="none" stroke={secondary} strokeWidth="6" />
          {[...Array(9)].map((_, i) => (
            <circle key={i} cx={40 + i * 15} cy={90 - Math.sin((i / 8) * Math.PI) * 55} r="6" fill={primary} opacity={0.85} />
          ))}
        </svg>
      );
    case "canopy":
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {[0, 1, 2, 3].map((i) => (
            <path
              key={i}
              d={`M${20 + i * 40} 20 Q${40 + i * 40} 70 ${20 + i * 40} 130`}
              fill="none"
              stroke={i % 2 ? secondary : primary}
              strokeWidth="8"
              strokeLinecap="round"
              opacity={0.8}
            />
          ))}
          <circle cx="100" cy="150" r="10" fill={secondary} />
        </svg>
      );
    case "drape":
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path d="M10 40 Q100 90 190 40" fill="none" stroke={primary} strokeWidth="5" opacity={0.8} />
          <path d="M10 70 Q100 120 190 70" fill="none" stroke={secondary} strokeWidth="5" opacity={0.8} />
          <path d="M10 100 Q100 150 190 100" fill="none" stroke={primary} strokeWidth="5" opacity={0.6} />
        </svg>
      );
    case "backdrop":
    default:
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <rect x="30" y="30" width="140" height="140" rx="70" fill="none" stroke={secondary} strokeWidth="5" />
          <rect x="50" y="50" width="100" height="100" rx="50" fill="none" stroke={primary} strokeWidth="3" opacity={0.7} />
        </svg>
      );
  }
}

export function DecorConceptCard({
  concept,
  palette,
}: {
  concept: DecorConcept;
  palette: string[];
}) {
  const primary = colourNameToHex(palette[0] ?? "Berry");
  const secondary = colourNameToHex(palette[1] ?? "Gold");

  return (
    <div className="rounded-2xl overflow-hidden border border-ink/10 bg-white shadow-sm">
      <div
        className="aspect-[4/5] flex items-center justify-center p-8"
        style={{ background: `linear-gradient(160deg, ${primary}1a, ${secondary}22)` }}
      >
        <PatternArt pattern={concept.pattern} primary={primary} secondary={secondary} />
      </div>
      <div className="px-3 py-2.5 flex items-center justify-between">
        <span className="text-sm font-medium text-ink">{concept.label}</span>
        <span className="text-[10px] uppercase tracking-wide text-ink/40 font-semibold">Concept preview</span>
      </div>
    </div>
  );
}
