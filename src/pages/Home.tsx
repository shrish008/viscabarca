import { Link } from "react-router-dom";
import { PageShell } from "../components/PageShell";
import { SectionBadge } from "../components/SectionBadge";
import { ToolCard } from "../components/ToolCard";
import { buildWhatsAppLink } from "../lib/whatsapp";

const TRUST_POINTS = [
  {
    title: "Premium, not discount",
    body: "Every setup is styled to look considered — no clutter, no cut corners.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 3l2.2 4.9L19 9l-3.8 3.5L16 18l-4-2.6L8 18l.8-5.5L5 9l4.8-1.1z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Chennai event specialists",
    body: "We know the vendors, the venues, and what actually works on the day.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 21s7-6.1 7-11.5A7 7 0 005 9.5C5 14.9 12 21 12 21z" strokeLinejoin="round" />
        <circle cx="12" cy="9.5" r="2.4" />
      </svg>
    ),
  },
  {
    title: "Personal, not templated",
    body: "Your event, your palette, your story — planned around what you want.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 20s-7-4.2-9-9.1C1.6 7.4 3.4 4.8 6.4 4.5c1.8-.2 3.4.7 4.6 2.1 1.2-1.4 2.8-2.3 4.6-2.1 3 .3 4.8 2.9 3.4 6.4C17 15.8 12 20 12 20z" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function Home() {
  const chatLink = buildWhatsAppLink(
    "Hi Magical Realm! I found you through the AI Event Portal and I'd like to talk about my event.",
  );

  return (
    <PageShell>
      <section className="relative -mx-4 -mt-5 px-4 pt-10 pb-8 hero-glow overflow-hidden">
        <div className="relative text-center animate-rise">
          <div className="flex justify-center mb-5">
            <span className="w-14 h-14 rounded-full bg-berry text-cream flex items-center justify-center font-serif text-2xl italic ring-1 ring-gold/40 shadow-[0_6px_24px_-8px_rgba(109,46,70,0.55)]">
              M
            </span>
          </div>
          <p className="eyebrow text-gold mb-3">Magical Realm · Chennai</p>
          <h1 className="font-serif text-[34px] leading-[1.1] font-medium text-ink max-w-[19ch] mx-auto">
            Plan your event <em className="italic text-berry">in minutes</em>
          </h1>
          <p className="text-ink/70 mt-4 text-[16px] leading-relaxed max-w-sm mx-auto">
            Decor, budget, and dress code — three tools, one afternoon, no guesswork. Built by
            Chennai's premium wedding &amp; event decor studio.
          </p>
        </div>
      </section>

      <section className="space-y-3 mt-2">
        <ToolCard
          to="/decor"
          badge="AI"
          title="Decor & Stage Planner"
          description="See stage and mandap decor concepts styled to your theme and palette."
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 20V10a8 8 0 0116 0v10" strokeLinecap="round" />
              <path d="M4 20h16M9 20v-4a3 3 0 016 0v4" strokeLinecap="round" />
            </svg>
          }
        />
        <ToolCard
          to="/budget"
          title="Event Budget Planner"
          description="Get an itemized breakdown of your budget and an honest 'will it cover it?' verdict."
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="6" width="18" height="13" rx="2" />
              <path d="M3 10h18M7 15h4" strokeLinecap="round" />
            </svg>
          }
        />
        <ToolCard
          to="/dress-code"
          title="Dress Code Planner"
          description="Coordinated outfit and colour suggestions for your family and friends."
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M8 4l4 3 4-3 3 4-3 2v11H5V10L2 8z" strokeLinejoin="round" />
            </svg>
          }
        />
      </section>

      <section className="mt-10">
        <SectionBadge>Why Magical Realm</SectionBadge>
        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1 snap-x snap-mandatory">
          {TRUST_POINTS.map((point) => (
            <div
              key={point.title}
              className="snap-start shrink-0 w-[248px] bg-paper rounded-2xl border border-ink/10 p-4"
            >
              <div className="w-9 h-9 rounded-full bg-cream flex items-center justify-center text-berry mb-3">
                {point.icon}
              </div>
              <p className="font-serif font-semibold text-ink leading-snug">{point.title}</p>
              <p className="text-sm text-ink/65 mt-1 leading-snug">{point.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-9 text-center">
        <a
          href={chatLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-berry font-semibold text-sm underline underline-offset-4 decoration-gold/50"
        >
          Prefer to just talk to us? Chat on WhatsApp →
        </a>
      </section>

      <p className="text-center text-xs text-ink/40 mt-10">
        Already started?{" "}
        <Link to="/budget" className="underline">
          Continue planning
        </Link>
      </p>
    </PageShell>
  );
}
