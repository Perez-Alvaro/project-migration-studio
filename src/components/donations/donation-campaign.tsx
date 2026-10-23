
// ============================================================================
// DEV: Cambia el status aquí o en page.tsx:
// 'iniciada' | 'en_progreso' | 'finalizada'
//
// Para actualizar el monto recaudado, meta o datos bancarios, edita:
// @/lib/campaign.ts (CAMPAIGN_DATA)
// ============================================================================

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Rocket,
    Paintbrush,
    CheckCircle2,
    Copy,
    Check,
    MessageCircle,
    ShieldCheck,
    FileText,
    Sparkles,
    Users,
    HeartHandshake,
    Heart,
} from "lucide-react";
import type { CampaignStatus } from "@/lib/types";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { DonationFloatingBar } from "@/components/donations/donation-floating-bar";

interface DonationCampaignProps {
    status?: CampaignStatus;
}

function CountUpNumber({ value }: { value: number }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        const duration = 1200;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(Math.floor(easeOutCubic * value));

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setDisplayValue(value);
            }
        };

        const frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);
    }, [value]);

    return <span>${displayValue.toLocaleString("es-AR")}</span>;
}

function CopyField({ label, value }: { label: string; value: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (typeof navigator !== "undefined" && navigator.clipboard) {
            navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="bg-[#f4fafe] dark:bg-card/50 border border-[#152129]/15 dark:border-border/40 rounded-[12px] p-3 flex items-center justify-between gap-3 shadow-[0_2px_4px_rgba(21,33,41,0.03)]">
            <div className="min-w-0 flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-0.5">
                    {label}
                </span>
                <span className="font-mono text-sm md:text-base font-bold text-foreground break-all select-all">
                    {value}
                </span>
            </div>
            <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-[#152129]/20 hover:border-[#ef7225] hover:text-[#ef7225] bg-card text-foreground transition-all flex-shrink-0 active:scale-95"
                title={`Copiar ${label}`}
                aria-label={copied ? `${label} copiado` : `Copiar ${label} para transferencia`}
            >
                {copied ? (
                    <>
                        <Check size={14} className="text-emerald-600" aria-hidden="true" />
                        <span className="text-emerald-600 font-bold">Copiado</span>
                    </>
                ) : (
                    <>
                        <Copy size={14} aria-hidden="true" />
                        <span>Copiar</span>
                    </>
                )}
            </button>
        </div>
    );
}

export function DonationCampaign({ status: statusProp }: DonationCampaignProps) {
    const settings = useSiteSettings();
    const status = statusProp ?? settings.campaignStatus;
    const c = settings.campaign;
    const bank = settings.bank;
    const meta = c.meta;
    const metaText = `$${meta.toLocaleString("es-AR")}`;

    // Configuración persuasiva de UX adaptada a cada uno de los 3 estados
    const currentData = {
        iniciada: {
            recaudado: c.recaudado,
            donantes: c.donantes,
            badgeIcon: Rocket,
            badgeText: "Campaña activa · ¡Arrancamos!",
            badgeClass: "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800",
            percentClass: "bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-950/40 dark:text-amber-200",
            barGradient: "bg-gradient-to-r from-[#ef7225] to-[#f59e0b]",
            subtext: `Faltan $${(meta - c.recaudado).toLocaleString("es-AR")} para alcanzar la meta.`,
            donorsText: `${c.donantes} personas ya dieron el primer paso con sus aportes`,
            persuasionMessage: `Estamos dando los primeros pasos para alcanzar los ${metaText} de la obra. Con $1.000, $2.000 o lo que esté a tu alcance hoy, encendés el motor de este sueño.`,
            initialWidth: "0%",
        },
        en_progreso: {
            recaudado: c.recaudado,
            donantes: c.donantes,
            badgeIcon: Paintbrush,
            badgeText: "Campaña activa · ¡Superamos la mitad de la meta!",
            badgeClass: "bg-[#ef7225]/15 text-[#ef7225] border-[#ef7225]/30 dark:bg-[#ef7225]/20 dark:text-[#ff9452] dark:border-[#ef7225]/40",
            percentClass: "bg-[#ef7225]/15 text-[#ef7225] border-[#ef7225]/30 dark:bg-[#ef7225]/20 dark:text-[#ff9452]",
            barGradient: "bg-gradient-to-r from-[#ef7225] to-[#f97316]",
            subtext: `Faltan $${(meta - c.recaudado).toLocaleString("es-AR")} para completar la compra de pintura y mano de obra.`,
            donorsText: `${c.donantes} personas y familias ya realizaron su aporte`,
            persuasionMessage: `¡Ya superamos el 50% gracias a la solidaridad comunitaria! Cada nuevo aporte, por más chico que parezca, nos acerca a los ${metaText} finales.`,
            initialWidth: "13%",
        },
        finalizada: {
            recaudado: c.recaudado,
            donantes: c.donantes,
            badgeIcon: CheckCircle2,
            badgeText: `¡Meta de ${metaText} cumplida! Gracias comunidad Haruén`,
            badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-800",
            percentClass: "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-200",
            barGradient: "bg-gradient-to-r from-emerald-600 to-surface",
            subtext: `¡Alcanzamos los $${meta.toLocaleString("es-AR")} gracias a la solidaridad de todos!`,
            donorsText: `${c.donantes} donantes hicieron posible renovar nuestro espacio`,
            persuasionMessage: "¡Lo logramos entre todos! Cientos de personas demostraron que sumando voluntades ningún objetivo es imposible para nuestra comunidad.",
            initialWidth: "54%",
        },
    }[status];

    const percentage = Math.min(Math.round((currentData.recaudado / meta) * 100), 100);
    const BadgeIcon = currentData.badgeIcon;

    const whatsappMessage = `¡Hola! Quiero colaborar con la Campaña Hermosa Haruén y adjuntar mi comprobante de transferencia bancaria.`;
    const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
        whatsappMessage,
    )}`;

    return (
        <section
            id="campana-donacion"
            role="region"
            aria-label="Campaña de Donaciones Hermosa Haruén"
            className="w-full relative overflow-hidden py-14 md:py-18 bg-[#f4fafe] dark:bg-background border-b border-border/40 scroll-mt-24"
        >
            <div className="haruen-container max-w-4xl mx-auto px-4 relative z-10">
                {/* Badge Superior Dinámico */}
                <div className="flex justify-center mb-4">
                    <span
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border shadow-sm transition-all ${currentData.badgeClass}`}
                    >
                        <BadgeIcon size={15} />
                        {currentData.badgeText}
                    </span>
                </div>

                {/* Título y Subtítulo */}
                <div className="text-center max-w-3xl mx-auto mb-8">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.15] mb-3">
                        {c.titulo}
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                        {c.subtitulo}
                    </p>
                </div>

                {/* Card Principal de Campaña */}
                <div className="bg-card text-card-foreground rounded-[12px] p-6 sm:p-8 md:p-10 border border-border/60 shadow-[0_4px_6px_rgba(21,33,41,0.05)]">
                    
                    {/* Banner de Reducción de Fricción Psicológica (Principio UX: Inclusividad y Cero Mínimos) */}
                    <div className="mb-6 p-4 rounded-[12px] bg-amber-500/10 border border-[#ef7225]/30 flex items-start gap-3">
                        <div className="p-2 rounded-full bg-[#ef7225]/15 text-[#ef7225] shrink-0 mt-0.5">
                            <Heart size={16} />
                        </div>
                        <div className="text-xs sm:text-sm">
                            <span className="font-bold text-foreground block mb-0.5">
                                No hay aporte pequeño: todo suma a la meta colectiva
                            </span>
                            <p className="text-muted-foreground leading-relaxed">
                                {currentData.persuasionMessage}
                            </p>
                        </div>
                    </div>

                    {/* Encabezado de montos y porcentaje */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
                        <div>
                            <span className="text-xs uppercase tracking-wider font-bold text-muted-foreground block mb-1">
                                Total Recaudado
                            </span>
                            <div className="flex items-baseline gap-2">
                                <span className="font-mono text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                                    <CountUpNumber value={currentData.recaudado} />
                                </span>
                                <span className="text-sm md:text-base font-semibold text-muted-foreground">
                                    de ${meta.toLocaleString("es-AR")} meta
                                </span>
                            </div>
                        </div>

                        {/* Pill de Porcentaje */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between">
                            <span
                                className={`px-4 py-1.5 rounded-[12px] text-lg sm:text-2xl font-bold border ${currentData.percentClass}`}
                            >
                                {percentage}%
                            </span>
                            <span className="text-xs font-semibold text-muted-foreground mt-1">
                                {currentData.subtext}
                            </span>
                        </div>
                    </div>

                    {/* Barra de Progreso Gigante */}
                    <div
                        className="w-full h-7 md:h-8 bg-muted rounded-full p-1 border border-border/30 relative overflow-hidden mb-6 shadow-inner"
                        role="progressbar"
                        aria-valuenow={percentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label="Progreso de la campaña de donaciones"
                    >
                        <motion.div
                            initial={{ width: currentData.initialWidth }}
                            whileInView={{ width: `${percentage}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className={`h-full rounded-full relative overflow-hidden flex items-center justify-end pr-3 text-white text-xs font-bold shadow-sm ${currentData.barGradient}`}
                        >
                            {/* Efecto Shimmer de brillo continuo */}
                            <div
                                className="absolute inset-0 w-1/3 bg-white/20 -skew-x-12 animate-[shimmer_2s_infinite_ease-in-out]"
                                style={{
                                    animation: "shimmer 2.2s infinite ease-in-out",
                                }}
                            />
                        </motion.div>
                    </div>

                    {/* Donantes y Social Proof */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-6 border-b border-border/40 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <span className="p-1.5 rounded-full bg-primary/10 text-primary-ink">
                                <Users size={14} />
                            </span>
                            <span className="font-semibold text-foreground">
                                {currentData.donorsText}
                            </span>
                        </div>
                        <span className="text-muted-foreground/80 italic text-[11px]">
                            Centro Educativo Terapéutico · 26 alumnos activos
                        </span>
                    </div>

                    {/* Datos clave para Transferencia (Alias y CBU) */}
                    <div className="pt-6">
                        <div className="flex items-center gap-2 mb-3">
                            <ShieldCheck size={18} className="text-[#ef7225]" />
                            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">
                                Datos bancarios oficiales para transferir
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                            <CopyField
                                label="Alias Bancario"
                                value={bank.alias}
                            />
                            <CopyField
                                label="CBU"
                                value={bank.cbu}
                            />
                        </div>

                        <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground px-1 pb-4">
                            <span>
                                <strong>Banco:</strong> {bank.banco}
                            </span>
                            <span>
                                <strong>CUIT:</strong> {bank.cuit}
                            </span>
                            <span>
                                <strong>Titular:</strong> {bank.titular}
                            </span>
                        </div>
                    </div>

                    {/* Botón Principal: Redirige a WhatsApp para enviar comprobante */}
                    <div className="pt-4">
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-[12px] font-bold text-base text-white bg-[#ef7225] hover:bg-[#d8621a] shadow-[0_4px_14px_rgba(239,114,37,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center"
                        >
                            <MessageCircle size={20} />
                            <span>Enviar comprobante por WhatsApp</span>
                        </a>
                        <p className="text-center text-xs text-muted-foreground mt-2">
                            Aceptamos transferencias desde cualquier banco o billetera virtual (Mercado Pago, Cuenta DNI, Ualá, Bancor, etc.).
                        </p>
                    </div>

                    {/* Trust Signals */}
                    <div className="mt-8 pt-6 border-t border-border/40 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-muted-foreground">
                            <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0" />
                            <span>Donación directa y transparente</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground">
                            <FileText size={16} className="text-[#ef7225] flex-shrink-0" />
                            <span>Acreditación inmediata por WhatsApp</span>
                        </div>
                        <div className="flex items-center justify-center sm:justify-end gap-2 text-xs font-semibold text-muted-foreground">
                            <Sparkles size={16} className="text-primary-ink flex-shrink-0" />
                            <span>100% destinado a la obra y materiales</span>
                        </div>
                    </div>

                    {/* Mensaje de Celebración en estado finalizada */}
                    {status === "finalizada" && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            className="mt-6 p-5 rounded-[12px] bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center"
                        >
                            <div className="flex justify-center mb-2 text-emerald-600 dark:text-emerald-400">
                                <HeartHandshake size={28} />
                            </div>
                            <p className="font-bold text-emerald-900 dark:text-emerald-100 text-sm">
                                ¡Comunidad, logramos el objetivo de {metaText}!
                            </p>
                            <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1 max-w-lg mx-auto">
                                La compra de materiales y la mano de obra ya están en marcha para que nuestros 26 alumnos disfruten de un espacio renovado.
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Barra flotante inferior en dispositivos móviles */}
            <DonationFloatingBar
                status={status}
                percentage={percentage}
                whatsappUrl={whatsappUrl}
            />
        </section>
    );
}
