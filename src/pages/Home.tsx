import { Link } from "react-router-dom";
import { PageShell } from "../components/PageShell";
import { SectionBadge } from "../components/SectionBadge";
import { ToolCard } from "../components/ToolCard";
import { buildWhatsAppLink } from "../lib/whatsapp";

const TRUST_POINTS = [
  { title: "Premium, not discount", body: "Every setup is styled to look considered — no clutter, no cut corners." },
  { title: "Chennai event specialists", body: "We know the vendors, the venues, and what actually works on the day." },
  { title: "Personal, not templated", body: "Your event, your palette, your story — planned around what you want." },
];

export default function Home() {
  const chatLink = buildWhatsAppLink(
    "Hi Magical Realm! I found you through the AI Event Portal and I'd like to talk about my event.",
  );

  return (
    <PageShell>
      <section className="pt-2 pb-6 text-center">
        <div className="flex justify-center mb-3">
          <span className="w-12 h-12 rounded-full bg-berry text-cream flex items-center justify-center font-serif text-xl">
            M
          </span>
        </div>
        <h1 className="font-serif text-[28px] leading-tight font-semibold text-ink">
          Plan your event in minutes
        </h1>
        <p className="text-ink/70 mt-2 text-[15px] leading-relaxed max-w-sm mx-auto">
          Decor, budget, and dress code — all in one place. By Magical Realm, Chennai's
          premium wedding &amp; event decor studio.
        </p>
      </section>

      <section className="space-y-3">
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

      <section className="mt-8">
        <SectionBadge>Why Magical Realm</SectionBadge>
        <div className="grid grid-cols-1 gap-3">
          {TRUST_POINTS.map((point) => (
            <div key={point.title} className="bg-white rounded-xl border border-ink/10 p-4">
              <p className="font-serif font-semibold text-ink">{point.title}</p>
              <p className="text-sm text-ink/65 mt-1 leading-snug">{point.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 text-center">
        <a
          href={chatLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-berry font-semibold text-sm underline underline-offset-2"
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
