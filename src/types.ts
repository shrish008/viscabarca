export type EventType =
  | "Wedding"
  | "Reception"
  | "Engagement"
  | "Birthday"
  | "Corporate";

export const EVENT_TYPES: EventType[] = [
  "Wedding",
  "Reception",
  "Engagement",
  "Birthday",
  "Corporate",
];

export interface EventState {
  eventType: EventType | null;
  guestCount: number | null;
  city: string;
  date: string;
  budget: number | null;
  colourPalette: string[];
  name: string;
  whatsapp: string;
}

export const DEFAULT_EVENT_STATE: EventState = {
  eventType: null,
  guestCount: null,
  city: "Chennai",
  date: "",
  budget: null,
  colourPalette: [],
  name: "",
  whatsapp: "",
};

export type ToolId = "decor" | "budget" | "dress";

export type LeadAction = "session" | "whatsapp_cta" | "pdf_export";

export interface Lead {
  id: string;
  timestamp: string;
  tool: ToolId;
  action: LeadAction;
  inputs: Record<string, unknown>;
  resultSummary: string;
  name: string;
  whatsapp: string;
  email: string;
  source: string;
}
