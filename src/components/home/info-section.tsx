import React from "react";
import Link from "@/components/shared/app-link";
import { MapPin, Clock, UtensilsCrossed, UserCheck, Info } from "lucide-react";
import { FadeIn, FadeInStagger, FadeInStaggerItem } from "@/components/ui/fade-in";

const INFO_ITEMS = [
    {
        icon: MapPin,
        gradient: "gradient-teal",
        title: "Ubicación",
        content: "Entre Ríos 2867, Córdoba, Argentina",
        link: {
            href: "https://www.google.com.ar/maps/place/Entre+R%C3%ADos+2867,+X5006+ICE,+C%C3%B3rdoba/",
            label: "Ver en Google Maps →",
        },
    },
    {
        icon: Clock,
        gradient: "gradient-nature",
        title: "Horarios",
        content: "Lunes a Viernes de 8:00 a 15:00 hs",
        link: null,
    },
    {
        icon: UtensilsCrossed,
        gradient: "gradient-sunset",
        title: "Alimentación",
        content: "Almuerzos incluidos, cocinados al momento con menú nutritivo.",
        link: null,
    },
    {
        icon: UserCheck,
        gradient: "gradient-joy",
        title: "Inscripciones",
        content: "Para personas de 14 años en adelante.",
        link: null,
    },
];

export function InfoSection() {
    return (
        <section id="informacion" className="haruen-section bg-background scroll-mt-24">
            <div className="haruen-container">
                <FadeIn className="mb-10 max-w-2xl mx-auto text-center flex flex-col items-center">
                    <div className="haruen-badge mb-4">
                        <Info size={14} />
                        <span>Información Importante</span>
                    </div>
                    <h2 className="text-clamp-h2 font-black">
                        Todo lo que necesitás saber
                    </h2>
                </FadeIn>

                <FadeInStagger className="max-w-3xl mx-auto grid gap-5 grid-cols-1 md:grid-cols-2">
                    {INFO_ITEMS.map(({ icon: Icon, gradient, title, content, link }) => (
                        <FadeInStaggerItem key={title} className="haruen-card p-5 flex flex-col gap-3">
                            <div className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center`}>
                                <Icon size={22} className="text-white" />
                            </div>
                            <h3 className="text-lg font-bold">{title}</h3>
                            <p className="text-sm text-muted-foreground">{content}</p>
                            {link && (
                                <Link
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-semibold text-primary hover:underline"
                                >
                                    {link.label}
                                </Link>
                            )}
                        </FadeInStaggerItem>
                    ))}
                </FadeInStagger>
            </div>
        </section>
    );
}
