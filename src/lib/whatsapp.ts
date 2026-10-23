import { CartItem } from "@/contexts/cart-context";
import { formatPrice, WHATSAPP_PHONE } from "@/data/products";

/**
 * Genera una URL de WhatsApp con el payload del carrito pre-armado.
 * Ejemplo de mensaje:
 *   Hola Haruén! Me gustaría realizar el siguiente pedido:
 *   - 2x Platos Decorativos — $17.000
 *   - 1x Joyería Artesanal — $5.500
 *   Total: $22.500
 *   Muchas gracias 🙌
 */
export function buildWhatsAppOrderUrl(items: CartItem[]): string {
    if (items.length === 0) return `https://wa.me/${WHATSAPP_PHONE}`;

    const lines = items.map((item) => {
        const subtotal = item.price * item.quantity;
        return `• ${item.quantity}x ${item.name} — ${formatPrice(subtotal)}`;
    });

    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const message = [
        "¡Hola Haruén! 👋 Me gustaría realizar el siguiente pedido:",
        "",
        ...lines,
        "",
        `*Total: ${formatPrice(total)}*`,
        "",
        "Por favor me confirman disponibilidad y forma de pago. ¡Muchas gracias! 🙌",
    ].join("\n");

    const encoded = encodeURIComponent(message);
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`;
}
