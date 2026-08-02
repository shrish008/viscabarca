import { useEffect, useRef, useState } from "react";
import { saveLead } from "../lib/leads";
import { buildWhatsAppLink } from "../lib/whatsapp";
import type { ToolId } from "../types";

export function LeadCaptureCard({
  ctaLabel,
  helperText,
  message,
  tool,
  inputs,
  resultSummary,
}: {
  ctaLabel: string;
  helperText?: string;
  message: string;
  tool: ToolId;
  inputs: Record<string, unknown>;
  resultSummary: string;
}) {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const autoSaved = useRef(false);

  useEffect(() => {
    if (autoSaved.current) return;
    autoSaved.current = true;
    saveLead({ tool, action: "session", inputs, resultSummary });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSend() {
    saveLead({ tool, action: "whatsapp_cta", inputs, resultSummary, name, whatsapp });
    const personalized = name.trim() ? `Hi, I'm ${name.trim()}. ${message}` : message;
    window.open(buildWhatsAppLink(personalized), "_blank", "noopener,noreferrer");
  }

  return (
    <div
      className="rounded-2xl p-5 text-cream ring-1 ring-gold/30"
      style={{ background: "linear-gradient(155deg, var(--color-purple-bright), var(--color-purple) 55%, var(--color-purple-deep))" }}
    >
      <p className="font-sans text-lg font-semibold leading-snug text-balance">{ctaLabel}</p>
      {helperText && <p className="text-sm text-cream/75 mt-1.5 leading-relaxed">{helperText}</p>}

      <div className="mt-4 space-y-2">
        <input
          type="text"
          inputMode="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-11 rounded-lg px-3 bg-cream/95 text-ink placeholder:text-ink/40 outline-none focus:ring-2 focus:ring-gold"
        />
        <input
          type="tel"
          inputMode="tel"
          placeholder="Your WhatsApp number (optional)"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          className="w-full h-11 rounded-lg px-3 bg-cream/95 text-ink placeholder:text-ink/40 outline-none focus:ring-2 focus:ring-gold"
        />
      </div>

      <button
        type="button"
        onClick={handleSend}
        className="mt-4 w-full h-12 rounded-full bg-gold text-cream font-semibold text-[15px] active:opacity-90 flex items-center justify-center gap-2"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.5 14.4c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.5-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4.1-.2 0-.4 0-.5 0-.1-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1.1 2.8 1.2 3c.1.2 2.1 3.2 5 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z"/>
          <path d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.3L2 22l4.8-1.5C8.4 21.5 10.2 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.6 0-3.2-.4-4.5-1.2l-.3-.2-3 1 .9-2.9-.2-.3C4.4 15 4 13.5 4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8z"/>
        </svg>
        Make this real — talk to Magical Realm
      </button>
      <p className="text-[11px] text-cream/60 mt-2 text-center">
        Opens WhatsApp with your result pre-filled. We'll never spam you.
      </p>
    </div>
  );
}
