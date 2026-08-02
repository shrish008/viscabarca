import { useEffect, useState } from "react";

/**
 * Prefetches lib/pdf.ts (and jsPDF) while `active`, returning the resolved
 * module once ready (null until then). Callers use this to get a fully
 * synchronous export function by the time the user taps "download" — no
 * `await` inside that click handler. Mobile Safari (and increasingly other
 * mobile browsers) revoke "user activation" the moment a click handler
 * awaits something that takes real time, which silently blocks the
 * resulting window.open/file-download call. Prefetching as soon as the
 * result screen appears gives the fetch several seconds of head start
 * (the user still has to open the export form and fill optional fields)
 * before they can even tap the real download button.
 */
export function usePdfModule(active: boolean) {
  const [pdfModule, setPdfModule] = useState<typeof import("./pdf") | null>(null);
  const [retryTick, setRetryTick] = useState(0);

  useEffect(() => {
    if (!active || pdfModule) return;
    let cancelled = false;
    import("./pdf")
      .then((mod) => {
        if (!cancelled) setPdfModule(mod);
      })
      .catch(() => {
        // transient network failure — retry after a short delay rather
        // than leaving the export button stuck disabled forever
        if (!cancelled) setTimeout(() => setRetryTick((t) => t + 1), 2000);
      });
    return () => {
      cancelled = true;
    };
  }, [active, pdfModule, retryTick]);

  return pdfModule;
}
