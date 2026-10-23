"use client";

import Image from "@/components/shared/app-image";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { type Product, formatPrice } from "@/data/products";
import { PRODUCT_IMAGES } from "@/data/images";

interface StaticProductCardProps {
    product: Product;
}

export function StaticProductCard({ product }: StaticProductCardProps) {
    const { addItem } = useCart();
    const [added, setAdded] = useState(false);
    // Fallback a vitro1 si el imageKey no existe en el mapa
    const imageSrc = PRODUCT_IMAGES[product.imageKey] ?? PRODUCT_IMAGES["vitro1"] ?? "";

    function handleAddToCart() {
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            // Serialize src string so CartItem is localStorage-safe
            image: imageSrc,
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
    }

    return (
        <article className="haruen-card group overflow-hidden flex flex-col transition-all hover:-translate-y-1 hover:shadow-warm !p-0">
            {/* Imagen */}
            <div className="relative aspect-square overflow-hidden bg-muted">
                <Image
                    src={imageSrc}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Badge de categoría */}
                <div className="absolute top-3 left-3">
                    <span className="text-xs font-bold bg-white/90 text-primary-ink px-2 py-1 rounded-full capitalize">
                        {product.category === "encargo" ? "Por Encargo" : product.category}
                    </span>
                </div>
            </div>

            {/* Info */}
            <div className="p-5 flex-1 flex flex-col gap-3">
                <h3 className="text-lg font-bold group-hover:text-primary-ink transition-colors line-clamp-2 leading-snug">
                    {product.name}
                </h3>

                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {product.description}
                </p>

                <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                    <span className="text-2xl font-bold text-primary-ink">
                        {formatPrice(product.price)}
                    </span>

                    <button
                        type="button"
                        onClick={handleAddToCart}
                        className={`btn-pill text-xs px-4 py-2 transition-all flex items-center gap-1.5 ${
                            added ? "btn-success-state" : "btn-primary-gradient"
                        }`}
                        aria-label={`Agregar ${product.name} al carrito`}
                    >
                        {added ? (
                            <>
                                <Check size={13} />
                                ¡Agregado!
                            </>
                        ) : (
                            <>
                                <ShoppingCart size={13} />
                                Agregar
                            </>
                        )}
                    </button>
                </div>
            </div>
        </article>
    );
}
