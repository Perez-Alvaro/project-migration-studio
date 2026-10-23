import React from "react";
import { ShoppingBag, Truck, CreditCard, MessageCircle } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/commerce/product-card";
import { useSiteSettings } from "@/hooks/use-site-settings";
import type { ProductDTO, SectionContent } from "@/lib/types";

export function StoreSection({ products, content }: { products: ProductDTO[]; content?: SectionContent }) {
    const { whatsappNumber } = useSiteSettings();
    return (
        <section id="tienda" className="haruen-section bg-background scroll-mt-24">
            <div className="haruen-container">
                <FadeIn className="mb-10 max-w-3xl mx-auto lg:mx-0 flex flex-col items-center text-center lg:items-start lg:text-left lg:block">
                    <div className="haruen-badge">
                        <ShoppingBag size={14} />
                        <span>Tienda Solidaria</span>
                    </div>
                    <h2 className="text-clamp-h2 font-bold">{content?.title || "Nuestra Tienda Solidaria"}</h2>
                    <p className="mt-3 text-base md:text-lg text-muted-foreground leading-relaxed">
                        Agendas, velas, vitrofusión y más — cada producto es creado con amor por nuestros alumnos. Comprando nos ayudás a seguir creciendo. Consultanos por WhatsApp para ver toda la variedad disponible.
                    </p>

                    {/* Detalles de compra */}
                    <div className="mt-5 flex flex-wrap justify-center lg:justify-start gap-4">
                        <span className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                            <Truck size={14} className="text-primary-ink" />
                            Envío por Uber Moto o Andreani
                        </span>
                        <span className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                            <CreditCard size={14} className="text-primary-ink" />
                            Transferencia, Mercado Pago, Efectivo
                        </span>
                    </div>
                </FadeIn>

                {/* Grid única — todos los productos */}
                <FadeIn>
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </FadeIn>

                {/* CTA WhatsApp */}
                <FadeIn className="mt-12 text-center">
                    <Link to="/tienda" className="btn-pill btn-primary-gradient inline-flex mb-6">Ver toda la tienda</Link>
                    <p className="text-sm text-muted-foreground mb-4">
                        ¿Querés ver más piezas o encargar algo a medida?
                    </p>
                    <a
                        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                            "¡Hola Haruén! 👋 Me gustaría ver la variedad de piezas de vitrofusión disponibles."
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-pill btn-sunset-gradient inline-flex items-center gap-2 text-sm"
                    >
                        <MessageCircle size={15} />
                        Consultar variedad por WhatsApp
                    </a>
                </FadeIn>
            </div>
        </section>
    );
}
