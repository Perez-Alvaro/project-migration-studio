import { Link } from "@tanstack/react-router";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { formatPrice, stockLabel, type ProductDTO } from "@/lib/types";
import { StockBadge } from "@/components/commerce/stock-badge";
import { resolveProductImage, getProductAssetFallback } from "@/data/images";
import { ShoppingBag as ShoppingBagIcon } from "lucide-react";

export function ProductCard({ product }: { product: ProductDTO }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const rawImageUrl = product.images[0]?.url;
  const imageUrl = resolveProductImage(rawImageUrl, product.slug);
  const hasVariants = product.variants.length > 0;
  const stock = stockLabel(product.stock, product.lowStockThreshold);
  const soldOut = stock.tone === "out";

  function handleAdd() {
    addItem({
      productId: product.id,
      variantId: null,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: imageUrl,
      maxStock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <article className="haruen-card group overflow-hidden flex flex-col transition-all hover:-translate-y-1 hover:shadow-warm !p-0">
      <Link
        to="/tienda/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-square overflow-hidden bg-muted"
        aria-label={`Ver ${product.name}`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.images[0]?.alt || product.name}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              const fallback = getProductAssetFallback(product.slug, rawImageUrl);
              if (fallback && e.currentTarget.src !== fallback) {
                e.currentTarget.src = fallback;
              }
            }}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted">
            <ShoppingBagIcon size={28} className="opacity-40" />
          </div>
        )}
        {product.category && (
          <span className="absolute top-3 left-3 text-xs font-bold bg-background/90 text-foreground px-2 py-1 rounded-full">
            {product.category.name}
          </span>
        )}
        {stock.tone !== "ok" && (
          <span className="absolute top-3 right-3">
            <StockBadge stock={product.stock} threshold={product.lowStockThreshold} />
          </span>
        )}
      </Link>

      <div className="p-5 flex-1 flex flex-col gap-3">
        <h3 className="text-lg font-bold line-clamp-2 leading-snug">
          <Link to="/tienda/$slug" params={{ slug: product.slug }} className="hover:underline underline-offset-4">
            {product.name}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{product.description}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary-ink">{formatPrice(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>
          {hasVariants ? (
            <Link
              to="/tienda/$slug"
              params={{ slug: product.slug }}
              className="btn-pill btn-primary-gradient text-xs px-4 py-2"
            >
              Elegir opción
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              disabled={soldOut}
              className={`btn-pill text-xs px-4 py-2 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${
                added ? "btn-success-state" : "btn-primary-gradient"
              }`}
              aria-label={soldOut ? `${product.name} sin stock` : `Agregar ${product.name} al carrito`}
            >
              {added ? <Check size={13} aria-hidden="true" /> : <ShoppingCart size={13} aria-hidden="true" />}
              {soldOut ? "Sin stock" : added ? "¡Agregado!" : "Agregar"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
