import React from "react";
import { FadeIn } from "@/components/ui/fade-in";
import { Newspaper, ExternalLink } from "lucide-react";

const NOVEDADES_URL =
    "https://stealth-letter-597.notion.site/Novedades-de-la-fundaci-n-Haru-n-a081366ee60f827990470148367e3329?source=copy_link";

export function BlogSection() {
    return (
        <section id="blog" className="bg-teal-hero haruen-section text-hero-foreground">
            <div className="haruen-container flex flex-col items-center text-center gap-8">

                {/* Encabezado */}
                <FadeIn className="flex flex-col items-center gap-4 max-w-2xl">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-hero-foreground/20 border border-hero-foreground/30 text-hero-foreground mb-4">
                        <Newspaper size={14} />
                        Novedades
                    </span>
                    <h2 className="text-clamp-h2 font-bold leading-tight">
                        Lo que está pasando{" "}
                        <br className="hidden sm:block" />
                        en Haruén y Argentina
                    </h2>
                    <p className="text-base md:text-lg text-hero-foreground/80 leading-relaxed">
                        Seguí de cerca las actividades, logros y momentos especiales
                        de nuestra comunidad. Publicamos novedades regularmente para
                        que estés siempre al tanto.
                    </p>
                </FadeIn>

                {/* CTA */}
                <FadeIn delay={0.15}>
                    <a
                        href={NOVEDADES_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-pill btn-primary-gradient px-8 py-3.5 text-base font-bold inline-flex items-center gap-2 whitespace-nowrap"
                    >
                        Ver todas las novedades
                        <ExternalLink size={16} />
                    </a>
                </FadeIn>

            </div>
        </section>
    );
}
