import type { CartItem } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/types";

export interface ReceiptData {
  code: string;
  createdAt: Date;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerDni: string;
  customerAddress: string;
  notes: string;
  items: CartItem[];
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Self-contained, printable HTML receipt for an order. */
export function buildReceiptHtml(order: ReceiptData): string {
  const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const rows = order.items
    .map(
      (item) => `<tr>
        <td>${escapeHtml(item.name)}</td>
        <td style="text-align:center">${item.quantity}</td>
        <td style="text-align:right">${formatPrice(item.price)}</td>
        <td style="text-align:right">${formatPrice(item.price * item.quantity)}</td>
      </tr>`,
    )
    .join("");
  const fecha = new Intl.DateTimeFormat("es-AR", { dateStyle: "long", timeStyle: "short" }).format(order.createdAt);

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<title>Comprobante de pedido ${escapeHtml(order.code)} — Haruén</title>
<style>
  body { font-family: Arial, sans-serif; color: #152129; max-width: 640px; margin: 32px auto; padding: 0 20px; }
  h1 { font-size: 22px; margin: 0 0 4px; }
  .sub { color: #555; margin: 0 0 24px; }
  .code { display: inline-block; background: #ef7225; color: #fff; font-weight: bold; padding: 6px 14px; border-radius: 999px; font-size: 18px; }
  h2 { font-size: 14px; text-transform: uppercase; letter-spacing: .05em; color: #0e474e; border-bottom: 1px solid #ddd; padding-bottom: 6px; margin: 28px 0 10px; }
  p { margin: 4px 0; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th { text-align: left; font-size: 12px; color: #555; border-bottom: 2px solid #0e474e; padding: 6px 4px; }
  td { padding: 8px 4px; border-bottom: 1px solid #eee; }
  .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 12px; }
  .foot { margin-top: 36px; font-size: 12px; color: #777; border-top: 1px solid #ddd; padding-top: 12px; }
  @media print { body { margin: 0; } }
</style>
</head>
<body>
  <h1>Centro Educativo Terapéutico Haruén</h1>
  <p class="sub">Comprobante de pedido · ${fecha}</p>
  <p><span class="code">Pedido ${escapeHtml(order.code)}</span></p>

  <h2>Datos del comprador</h2>
  <p><strong>${escapeHtml(order.customerName)}</strong></p>
  <p>DNI: ${escapeHtml(order.customerDni)}</p>
  <p>Correo: ${escapeHtml(order.customerEmail)}</p>
  <p>Teléfono: ${escapeHtml(order.customerPhone)}</p>
  <p>Dirección: ${escapeHtml(order.customerAddress)}</p>
  ${order.notes ? `<p>Comentarios: ${escapeHtml(order.notes)}</p>` : ""}

  <h2>Detalle del pedido</h2>
  <table>
    <thead><tr><th>Producto</th><th style="text-align:center">Cant.</th><th style="text-align:right">Precio</th><th style="text-align:right">Subtotal</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <p class="total">Total: ${formatPrice(total)}</p>

  <p class="foot">Este comprobante no es una factura. El pago y el envío se coordinan por WhatsApp con el equipo de Haruén. Guardalo para hacer seguimiento de tu pedido.</p>
</body>
</html>`;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

/** Download the receipt as a printable HTML file (iOS-safe via share sheet when possible). */
export async function downloadReceipt(order: ReceiptData) {
  const html = buildReceiptHtml(order);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const filename = `comprobante-${order.code}.html`;
  const file = new File([blob], filename, { type: blob.type });
  const touch = matchMedia("(pointer: coarse)").matches;
  if (touch && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: filename });
      return;
    } catch (e) {
      if ((e as DOMException).name === "AbortError") return;
    }
  }
  downloadBlob(blob, filename);
}
