export const PALETTE_OPTIONS: { name: string; hex: string }[] = [
  { name: "Berry", hex: "#6D2E46" },
  { name: "Blush", hex: "#E8C4C4" },
  { name: "Gold", hex: "#9A6B1E" },
  { name: "Ivory", hex: "#F3EBE0" },
  { name: "Emerald", hex: "#1F5A44" },
  { name: "Sage", hex: "#A3B18A" },
  { name: "Royal Blue", hex: "#2A3A78" },
  { name: "Maroon", hex: "#6E1423" },
  { name: "Mustard", hex: "#C9971C" },
  { name: "Coral", hex: "#E07A5F" },
  { name: "Silver Grey", hex: "#B8B8B8" },
  { name: "Pastel Pink", hex: "#F4D9D0" },
];

export function colourNameToHex(name: string): string {
  return PALETTE_OPTIONS.find((c) => c.name.toLowerCase() === name.toLowerCase())?.hex ?? "#A26769";
}

export function ColorSwatchPicker({
  selected,
  onChange,
  max = 3,
}: {
  selected: string[];
  onChange: (colours: string[]) => void;
  max?: number;
}) {
  function toggle(name: string) {
    if (selected.includes(name)) {
      onChange(selected.filter((c) => c !== name));
    } else if (selected.length < max) {
      onChange([...selected, name]);
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      {PALETTE_OPTIONS.map((c) => {
        const isSelected = selected.includes(c.name);
        return (
          <button
            key={c.name}
            type="button"
            onClick={() => toggle(c.name)}
            aria-pressed={isSelected}
            className="flex flex-col items-center gap-1 w-16"
          >
            <span
              className="w-11 h-11 rounded-full border-2 flex items-center justify-center"
              style={{
                backgroundColor: c.hex,
                borderColor: isSelected ? "#9A6B1E" : "rgba(42,35,32,0.15)",
                boxShadow: isSelected ? "0 0 0 2px #F3EBE0, 0 0 0 3.5px #9A6B1E" : "0 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              {isSelected && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span className="text-xs text-ink/70 text-center leading-tight">{c.name}</span>
          </button>
        );
      })}
    </div>
  );
}
