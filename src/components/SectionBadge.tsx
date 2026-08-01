export function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="gold-badge" />
      <span className="text-xs font-semibold tracking-[0.16em] uppercase text-gold">
        {children}
      </span>
    </div>
  );
}
