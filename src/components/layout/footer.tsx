import Link from "@/components/shared/app-link";
import { MapPin, Heart, Phone, MessageCircle, Instagram, Facebook } from "lucide-react";

const NAV_LINKS = [
    { href: "/#nosotros", label: "Nosotros" },
    { href: "/#informacion", label: "Información" },
    { href: "/#tienda", label: "Tienda Solidaria" },
    { href: "/#donaciones", label: "Donaciones" },
    { href: "/#contacto", label: "Contacto" },
];

export function Footer() {

    const year = new Date().getFullYear();

    return (
        <footer className="bg-surface text-hero-foreground">
            <div className="haruen-container py-16">
                {/* 4-column grid */}
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Col 1 — Brand */}
                    <div className="lg:col-span-1 space-y-4">
                        <div>
                            <p className="text-base font-bold text-hero-foreground">
                                Centro Educativo
                            </p>
                            <p className="text-base font-bold text-accent">
                                Terapéutico Haruén
                            </p>
                        </div>
                        <p className="text-sm text-hero-foreground/80 leading-relaxed max-w-[220px]">
                            Educación muy especial para personas muy especiales. Acompañando a
                            nuestra comunidad desde Córdoba, Argentina.
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-hero-foreground/80">
                            <MapPin size={12} aria-hidden="true" />
                            <span>Entre Ríos 2867, Córdoba</span>
                        </div>
                        <div className="flex items-center gap-4 pt-2">
                            <a
                                href="https://www.instagram.com/fundacionharuen?igsh=dDhnMWlrZ2ljMHAy&utm_source=qr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-11 h-11 rounded-full bg-hero-foreground/5 flex items-center justify-center text-hero-foreground/80 hover:text-hero-foreground hover:bg-hero-foreground/10 transition-all"
                                aria-label="Seguinos en Instagram"
                            >
                                <Instagram size={16} aria-hidden="true" />
                            </a>
                            <a
                                href="https://www.facebook.com/share/1J9EHTZrj4/?mibextid=wwXIfr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-11 h-11 rounded-full bg-hero-foreground/5 flex items-center justify-center text-hero-foreground/80 hover:text-hero-foreground hover:bg-hero-foreground/10 transition-all"
                                aria-label="Seguinos en Facebook"
                            >
                                <Facebook size={16} aria-hidden="true" />
                            </a>
                        </div>
                    </div>

                    {/* Col 2 — Navegación */}
                    <div className="space-y-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-accent">
                            Navegación
                        </p>
                        <ul className="space-y-2">
                            {NAV_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-hero-foreground/80 hover:text-hero-foreground/90 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 3 — Contacto */}
                    <div className="space-y-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-accent">
                            Contacto
                        </p>
                        <ul className="space-y-3">
                            <li>
                                <p className="text-xs text-hero-foreground/80 mb-0.5">Alfredo M. Barale</p>
                                <a
                                    href="tel:+5493516541669"
                                    className="flex items-center gap-2 text-sm text-hero-foreground/80 hover:text-hero-foreground/90 transition-colors"
                                >
                                    <Phone size={13} aria-hidden="true" />
                                    351-654-1669
                                </a>
                            </li>
                            <li>
                                <p className="text-xs text-hero-foreground/80 mb-0.5">Rogelio Guzman</p>
                                <a
                                    href="tel:+5493516019654"
                                    className="flex items-center gap-2 text-sm text-hero-foreground/80 hover:text-hero-foreground/90 transition-colors"
                                >
                                    <Phone size={13} aria-hidden="true" />
                                    351-601-9654
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/#contacto"
                                    className="flex items-center gap-2 text-sm text-hero-foreground/80 hover:text-hero-foreground/90 transition-colors"
                                >
                                    <MessageCircle size={13} aria-hidden="true" />
                                    Formulario de contacto
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Col 4 — Donaciones */}
                    <div className="space-y-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-accent">
                            Donaciones
                        </p>
                        <p className="text-sm text-hero-foreground/80 leading-relaxed">
                            Tu aporte transforma la vida de nuestros alumnos. Cada peso
                            se convierte en educación y alegría.
                        </p>
                        <Link
                            href="/#campana-donacion"
                            className="btn-pill btn-sunset-gradient gap-2 text-sm"
                        >
                            <Heart size={13} aria-hidden="true" />
                            Quiero donar
                        </Link>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-hero-foreground/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-hero-foreground/80">
                        © {year} Centro Educativo Terapéutico Haruén. Todos los derechos reservados.
                    </p>
                    <p className="text-xs text-hero-foreground/80">
                        Hecho con <Heart size={10} className="inline text-accent" aria-hidden="true" /> por la comunidad Haruén
                    </p>
                </div>
            </div>
        </footer>
    );
}
