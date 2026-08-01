import { Link, useNavigate } from "react-router-dom";

export function Header({ title }: { title?: string }) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur border-b border-ink/10">
      <div className="flex items-center gap-3 px-4 h-14 max-w-xl mx-auto">
        {title ? (
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="flex items-center justify-center w-11 h-11 -ml-2 text-berry active:opacity-60"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : (
          <Link to="/" className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-berry text-cream flex items-center justify-center font-serif italic text-sm ring-1 ring-gold/40">
              M
            </span>
          </Link>
        )}
        <h1 className="font-serif text-lg font-semibold text-ink truncate">
          {title ?? "Magical Realm"}
        </h1>
      </div>
    </header>
  );
}
