import { Link } from "react-router-dom";
import { buildWhatsAppLink } from "../lib/whatsapp";
import { LogoMark } from "./Logo";

export function Footer() {
  const chatLink = buildWhatsAppLink(
    "Hi Magical Realm! I found you through the AI Event Portal and I'd like to talk about my event.",
  );

  return (
    <footer className="bg-purple-deep text-cream mt-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr_1fr] gap-8 md:gap-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <LogoMark size={36} />
              <span className="font-display text-lg tracking-wide">Magical Realm</span>
            </div>
            <p className="text-sm text-cream/65 leading-relaxed max-w-xs">
              Premium wedding &amp; event decor, Chennai. Plan decor, budget, and dress code — then
              let's build it for real.
            </p>
          </div>

          <div>
            <p className="eyebrow text-gold mb-3">Planning tools</p>
            <ul className="space-y-2 text-sm text-cream/75">
              <li><Link to="/decor" className="hover:text-gold transition-colors">Decor & Stage Planner</Link></li>
              <li><Link to="/budget" className="hover:text-gold transition-colors">Event Budget Planner</Link></li>
              <li><Link to="/dress-code" className="hover:text-gold transition-colors">Dress Code Planner</Link></li>
            </ul>
          </div>

          <div>
            <p className="eyebrow text-gold mb-3">Talk to us</p>
            <a
              href={chatLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-gold text-purple-deep text-sm font-semibold hover:brightness-110 transition"
            >
              Chat on WhatsApp
            </a>
            <p className="text-sm text-cream/50 mt-3">+91 81226 64470</p>
          </div>
        </div>

        <div className="border-t border-cream/10 mt-10 pt-6 text-xs text-cream/40">
          © {new Date().getFullYear()} Magical Realm. Chennai.
        </div>
      </div>
    </footer>
  );
}
