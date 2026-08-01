import { API_BASE_URL, LEAD_WEBHOOK_URL, SOURCE_TAG } from "./config";
import type { Lead, LeadAction, ToolId } from "../types";

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
    // WhatsApp message / PDF itself still carries the result, so nothing
    // critical is lost, only the local audit trail
  }
}

export function saveLead(params: {
  tool: ToolId;
  action?: LeadAction;
  inputs: Record<string, unknown>;
  resultSummary: string;
  name?: string;
  whatsapp?: string;
  email?: string;
}): Lead {
  const lead: Lead = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    tool: params.tool,
    action: params.action ?? "session",
    inputs: params.inputs,
    resultSummary: params.resultSummary,
    name: params.name ?? "",
    whatsapp: params.whatsapp ?? "",
    email: params.email ?? "",
    source: SOURCE_TAG,
  };

  writeStore([...readStore(), lead]);

  if (API_BASE_URL) {
    fetch(`${API_BASE_URL}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
      keepalive: true,
    }).catch(() => {
      // best-effort only — the lead is already safe in localStorage, and
      // the WhatsApp/PDF path the visitor took still carries their result
    });
  }

  if (LEAD_WEBHOOK_URL) {
    fetch(LEAD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
      keepalive: true,
    }).catch(() => {
      // best-effort only
    });
  }

  return lead;
}

export function getLeads(): Lead[] {
  return readStore();
}
