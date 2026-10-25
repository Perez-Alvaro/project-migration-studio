import React from "react";
import Image from "@/components/shared/app-image";
import { Phone, MessageCircle, MapPin } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { ContactForm } from "@/components/contact/contact-form";
import FounderRogelio from "@/assets/founder-rogelio.jpg";
import FounderAlfredo from "@/assets/founder-alfredo.jpg";

export function ContactSection() {
    return (
        <section id="contacto" className="pt-20 pb-12 bg-card scroll-mt-24">
            <div className="haruen-container grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
                <FadeIn direction="right">
                    <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:block mb-10 lg:mb-0">
                        <div className="haruen-badge">
                            <Phone size={14} aria-hidden="true" />
                            <span>Inscripciones y Consultas</span>
                        </div>
                        <h2 className="text-clamp-h2 font-bold mb-3 leading-tight">
                            Contactá con nuestros fundadores
                        </h2>
                        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                            Para inscripciones o consultas, contactá directamente con alguno de nuestros
                            fundadores. Respondemos por WhatsApp.
                        </p>

                        <div className="grid gap-4 md:grid-cols-2 mb-8 w-full">
                            {/* Rogelio — aparece primero a la izquierda */}
                            <div className="haruen-card p-4 flex flex-col gap-3 text-left">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                                        <Image
                                            src={FounderRogelio}
                                            alt="Rogelio Guzman, fundador de Fundación Haruén"
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">Rogelio Guzman</p>
                                        <p className="text-xs text-muted-foreground">351-601-9654</p>
                                    </div>
                                </div>
                                <a
                                    href={`https://wa.me/5493516019654?text=${encodeURIComponent(
                                        "¡Hola Rogelio! Quiero información sobre Haruén",
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Escribir por WhatsApp a Rogelio Guzman"
                                    className="btn-pill btn-secondary-neutral text-xs justify-center gap-2"
                                >
                                    <MessageCircle size={13} aria-hidden="true" />
                                    Escribir por WhatsApp
                                </a>
                            </div>

                            {/* Alfredo — aparece segundo a la derecha */}
                            <div className="haruen-card p-4 flex flex-col gap-3 text-left">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                                        <Image
                                            src={FounderAlfredo}
                                            alt="Alfredo M. Barale, fundador de Fundación Haruén"
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">Alfredo M. Barale</p>
                                        <p className="text-xs text-muted-foreground">351-654-1669</p>
                                    </div>
                                </div>
                                <a
                                    href={`https://wa.me/5493516541669?text=${encodeURIComponent(
                                        "¡Hola Alfredo! Quiero información sobre Haruén",
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Escribir por WhatsApp a Alfredo M. Barale"
                                    className="btn-pill btn-secondary-neutral text-xs justify-center gap-2"
                                >
                                    <MessageCircle size={13} aria-hidden="true" />
                                    Escribir por WhatsApp
                                </a>
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground flex items-center justify-center lg:justify-start gap-2 w-full">
                            <MapPin size={14} className="text-primary-ink flex-shrink-0" aria-hidden="true" />
                            Entre Ríos 2867, Córdoba, Argentina
                        </p>
                    </div>
                </FadeIn>

                <FadeIn direction="left" delay={0.2}>
                    <ContactForm />
                </FadeIn>
            </div>
        </section>
    );
}
