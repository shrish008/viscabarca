export function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`min-h-11 px-4 rounded-full border text-[15px] font-medium transition-colors ${
        selected
          ? "bg-berry border-berry text-cream"
          : "bg-white border-ink/15 text-ink active:bg-cream-soft"
      }`}
    >
      {label}
    </button>
  );
}
