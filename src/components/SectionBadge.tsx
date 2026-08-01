export function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="gold-badge" />
      <span className="eyebrow text-gold">{children}</span>
    </div>
  );
}
