// TODO before going live: set VITE_LEAD_WEBHOOK_URL as a real environment
// variable in your hosting provider if you want leads forwarded to a
// CRM/sheet. VITE_WHATSAPP_NUMBER can override the number below per
// environment (e.g. a staging/test number) but isn't required to.

// Digits only, country code first, no "+" or spaces.
export const WHATSAPP_NUMBER =
  import.meta.env.VITE_WHATSAPP_NUMBER || "918122664470";

// Optional: a webhook (Google Apps Script / Zapier / Make / CRM inbox) that
// receives every captured lead as a JSON POST. Leave unset for MVP — leads
// still land safely on WhatsApp and in local lead history either way.
export const LEAD_WEBHOOK_URL = import.meta.env.VITE_LEAD_WEBHOOK_URL || "";

export const BRAND_NAME = "Magical Realm";
export const SOURCE_TAG = "utm=instagram_bio";
