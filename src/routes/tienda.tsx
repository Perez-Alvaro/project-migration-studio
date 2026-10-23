import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingBag, ArrowLeft, MessageCircle } from "lucide-react";
import { PRODUCTS, WHATSAPP_PHONE } from "@/data/products";
import { StaticProductCard } from "@/components/commerce/static-product-card";
import { FadeIn } from "@/components/ui/fade-in";

const TITLE = "Tienda Solidaria | Centro Educativo Terapéutico Haruén";
const DESCRIPTION =
  "Comprá piezas únicas de vitrofusión y productos artesanales creados por nuestros alumnos. Cada compra ayuda a sostener el centro.";

export const Route = createFileRoute("/tienda")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TiendaPage,
});

function TiendaPage() {
    return (
        <div className="min-h-screen bg-background pt-[88px]">
            {/* Header */}
            <div className="bg-teal-hero text-white py-14">
                <div className="haruen-container">
                    <Link
                        to="/" hash="tienda"
                        className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-semibold mb-6 transition-colors"
                    >
                        <ArrowLeft size={14} /> Volver a Inicio
                    </Link>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                            <ShoppingBag size={20} />
                        </div>
                        <span className="text-sm font-bold text-white/70 uppercase tracking-widest">
                            Tienda Solidaria
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-3">
                        Arte hecho con amor
                    </h1>
                    <p className="text-lg text-white/80 max-w-lg">
                        Cada pieza es única, creada a mano por nuestros alumnos.
                        Tu compra sostiene el centro.
                    </p>
                </div>
            </div>

            {/* Catálogo */}
            <div className="haruen-container py-12">
                <FadeIn>
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {PRODUCTS.map((product) => (
                            <StaticProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </FadeIn>

                {/* CTA WhatsApp */}
                <FadeIn className="mt-12 text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                        ¿Querés ver más piezas o encargar algo a medida?
                    </p>
                    <a
                        href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
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
        </div>
    );
}
