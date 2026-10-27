import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Minus, Plus, ShoppingCart, Truck, CreditCard } from "lucide-react";
import { productQuery } from "@/lib/queries";
import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/types";
import { ProductCard } from "@/components/commerce/product-card";
import { StockBadge } from "@/components/commerce/stock-badge";
import { resolveProductImage, getProductAssetFallback } from "@/data/images";
import { RouteError } from "@/components/shared/page-header";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tienda/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!data) throw notFound();
    return { name: data.product.name, description: data.product.description };
  },
  head: ({ loaderData, params }) => {
    const title = loaderData ? `${loaderData.name} | Tienda Haruén` : "Producto no disponible | Tienda Haruén";
    const description = loaderData?.description.slice(0, 155) ?? "Este producto ya no está disponible.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(loaderData ? [] : [{ name: "robots", content: "noindex" }]),
      ],
      links: [{ rel: "canonical", href: `/tienda/${params.slug}` }],
    };
  },
  errorComponent: ({ error }) => <RouteError error={error} />,
  notFoundComponent: () => (
    <div className="haruen-container pt-[140px] pb-20 text-center">
      <h1 className="text-2xl font-bold mb-2">Este producto ya no está disponible</h1>
      <p className="text-muted-foreground mb-6">Mirá otras piezas hechas por nuestros alumnos.</p>
      <Link to="/tienda" className="btn-pill btn-primary-gradient">Ver la tienda</Link>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(productQuery(slug));
  const { addItem } = useCart();
  const [imageIndex, setImageIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [variantId, setVariantId] = useState<string | null>(data?.product.variants[0]?.id ?? null);
  if (!data) return null;
  const { product, related } = data;
  const variant = product.variants.find((v) => v.id === variantId) ?? null;
  const price = variant?.price ?? product.price;
  const stock = variant ? variant.stock : product.stock;
  const image = product.images[imageIndex] ?? product.images[0];

  function handleAdd() {
    const primaryUrl = resolveProductImage(product.images[0]?.url, product.slug);
    addItem(
      {
        productId: product.id,
        variantId: variant?.id ?? null,
        slug: product.slug,
        name: variant ? `${product.name} — ${variant.name}` : product.name,
        price,
        image: primaryUrl,
        maxStock: stock,
      },
      qty,
    );
  }

  return (
    <div className="min-h-screen bg-background pt-[104px] pb-16">
      <div className="haruen-container">
        <Link to="/tienda" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft size={14} aria-hidden="true" /> Volver a la tienda
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="relative aspect-square rounded-[var(--radius)] overflow-hidden bg-muted">
              {(() => {
                const currentUrl = resolveProductImage(image?.url, product.slug);
                return currentUrl ? (
                  <img
                    src={currentUrl}
                    alt={image?.alt || product.name}
                    onError={(e) => {
                      const fb = getProductAssetFallback(product.slug, image?.url);
                      if (fb && e.currentTarget.src !== fb) e.currentTarget.src = fb;
                    }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : null;
              })()}
            </div>
            {product.images.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2" role="list" aria-label="Fotos del producto">
                {product.images.map((img, i) => {
                  const thumbUrl = resolveProductImage(img.url, product.slug);
                  return (
                    <button
                      key={img.url + i}
                      type="button"
                      role="listitem"
                      onClick={() => setImageIndex(i)}
                      className={cn("relative aspect-square rounded-lg overflow-hidden border-2", i === imageIndex ? "border-primary" : "border-transparent")}
                      aria-label={`Ver foto ${i + 1}`}
                      aria-pressed={i === imageIndex}
                    >
                      <img
                        src={thumbUrl}
                        alt=""
                        onError={(e) => {
                          const fb = getProductAssetFallback(product.slug, img.url);
                          if (fb && e.currentTarget.src !== fb) e.currentTarget.src = fb;
                        }}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5">
            {product.category && (
              <Link to="/tienda" search={{ category: product.category.slug }} className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
                {product.category.name}
              </Link>
            )}
            <h1 className="text-4xl font-bold leading-tight">{product.name}</h1>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">{formatPrice(price)}</span>
              {product.compareAtPrice && product.compareAtPrice > price && (
                <span className="text-lg text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</span>
              )}
              <StockBadge stock={stock} threshold={product.lowStockThreshold} />
            </div>

            {product.variants.length > 0 && (
              <fieldset>
                <legend className="text-sm font-bold mb-2">Opción</legend>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <label
                      key={v.id}
                      className={cn(
                        "cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                        v.id === variantId ? "border-foreground bg-foreground text-background" : "border-border bg-card",
                        v.stock <= 0 && "opacity-50",
                      )}
                    >
                      <input
                        type="radio"
                        name="variant"
                        value={v.id}
                        checked={v.id === variantId}
                        onChange={() => { setVariantId(v.id); setQty(1); }}
                        className="sr-only"
                      />
                      {v.name}
                      {v.stock <= 0 && " (sin stock)"}
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-full border border-border p-1" role="group" aria-label="Cantidad">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center" aria-label="Quitar una unidad">
                  <Minus size={14} aria-hidden="true" />
                </button>
                <span className="w-8 text-center font-bold" aria-live="polite">{qty}</span>
                <button type="button" onClick={() => setQty((q) => Math.min(stock, q + 1))} disabled={qty >= stock} className="w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center disabled:opacity-40" aria-label="Sumar una unidad">
                  <Plus size={14} aria-hidden="true" />
                </button>
              </div>
              <button
                type="button"
                onClick={handleAdd}
                disabled={stock <= 0}
                className="btn-pill btn-primary-gradient flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={16} aria-hidden="true" />
                {stock <= 0 ? "Sin stock" : "Agregar al carrito"}
              </button>
            </div>

            <div className="prose-sm text-foreground leading-relaxed whitespace-pre-line">{product.description}</div>

            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Truck size={16} aria-hidden="true" /> Envío por Uber Moto o Andreani, se coordina por WhatsApp.</li>
              <li className="flex items-center gap-2"><CreditCard size={16} aria-hidden="true" /> Transferencia, Mercado Pago o efectivo.</li>
            </ul>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16 !p-0" aria-labelledby="related-title">
            <h2 id="related-title" className="text-2xl font-bold mb-6">También te puede gustar</h2>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
