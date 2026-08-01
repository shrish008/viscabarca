import { Link, useNavigate, useLocation } from "react-router-dom";
import { buildWhatsAppLink } from "../lib/whatsapp";
import { LogoMark } from "./Logo";

const NAV_LINKS = [
  { to: "/decor", label: "Decor" },
  { to: "/budget", label: "Budget" },
  { to: "/dress-code", label: "Dress Code" },
];

export function Header({ title }: { title?: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const chatLink = buildWhatsAppLink(
    "Hi Magical Realm! I found you through the AI Event Portal and I'd like to talk about my event.",
  );

  return (
    <header className="sticky top-0 z-30 bg-purple-deep border-b border-gold/15">
      <div className="flex items-center gap-2 px-4 md:px-8 h-16 max-w-6xl mx-auto">
        {title && (
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="flex items-center justify-center w-9 h-9 -ml-1 text-cream/50 hover:text-gold active:opacity-60 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        <Link to="/" aria-label="Magical Realm home" className="flex items-center gap-2 shrink-0">
          <LogoMark size={36} />
        </Link>

        <h1 className="font-display text-lg text-cream truncate tracking-wide ml-1">
          {title ?? "Magical Realm"}
        </h1>

        <nav className="hidden md:flex items-center gap-6 ml-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`eyebrow transition-colors ${
                location.pathname === link.to ? "text-gold" : "text-cream/70 hover:text-gold"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <a
          href={chatLink}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex ml-auto items-center gap-2 h-10 px-4 rounded-full bg-gold text-purple-deep text-sm font-semibold hover:brightness-110 transition"
        >
          Chat on WhatsApp
        </a>
      </div>
    </header>
  );
}
