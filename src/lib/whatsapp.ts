import { WHATSAPP_NUMBER } from "./config";

export function buildWhatsAppLink(message: string, phone: string = WHATSAPP_NUMBER) {
  const cleanPhone = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message: string, phone?: string) {
  window.open(buildWhatsAppLink(message, phone), "_blank", "noopener,noreferrer");
}
