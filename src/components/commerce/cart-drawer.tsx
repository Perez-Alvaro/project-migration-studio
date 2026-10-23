"use client";

import Image from "next/image";
import { X, Plus, Minus, ShoppingCart, MessageCircle, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/data/products";
import { buildWhatsAppOrderUrl } from "@/lib/whatsapp";

export function CartDrawer() {
    const { items, itemCount, total, isOpen, closeCart, removeItem, updateQuantity, clearCart } =
        useCart();

    if (!isOpen) return null;

    const whatsappUrl = buildWhatsAppOrderUrl(items);

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                onClick={closeCart}
                aria-hidden="true"
            />

            {/* Drawer */}
            <aside
                role="dialog"
                aria-label="Carrito de compras"
                aria-modal="true"
                className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[400px] bg-card shadow-2xl flex flex-col"
                style={{ borderLeft: "1px solid var(--border)" }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                    <div className="flex items-center gap-3">
                        <ShoppingCart size={20} className="text-primary" />
                        <h2 className="text-lg font-extrabold text-foreground">
                            Tu Carrito
                        </h2>
                        {itemCount > 0 && (
                            <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {itemCount}
                            </span>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={closeCart}
                        className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Cerrar carrito"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-12">
                            <ShoppingCart size={48} className="text-muted-foreground/40" />
                            <p className="text-muted-foreground font-semibold">
                                Tu carrito está vacío
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Agregá productos de nuestra tienda solidaria
                            </p>
                            <button
                                type="button"
                                onClick={closeCart}
                                className="btn-pill btn-primary-gradient text-sm px-6"
                            >
                                Ver Tienda
                            </button>
                        </div>
                    ) : (
                        <ul className="flex flex-col gap-4">
                            {items.map((item) => (
                                <li
                                    key={item.id}
                                    className="flex gap-4 haruen-card !p-3"
                                >
                                    {/* Image */}
                                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                            sizes="80px"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm leading-snug line-clamp-2 text-foreground">
                                            {item.name}
                                        </p>
                                        <p className="text-primary font-extrabold mt-1">
                                            {formatPrice(item.price)}
                                        </p>

                                        {/* Quantity controls */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.id,
                                                        item.quantity - 1
                                                    )
                                                }
                                                className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                                                aria-label="Reducir cantidad"
                                            >
                                                <Minus size={12} />
                                            </button>
                                            <span className="text-sm font-bold w-6 text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.id,
                                                        item.quantity + 1
                                                    )
                                                }
                                                className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                                                aria-label="Aumentar cantidad"
                                            >
                                                <Plus size={12} />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => removeItem(item.id)}
                                                className="ml-auto w-7 h-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                                                aria-label="Eliminar producto"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="px-6 py-5 border-t border-border space-y-4">
                        {/* Total */}
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-muted-foreground">
                                Total estimado
                            </span>
                            <span className="text-2xl font-black text-primary">
                                {formatPrice(total)}
                            </span>
                        </div>

                        {/* Nota envío */}
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            El costo de envío se coordina por WhatsApp. Enviamos
                            por Uber Moto o Andreani. Aceptamos transferencia, Mercado
                            Pago y efectivo.
                        </p>

                        {/* CTA WhatsApp */}
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-pill w-full flex items-center justify-center gap-2 text-sm font-extrabold text-black"
                            style={{
                                background: "#25D366",
                                color: "#000",
                                boxShadow: "0 4px 20px -4px rgba(37,211,102,0.35)",
                                minHeight: "48px",
                            }}
                        >
                            <MessageCircle size={18} />
                            Pedir por WhatsApp
                        </a>

                        <button
                            type="button"
                            onClick={clearCart}
                            className="w-full text-center text-xs text-muted-foreground hover:text-destructive transition-colors py-1"
                        >
                            Vaciar carrito
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
}
