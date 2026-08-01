import { Link } from "react-router-dom";
import { PageShell } from "../components/PageShell";
import { SectionBadge } from "../components/SectionBadge";
import { ToolCard } from "../components/ToolCard";
import { Reveal } from "../components/Reveal";
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

function Hero() {
  const chatLink = buildWhatsAppLink(
    "Hi Magical Realm! I found you through the AI Event Portal and I'd like to talk about my event.",
  );

  return (
    <section className="relative hero-glow overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-4 md:px-8 pt-14 pb-16 md:pt-24 md:pb-24 text-center md:text-left">
        <div className="md:grid md:grid-cols-[1.2fr_1fr] md:items-center md:gap-12">
          <div className="animate-rise">
            <p className="eyebrow text-gold mb-4">Magical Realm · Chennai</p>
            <h1 className="font-display text-cream text-[40px] leading-[1.05] md:text-[64px] max-w-[14ch] mx-auto md:mx-0">
              Plan your event{" "}
              <span className="font-script shimmer-gold text-[1.3em] leading-none inline-block normal-case">
                beautifully
              </span>
            </h1>
            <p className="text-cream/70 mt-6 text-[16px] md:text-lg leading-relaxed max-w-md mx-auto md:mx-0">
              Decor, budget, and dress code — three tools, one afternoon, no guesswork. Built by
              Chennai's premium wedding &amp; event decor studio.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <a
                href={chatLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-gold text-purple-deep font-semibold hover:brightness-110 transition"
              >
                Chat on WhatsApp
              </a>
              <a
                href="#tools"
                className="inline-flex items-center justify-center h-12 px-6 rounded-full border border-cream/25 text-cream font-semibold hover:border-gold/60 hover:text-gold transition-colors"
              >
                Explore the tools
              </a>
            </div>
          </div>

          <div className="hidden md:block relative h-72" aria-hidden="true">
            <div className="absolute inset-0 rounded-[2rem] border border-gold/25" />
            <div className="absolute inset-6 rounded-[1.5rem] border border-gold/15" />
            <span className="absolute inset-0 flex items-center justify-center font-script text-gold/70 text-[7rem] leading-none">
              M
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <PageShell hero={<Hero />}>
      <section id="tools" className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 scroll-mt-20">
        <Reveal>
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
        </Reveal>
        <Reveal delay={80}>
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
        </Reveal>
        <Reveal delay={160}>
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
        </Reveal>
      </section>

      <section className="mt-14 md:mt-20">
        <Reveal>
          <SectionBadge>Why Magical Realm</SectionBadge>
        </Reveal>
        <div className="flex md:grid md:grid-cols-3 gap-3 md:gap-6 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 pb-1 snap-x snap-mandatory">
          {TRUST_POINTS.map((point, i) => (
            <Reveal key={point.title} delay={i * 80} className="snap-start shrink-0 w-[248px] md:w-auto">
              <div className="h-full bg-paper rounded-2xl border border-ink/10 p-5">
                <div className="w-9 h-9 rounded-full bg-cream flex items-center justify-center text-purple mb-3">
                  {point.icon}
                </div>
                <p className="font-display text-[15px] tracking-wide text-ink leading-snug">{point.title}</p>
                <p className="text-sm text-ink/65 mt-1.5 leading-snug">{point.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <p className="text-center md:text-left text-xs text-ink/40 mt-12">
        Already started?{" "}
        <Link to="/budget" className="underline">
          Continue planning
        </Link>
      </p>
    </PageShell>
  );
}
