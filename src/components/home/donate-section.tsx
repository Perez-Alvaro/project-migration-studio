"use client";

import React, { useState } from "react";
import { HandHeart, Copy, Check, MessageCircle } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";

export const WA_ROGELIO = "5493517680218"; // Gestión de donaciones — Santiago Barale

function CopyRow({ label, value, copyable }: { label: string; value: string; copyable?: boolean }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });
    };

    return (
        <div className="flex items-center justify-between gap-3 py-2 border-b border-border/50 last:border-0">
            <dt className="font-semibold text-muted-foreground">{label}</dt>
            <dd className="flex items-center gap-2">
                <span className="text-right break-all text-sm font-mono">{value}</span>
                {copyable ? (
                    <button
                        onClick={handleCopy}
                        title={`Copiar ${label}`}
                        aria-label={`Copiar ${label} para transferencia`}
                        className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0 p-1"
                    >
                        {copied ? (
                            <Check size={13} className="text-green-500" aria-hidden="true" />
                        ) : (
                            <Copy size={13} aria-hidden="true" />
                        )}
                    </button>
                ) : (
                    <Copy size={13} className="text-muted-foreground flex-shrink-0" aria-hidden="true" />
                )}
            </dd>
        </div>
    );
}

function DonationsCard() {
    return (
        <div className="haruen-card rounded-[1.5rem] p-6 bg-card text-card-foreground">
            <div className="flex items-center gap-2 mb-5">
                <HandHeart size={20} className="text-primary" aria-hidden="true" />
                <h3 className="text-lg font-bold">Datos para Transferencia</h3>
            </div>
            <dl className="space-y-3 text-sm text-foreground">
                <CopyRow label="Alias" value="AMOR.TIPO.DESEO" copyable />
                <CopyRow label="Banco" value="Bco Córdoba" />
                <CopyRow label="Razón Social" value="FUNDACION HARUEN" />
                <CopyRow label="CUIT" value="30-70335352-1" />
            </dl>

            <div className="mt-6 space-y-3">
                <p className="text-sm text-muted-foreground">
                    ¿Preferís coordinar tu donación por WhatsApp?
                </p>
                <a
                    href={`https://wa.me/${WA_ROGELIO}?text=${encodeURIComponent(
                        "¡Hola! Quiero hacer una donación a Fundación Haruén",
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pill btn-sunset-gradient w-full justify-center text-sm gap-2"
                >
                    <MessageCircle size={15} aria-hidden="true" />
                    Donar por WhatsApp
                </a>
            </div>
        </div>
    );
}

export function DonateSection() {
    return (
        <section id="donaciones" className="bg-teal-hero haruen-section text-white scroll-mt-24">
            <div className="haruen-container grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
                <FadeIn direction="right">
                    <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:block mb-8 lg:mb-0">
                        {/* Badge con color fijo (blanco/amarillo) visible sobre fondo teal en ambos temas */}
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-white/20 border border-white/30 text-white mb-4">
                            <HandHeart size={14} aria-hidden="true" />
                            Tu Ayuda Transforma Vidas
                        </span>
                        <h2 className="text-clamp-h2 font-black mb-4 leading-tight">
                            Tu donación hace posible{" "}
                            <br className="hidden md:block" />
                            que sigamos creciendo.
                        </h2>
                        <p className="text-lg md:text-xl mb-4 leading-relaxed text-white/85">
                            Ante la crisis que atraviesa el sector de discapacidad, cada aporte —grande o
                            pequeño— se transforma en horas de acompañamiento, talleres y sonrisas.
                        </p>
                        <p className="italic text-sm text-white/70">
                            ¡No olvides enviarnos la captura de tu aporte para agradecerte personalmente!
                        </p>
                    </div>
                </FadeIn>

                <FadeIn direction="left" delay={0.2}>
                    <DonationsCard />
                </FadeIn>
            </div>
        </section>
    );
}
