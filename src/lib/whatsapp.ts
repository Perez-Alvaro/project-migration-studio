import type { CartItem } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/types";

export function whatsappLink(phone: string, text?: string): string {
  const clean = phone.replace(/\D/g, "");
  return text ? `https://wa.me/${clean}?text=${encodeURIComponent(text)}` : `https://wa.me/${clean}`;
}

/** WhatsApp message for an order already registered in the database. */
export function buildWhatsAppOrderUrl(phone: string, items: CartItem[], code: string, customerName: string): string {
  const lines = items.map((item) => `• ${item.quantity}x ${item.name} — ${formatPrice(item.price * item.quantity)}`);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const message = [
    `¡Hola Haruén! 👋 Soy ${customerName}. Te escribo por mi pedido *${code}*:`,
    "",
    ...lines,
    "",
    `*Total: ${formatPrice(total)}*`,
    "",
    "¿Me confirman disponibilidad, envío y forma de pago? ¡Muchas gracias! 🙌",
  ].join("\n");
  return whatsappLink(phone, message);
}
