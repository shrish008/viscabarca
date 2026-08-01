// TODO before going live: set these as real environment variables
// (VITE_WHATSAPP_NUMBER, VITE_LEAD_WEBHOOK_URL) in your hosting provider —
// do not hard-code real numbers/keys in source.

// Digits only, country code first, no "+" or spaces (e.g. 919876543210).
export const WHATSAPP_NUMBER =
  import.meta.env.VITE_WHATSAPP_NUMBER || "910000000000";

// Optional: a webhook (Google Apps Script / Zapier / Make / CRM inbox) that
// receives every captured lead as a JSON POST. Leave unset for MVP — leads
// still land safely on WhatsApp and in local lead history either way.
export const LEAD_WEBHOOK_URL = import.meta.env.VITE_LEAD_WEBHOOK_URL || "";

export const BRAND_NAME = "Magical Realm";
export const SOURCE_TAG = "utm=instagram_bio";
