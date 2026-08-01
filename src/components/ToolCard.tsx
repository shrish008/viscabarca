import { Link } from "react-router-dom";
import type { ReactNode } from "react";

export function ToolCard({
  to,
  icon,
  title,
  description,
  badge,
}: {
  to: string;
  icon: ReactNode;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <Link
      to={to}
      className="block bg-white rounded-2xl border border-ink/10 shadow-sm p-5 active:scale-[0.99] transition-transform"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 shrink-0 rounded-full bg-cream flex items-center justify-center text-berry">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg font-semibold text-ink">{title}</h3>
            {badge && (
              <span className="text-[10px] uppercase tracking-wide font-semibold text-gold bg-gold/10 px-2 py-0.5 rounded-full">
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-ink/70 mt-1 leading-snug">{description}</p>
        </div>
        <svg
          className="shrink-0 mt-1 text-ink/30"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Link>
  );
}
