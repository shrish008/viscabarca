import { useState } from "react";
import { saveLead } from "../lib/leads";
import type { ToolId } from "../types";

export function ExportPdfCard({
  tool,
  inputs,
  resultSummary,
  onExport,
}: {
  tool: ToolId;
  inputs: Record<string, unknown>;
  resultSummary: string;
  // null while the PDF engine is still loading in the background — kept
  // synchronous once ready so the download fires directly inside the tap
  // handler with no `await` in between. Mobile Safari (and increasingly
  // other mobile browsers) revoke "user activation" the moment a click
  // handler awaits something that takes real time, which silently blocks
  // window.open/file-download triggers — this is why that matters here.
  onExport: (() => void) | null;
}) {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);

  function handleDownload() {
    if (!onExport) return;
    saveLead({ tool, action: "pdf_export", inputs, resultSummary, name, whatsapp, email });
    onExport();
  }

  return (
    <div className="rounded-2xl border border-gold/40 bg-paper p-5">
      <div className="flex items-center gap-2">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-gold-deep shrink-0">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinejoin="round" />
          <path d="M14 2v6h6" strokeLinejoin="round" />
          <path d="M9 15h6M9 11.5h6M9 18.5h3" strokeLinecap="round" />
        </svg>
        <p className="font-sans font-semibold text-ink">Export this as a PDF</p>
      </div>
      <p className="text-sm text-ink/65 mt-1.5 leading-relaxed">
        A print-ready copy with the Magical Realm logo, so you can save it or share it with family.
      </p>

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 w-full h-12 rounded-full border-2 border-gold-deep text-gold-deep font-semibold text-[15px] hover:bg-gold/10 transition-colors"
        >
          Download PDF
        </button>
      ) : (
        <div className="mt-4 space-y-2">
          <input
            type="text"
            inputMode="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-11 rounded-lg px-3 bg-cream border border-ink/10 text-ink placeholder:text-ink/40 outline-none focus:ring-2 focus:ring-gold"
          />
          <input
            type="tel"
            inputMode="tel"
            placeholder="WhatsApp number (optional)"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="w-full h-11 rounded-lg px-3 bg-cream border border-ink/10 text-ink placeholder:text-ink/40 outline-none focus:ring-2 focus:ring-gold"
          />
          <input
            type="email"
            inputMode="email"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 rounded-lg px-3 bg-cream border border-ink/10 text-ink placeholder:text-ink/40 outline-none focus:ring-2 focus:ring-gold"
          />
          <button
            type="button"
            onClick={handleDownload}
            disabled={!onExport}
            className="w-full h-12 rounded-full bg-gold-deep text-cream font-semibold text-[15px] hover:brightness-110 transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {!onExport ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-cream/40 border-t-cream animate-spin" />
                Preparing your PDF…
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3v13m0 0l-4-4m4 4l4-4M5 21h14" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Download my PDF
              </>
            )}
          </button>
          <p className="text-[11px] text-ink/45 text-center">
            All fields optional — this just helps our team follow up if you'd like.
          </p>
        </div>
      )}
    </div>
  );
}
