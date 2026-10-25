import React from "react";
import Image from "@/components/shared/app-image";
import { Paintbrush, ArrowDown, ChevronDown, Sparkles } from "lucide-react";
import HaruenAboutAsset from "@/assets/haruen-about.webp.asset.json";
const HaruenAbout = HaruenAboutAsset.url;
import Hero2Asset from "@/assets/hero-2.webp.asset.json";
const Hero2 = Hero2Asset.url;
import Hero3Asset from "@/assets/hero-3.webp.asset.json";
const Hero3 = Hero3Asset.url;
import Hero4Asset from "@/assets/hero-4.webp.asset.json";
const Hero4 = Hero4Asset.url;

export const IMPACTO = [
    { num: "+26", label: "Alumnos activos" },
    { num: "9", label: "Talleres" },
    { num: "+32", label: "Años de experiencia" },
    { num: "100%", label: "Inclusión real" },
];

export function HeroSection() {
    return (
        <section id="inicio" className="bg-teal-hero min-h-screen pt-[96px] pb-16 text-hero-foreground relative overflow-hidden">
            <div className="absolute inset-0 bg-background/5 dark:bg-background/20 pointer-events-none mix-blend-overlay" />
            <div className="haruen-hero-dotted-line z-0" aria-hidden="true" />
            <div className="haruen-container relative z-10 grid gap-12 lg:grid-cols-2 items-center min-h-[calc(100vh-96px)]">
                {/* --- Columna izquierda: texto (Renderizado directo prioritario para LCP) --- */}
                <div className="space-y-7 flex flex-col items-center text-center lg:items-start lg:text-left lg:block">
                    {/* Badge dorado interactivo con ancla directa a la campaña */}
                    <a
                        href="#campana-donacion"
                        className="group inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-bold bg-accent text-accent-foreground hover:bg-accent/90 border border-accent shadow-warm backdrop-blur-sm transition-all cursor-pointer"
                    >
                        <span className="relative flex h-2 w-2" aria-hidden="true">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-foreground opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-foreground"></span>
                        </span>
                        <span>Campaña Activa: Ayudanos a dejar Haruén hermosa</span>
                        <ArrowDown size={13} className="text-accent-foreground group-hover:translate-y-0.5 transition-transform" aria-hidden="true" />
                    </a>

                    {/* H1 - Candidato LCP crítico en mobile */}
                    <h1 className="text-clamp-title font-bold leading-[1.05] tracking-tight">
                        Somos una institución{" "}
                        <br className="hidden md:block" />
                        que acompaña el{" "}
                        <br className="hidden md:block" />
                        <span className="text-accent">crecimiento inclusivo.</span>
                    </h1>

                    {/* Párrafo */}
                    <p className="text-base md:text-xl max-w-[480px] text-hero-foreground/85 leading-relaxed mx-auto lg:mx-0">
                        Educamos, acompañamos y potenciamos a personas con discapacidad
                        intelectual en un espacio de afecto, profesionalismo e inclusión real.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-1">
                        <a
                            href="#campana-donacion"
                            className="btn-pill btn-hero-primary flex items-center gap-2 group cursor-pointer"
                        >
                            <Paintbrush size={16} aria-hidden="true" />
                            <span>Sumate a la Campaña</span>
                            <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" aria-hidden="true" />
                        </a>
                        <a href="#tienda" className="btn-pill btn-ghost-light cursor-pointer">
                            Conocer tienda
                        </a>
                    </div>

                    {/* Social proof mini */}
                    <p className="text-sm text-hero-foreground/60 flex items-center justify-center lg:justify-start gap-2 w-full">
                        <span className="inline-block w-8 h-px bg-hero-foreground/30" aria-hidden="true" />
                        Más de 26 alumnos acompañados en Córdoba
                    </p>
                </div>

                {/* --- Columna derecha: photo grid 2-col asimétrico + stats --- */}
                <div className="flex flex-col gap-4">
                    {/* Photo grid: 4 fotos en 2x2 manteniendo el tamaño del asset original */}
                    <div className="grid grid-cols-2 grid-rows-2 gap-3 aspect-[4/3]">
                        {/* Foto 1: Principal LCP Image con sizes correctos y priority */}
                        <div className="relative rounded-2xl overflow-hidden shadow-md group">
                            <Image
                                src={HaruenAbout}
                                alt="Familia Haruén participando en actividades inclusivas"
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 25vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-overlay/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <span className="absolute bottom-2 left-2 text-xs font-bold text-hero-foreground/90 bg-overlay/40 backdrop-blur-sm rounded-full px-2.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Nuestra Familia
                            </span>
                        </div>

                        {/* Foto 2: Genérica */}
                        <div className="relative rounded-2xl overflow-hidden shadow-md group border border-hero-foreground/10">
                            <Image
                                src={Hero2}
                                alt="Instalaciones Haruén"
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 25vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-700 bg-overlay/5"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-overlay/20 to-transparent" />
                        </div>

                        {/* Foto 3: Genérica */}
                        <div className="relative rounded-2xl overflow-hidden shadow-md group border border-hero-foreground/10">
                            <Image
                                src={Hero3}
                                alt="Equipo Haruén"
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 25vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-700 bg-overlay/5"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-overlay/20 to-transparent" />
                        </div>

                        {/* Foto 4: Genérica */}
                        <div className="relative rounded-2xl overflow-hidden shadow-md group border border-hero-foreground/10">
                            <Image
                                src={Hero4}
                                alt="Comunidad Haruén"
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 25vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-700 bg-overlay/5"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-overlay/20 to-transparent" />
                        </div>
                    </div>

                    {/* Stat cards escaladas. 2 columnas en mobile, 4 en tablet/desktop */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {IMPACTO.map((stat) => (
                            <div key={stat.label} className="bg-hero-foreground/15 border border-hero-foreground/20 backdrop-blur-sm rounded-2xl p-3 text-center">
                                <p className="text-xl font-bold text-hero-foreground leading-none">{stat.num}</p>
                                <p className="text-xs text-hero-foreground/80 mt-1 leading-tight">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Prompt interactivo de scroll hacia la campaña de donaciones */}
            <div className="hidden sm:flex absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                <a
                    href="#campana-donacion"
                    className="group flex items-center gap-2 px-4 py-1.5 rounded-full bg-hero-foreground/10 hover:bg-accent hover:text-accent-foreground border border-hero-foreground/20 backdrop-blur-md text-xs font-bold text-hero-foreground transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                    aria-label="Ir a la campaña de donaciones"
                >
                    <Sparkles size={14} className="text-accent group-hover:text-accent-foreground transition-colors" aria-hidden="true" />
                    <span>Conocé la Campaña Hermosa Haruén</span>
                    <ChevronDown size={15} className="text-hero-foreground animate-bounce" aria-hidden="true" />
                </a>
            </div>
        </section>
    );
}
