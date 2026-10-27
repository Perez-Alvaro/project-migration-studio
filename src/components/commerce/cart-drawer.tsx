import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { X, Plus, Minus, ShoppingCart, MessageCircle, Trash2, ArrowLeft, CheckCircle2, Download } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/types";
import { resolveProductImage, getProductAssetFallback } from "@/data/images";
import { buildWhatsAppOrderUrl } from "@/lib/whatsapp";
import { downloadReceipt, type ReceiptData } from "@/lib/receipt";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Step = "cart" | "checkout" | "done";

export function CartDrawer() {
  const { items, itemCount, total, isOpen, closeCart, removeItem, updateQuantity, clearCart } = useCart();
  const { whatsappNumber } = useSiteSettings();
  const [step, setStep] = useState<Step>("cart");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dni, setDni] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [sending, setSending] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  useEffect(() => {
    if (!isOpen) {
      setStep("cart");
      setReceipt(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleCheckout(e: FormEvent) {
    e.preventDefault();
    const cleanDni = dni.replace(/\D/g, "");
    if (!name.trim()) {
      toast.error("Escribí tu nombre y apellido para registrar el pedido.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Escribí un correo electrónico válido.");
      return;
    }
    if (!phone.trim()) {
      toast.error("Escribí un teléfono de contacto.");
      return;
    }
    if (!/^[0-9]{7,8}$/.test(cleanDni)) {
      toast.error("Escribí tu DNI sin puntos (7 u 8 números).");
      return;
    }
    if (!address.trim()) {
      toast.error("Escribí la dirección para el envío.");
      return;
    }
    setSending(true);
    const snapshot = [...items];
    const { data: code, error } = await supabase.rpc("create_order", {
      _items: snapshot.map((i) => ({ product_id: i.productId, variant_id: i.variantId, quantity: i.quantity })),
      _customer_name: name.trim(),
      _customer_phone: phone.trim(),
      _customer_email: email.trim(),
      _customer_dni: cleanDni,
      _customer_address: address.trim(),
      _notes: notes.trim(),
    });
    setSending(false);
    if (error || !code) {
      toast.error(error?.message ?? "No pudimos registrar el pedido. Probá de nuevo.");
      return;
    }
    setReceipt({
      code,
      createdAt: new Date(),
      customerName: name.trim(),
      customerEmail: email.trim(),
      customerPhone: phone.trim(),
      customerDni: cleanDni,
      customerAddress: address.trim(),
      notes: notes.trim(),
      items: snapshot,
    });
    setStep("done");
    clearCart();
  }

  function openWhatsApp() {
    if (!receipt) return;
    const url = buildWhatsAppOrderUrl(whatsappNumber, receipt.items, receipt.code, receipt.customerName);
    window.open(url, "_blank", "noopener");
  }

  const titles: Record<Step, string> = { cart: "Tu carrito", checkout: "Tus datos", done: "Pedido registrado" };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm" onClick={closeCart} aria-hidden="true" />
      <aside
        role="dialog"
        aria-label="Carrito de compras"
        aria-modal="true"
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[400px] bg-card shadow-2xl flex flex-col border-l border-border"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            {step === "checkout" ? (
              <button
                type="button"
                onClick={() => setStep("cart")}
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"
                aria-label="Volver al carrito"
              >
                <ArrowLeft size={16} aria-hidden="true" />
              </button>
            ) : step === "done" ? (
              <CheckCircle2 size={20} className="text-primary-ink" aria-hidden="true" />
            ) : (
              <ShoppingCart size={20} className="text-primary-ink" aria-hidden="true" />
            )}
            <h2 className="text-lg font-bold text-foreground">{titles[step]}</h2>
            {itemCount > 0 && step === "cart" && (
              <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 min-w-5 px-1 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={closeCart}
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground"
            aria-label="Cerrar carrito"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {step === "cart" && (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-12">
                  <ShoppingCart size={48} className="text-muted-foreground" aria-hidden="true" />
                  <p className="font-semibold">Tu carrito está esperando</p>
                  <p className="text-sm text-muted-foreground">Elegí una pieza hecha por nuestros alumnos.</p>
                  <Link to="/tienda" onClick={closeCart} className="btn-pill btn-primary-gradient text-sm px-6">
                    Ver la tienda
                  </Link>
                </div>
              ) : (
                <ul className="flex flex-col gap-4">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4 haruen-card !p-3">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                        {(() => {
                          const itemImg = resolveProductImage(item.image, item.slug);
                          return itemImg ? (
                            <img
                              src={itemImg}
                              alt=""
                              onError={(e) => {
                                const fb = getProductAssetFallback(item.slug, item.image);
                                if (fb && e.currentTarget.src !== fb) e.currentTarget.src = fb;
                              }}
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                          ) : null;
                        })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm leading-snug line-clamp-2">{item.name}</p>
                        <p className="text-primary-ink font-bold mt-1">{formatPrice(item.price)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground"
                            aria-label={`Quitar una unidad de ${item.name}`}
                          >
                            <Minus size={12} aria-hidden="true" />
                          </button>
                          <span className="text-sm font-bold w-6 text-center" aria-live="polite">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.maxStock}
                            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground disabled:opacity-40"
                            aria-label={`Sumar una unidad de ${item.name}`}
                          >
                            <Plus size={12} aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="ml-auto w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-destructive"
                            aria-label={`Eliminar ${item.name} del carrito`}
                          >
                            <Trash2 size={16} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-border space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-muted-foreground">Total estimado</span>
                  <span className="text-2xl font-bold text-primary-ink">{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  El envío se coordina por WhatsApp. Enviamos por Uber Moto o Andreani. Aceptamos transferencia, Mercado
                  Pago y efectivo.
                </p>
                <button
                  type="button"
                  onClick={() => setStep("checkout")}
                  className="btn-pill btn-primary-gradient w-full flex items-center justify-center gap-2"
                >
                  Continuar pedido
                </button>
                <button
                  type="button"
                  onClick={clearCart}
                  className="w-full text-center text-xs text-muted-foreground hover:text-destructive py-1"
                >
                  Vaciar carrito
                </button>
              </div>
            )}
          </>
        )}

        {step === "checkout" && (
          <form onSubmit={handleCheckout} className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              <p className="text-sm text-muted-foreground">
                Registramos tu pedido con un número de seguimiento y te generamos un comprobante para descargar.
              </p>
              <div className="space-y-1.5">
                <Label htmlFor="co-name">Nombre y apellido</Label>
                <Input id="co-name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} autoComplete="name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="co-email">Correo electrónico</Label>
                <Input id="co-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={160} autoComplete="email" inputMode="email" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="co-phone">Teléfono</Label>
                  <Input id="co-phone" value={phone} onChange={(e) => setPhone(e.target.value)} required maxLength={40} inputMode="tel" autoComplete="tel" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="co-dni">DNI</Label>
                  <Input id="co-dni" value={dni} onChange={(e) => setDni(e.target.value)} required maxLength={10} inputMode="numeric" placeholder="Sin puntos" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="co-address">Dirección de envío</Label>
                <Input id="co-address" value={address} onChange={(e) => setAddress(e.target.value)} required maxLength={240} autoComplete="street-address" placeholder="Calle, número, barrio, ciudad" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="co-notes">Comentarios (opcional)</Label>
                <Textarea id="co-notes" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={1000} rows={3} placeholder="Horarios de entrega, dedicatoria…" />
              </div>
            </div>
            <div className="px-6 py-5 border-t border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-muted-foreground">Total estimado</span>
                <span className="text-xl font-bold text-primary-ink">{formatPrice(total)}</span>
              </div>
              <button
                type="submit"
                disabled={sending}
                className="btn-pill btn-primary-gradient w-full flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {sending ? "Registrando pedido…" : "Confirmar pedido"}
              </button>
            </div>
          </form>
        )}

        {step === "done" && receipt && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Tu número de pedido es</p>
                <p className="text-3xl font-bold text-primary-ink tracking-wide">{receipt.code}</p>
                <p className="text-sm text-muted-foreground">Anotalo o descargá el comprobante para hacer seguimiento.</p>
              </div>
              <ul className="text-sm divide-y divide-border border border-border rounded-xl px-4">
                {receipt.items.map((item) => (
                  <li key={item.id} className="flex justify-between gap-3 py-2">
                    <span className="min-w-0">{item.quantity} × {item.name}</span>
                    <span className="shrink-0 font-semibold">{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
                <li className="flex justify-between py-2 font-bold">
                  <span>Total</span>
                  <span>{formatPrice(receipt.items.reduce((s, i) => s + i.price * i.quantity, 0))}</span>
                </li>
              </ul>
            </div>
            <div className="px-6 py-5 border-t border-border space-y-3">
              <button
                type="button"
                onClick={() => downloadReceipt(receipt)}
                className="btn-pill btn-primary-gradient w-full flex items-center justify-center gap-2"
              >
                <Download size={18} aria-hidden="true" />
                Descargar comprobante
              </button>
              <button
                type="button"
                onClick={openWhatsApp}
                className="btn-pill btn-sunset-gradient w-full flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} aria-hidden="true" />
                Enviar pedido por WhatsApp
              </button>
              <button
                type="button"
                onClick={closeCart}
                className="w-full text-center text-xs text-muted-foreground hover:text-foreground py-1"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
