import { LEAD_WEBHOOK_URL, SOURCE_TAG } from "./config";
import type { Lead, ToolId } from "../types";

const STORAGE_KEY = "mr_leads";

function readStore(): Lead[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Lead[]) : [];
  } catch {
    return [];
  }
}

function writeStore(leads: Lead[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  } catch {
    // storage unavailable (private browsing / embedded preview) — the
    // WhatsApp message itself still carries the full lead, so nothing is lost
  }
}

export function saveLead(params: {
  tool: ToolId;
  inputs: Record<string, unknown>;
  resultSummary: string;
  name?: string;
  whatsapp?: string;
}): Lead {
  const lead: Lead = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    tool: params.tool,
    inputs: params.inputs,
    resultSummary: params.resultSummary,
    name: params.name ?? "",
    whatsapp: params.whatsapp ?? "",
    source: SOURCE_TAG,
  };

  writeStore([...readStore(), lead]);

  if (LEAD_WEBHOOK_URL) {
    fetch(LEAD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
      keepalive: true,
    }).catch(() => {
      // best-effort only — WhatsApp CTA is the reliable path for the lead
    });
  }

  return lead;
}

export function getLeads(): Lead[] {
  return readStore();
}
