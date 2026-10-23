import React from "react";
import Image from "next/image";
import { Paintbrush, ArrowDown, ChevronDown, Sparkles } from "lucide-react";
import HaruenAbout from "@/assets/haruen-about.jpg";
import Hero2 from "@/assets/hero-2.png";
import Hero3 from "@/assets/hero-3.png";
import Hero4 from "@/assets/hero-4.png";

export const IMPACTO = [
    { num: "+26", label: "Alumnos activos" },
    { num: "9", label: "Talleres" },
    { num: "+32", label: "Años de experiencia" },
    { num: "100%", label: "Inclusión real" },
];

export function HeroSection() {
    return (
        <section id="inicio" className="bg-teal-hero min-h-screen pt-[96px] pb-16 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-background/5 dark:bg-background/20 pointer-events-none mix-blend-overlay" />
            <div className="haruen-hero-dotted-line z-0" aria-hidden="true" />
            <div className="haruen-container relative z-10 grid gap-12 lg:grid-cols-2 items-center min-h-[calc(100vh-96px)]">
                {/* --- Columna izquierda: texto (Renderizado directo prioritario para LCP) --- */}
                <div className="space-y-7 flex flex-col items-center text-center lg:items-start lg:text-left lg:block">
                    {/* Badge dorado interactivo con ancla directa a la campaña */}
                    <a
                        href="#campana-donacion"
                        className="group inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-extrabold bg-gradient-to-r from-amber-500/20 via-yellow-500/25 to-amber-500/20 hover:from-amber-500/30 hover:to-yellow-500/35 border border-amber-400/60 text-[#FCD34D] shadow-[0_2px_12px_rgba(245,158,11,0.25)] backdrop-blur-sm transition-all cursor-pointer"
                    >
                        <span className="relative flex h-2 w-2" aria-hidden="true">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                        </span>
                        <span>Campaña Activa: Ayudanos a dejar Haruén hermosa</span>
                        <ArrowDown size={13} className="text-amber-400 group-hover:translate-y-0.5 transition-transform" aria-hidden="true" />
                    </a>

                    {/* H1 - Candidato LCP crítico en mobile */}
                    <h1 className="text-clamp-title font-black leading-[1.05] tracking-tight">
                        Somos una institución{" "}
                        <br className="hidden md:block" />
                        que acompaña el{" "}
                        <br className="hidden md:block" />
                        <span className="text-[#EF7225]">crecimiento inclusivo.</span>
                    </h1>

                    {/* Párrafo */}
                    <p className="text-base md:text-xl max-w-[480px] text-white/85 leading-relaxed mx-auto lg:mx-0">
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
                    <p className="text-sm text-white/60 flex items-center justify-center lg:justify-start gap-2 w-full">
                        <span className="inline-block w-8 h-px bg-white/30" aria-hidden="true" />
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
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <span className="absolute bottom-2 left-2 text-xs font-bold text-white/90 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Nuestra Familia
                            </span>
                        </div>

                        {/* Foto 2: Genérica */}
                        <div className="relative rounded-2xl overflow-hidden shadow-md group border border-white/10">
                            <Image
                                src={Hero2}
                                alt="Instalaciones Haruén"
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 25vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-700 bg-black/5"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>

                        {/* Foto 3: Genérica */}
                        <div className="relative rounded-2xl overflow-hidden shadow-md group border border-white/10">
                            <Image
                                src={Hero3}
                                alt="Equipo Haruén"
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 25vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-700 bg-black/5"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>

                        {/* Foto 4: Genérica */}
                        <div className="relative rounded-2xl overflow-hidden shadow-md group border border-white/10">
                            <Image
                                src={Hero4}
                                alt="Comunidad Haruén"
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 25vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-700 bg-black/5"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                    </div>

                    {/* Stat cards escaladas. 2 columnas en mobile, 4 en tablet/desktop */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {IMPACTO.map((stat) => (
                            <div key={stat.label} className="bg-white/15 border border-white/20 backdrop-blur-sm rounded-2xl p-3 text-center">
                                <p className="text-xl font-black text-white leading-none">{stat.num}</p>
                                <p className="text-xs text-white/80 mt-1 leading-tight">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Prompt interactivo de scroll hacia la campaña de donaciones */}
            <div className="hidden sm:flex absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                <a
                    href="#campana-donacion"
                    className="group flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-[#ef7225] border border-white/20 backdrop-blur-md text-xs font-bold text-white transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                    aria-label="Ir a la campaña de donaciones"
                >
                    <Sparkles size={14} className="text-[#ef7225] group-hover:text-white transition-colors" aria-hidden="true" />
                    <span>Conocé la Campaña Hermosa Haruén</span>
                    <ChevronDown size={15} className="text-white animate-bounce" aria-hidden="true" />
                </a>
            </div>
        </section>
    );
}
