"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/cart-context";

export function CartNavIcon() {
    const { itemCount, openCart } = useCart();

    return (
        <button
            type="button"
            onClick={openCart}
            className="relative w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:text-primary transition-colors"
            aria-label={`Carrito${itemCount > 0 ? ` (${itemCount} productos)` : ""}`}
        >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
                <span
                    className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                    aria-hidden="true"
                >
                    {itemCount > 9 ? "9+" : itemCount}
                </span>
            )}
        </button>
    );
}
