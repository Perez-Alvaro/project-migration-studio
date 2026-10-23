import Link from "next/link";
import { MapPin, Heart, Phone, MessageCircle, Instagram, Facebook } from "lucide-react";
import { cacheLife } from "next/cache";

const NAV_LINKS = [
    { href: "/#nosotros", label: "Nosotros" },
    { href: "/#informacion", label: "Información" },
    { href: "/#tienda", label: "Tienda Solidaria" },
    { href: "/#donaciones", label: "Donaciones" },
    { href: "/#contacto", label: "Contacto" },
];

export async function Footer() {
    "use cache";
    cacheLife("days");

    const year = new Date().getFullYear();

    return (
        <footer className="bg-[hsl(200,30%,10%)] text-[hsl(180,25%,92%)]">
            <div className="haruen-container py-16">
                {/* 4-column grid */}
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Col 1 — Brand */}
                    <div className="lg:col-span-1 space-y-4">
                        <div>
                            <p className="text-base font-extrabold text-white">
                                Centro Educativo
                            </p>
                            <p className="text-base font-extrabold text-primary">
                                Terapéutico Haruén
                            </p>
                        </div>
                        <p className="text-sm text-white/50 leading-relaxed max-w-[220px]">
                            Educación muy especial para personas muy especiales. Acompañando a
                            nuestra comunidad desde Córdoba, Argentina.
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-white/30">
                            <MapPin size={12} aria-hidden="true" />
                            <span>Entre Ríos 2867, Córdoba</span>
                        </div>
                        <div className="flex items-center gap-4 pt-2">
                            <a
                                href="https://www.instagram.com/fundacionharuen?igsh=dDhnMWlrZ2ljMHAy&utm_source=qr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                                aria-label="Seguinos en Instagram"
                            >
                                <Instagram size={16} aria-hidden="true" />
                            </a>
                            <a
                                href="https://www.facebook.com/share/1J9EHTZrj4/?mibextid=wwXIfr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                                aria-label="Seguinos en Facebook"
                            >
                                <Facebook size={16} aria-hidden="true" />
                            </a>
                        </div>
                    </div>

                    {/* Col 2 — Navegación */}
                    <div className="space-y-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-primary">
                            Navegación
                        </p>
                        <ul className="space-y-2">
                            {NAV_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white/60 hover:text-white/90 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 3 — Contacto */}
                    <div className="space-y-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-primary">
                            Contacto
                        </p>
                        <ul className="space-y-3">
                            <li>
                                <p className="text-xs text-white/40 mb-0.5">Alfredo M. Barale</p>
                                <a
                                    href="tel:+5493516541669"
                                    className="flex items-center gap-2 text-sm text-white/60 hover:text-white/90 transition-colors"
                                >
                                    <Phone size={13} aria-hidden="true" />
                                    351-654-1669
                                </a>
                            </li>
                            <li>
                                <p className="text-xs text-white/40 mb-0.5">Rogelio Guzman</p>
                                <a
                                    href="tel:+5493516019654"
                                    className="flex items-center gap-2 text-sm text-white/60 hover:text-white/90 transition-colors"
                                >
                                    <Phone size={13} aria-hidden="true" />
                                    351-601-9654
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/#contacto"
                                    className="flex items-center gap-2 text-sm text-white/60 hover:text-white/90 transition-colors"
                                >
                                    <MessageCircle size={13} aria-hidden="true" />
                                    Formulario de contacto
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Col 4 — Donaciones */}
                    <div className="space-y-4">
                        <p className="text-xs font-bold uppercase tracking-widest text-primary">
                            Donaciones
                        </p>
                        <p className="text-sm text-white/60 leading-relaxed">
                            Tu aporte transforma la vida de nuestros alumnos. Cada peso
                            se convierte en educación y alegría.
                        </p>
                        <Link
                            href="/#campana-donacion"
                            className="inline-flex items-center gap-2 text-sm font-bold text-white bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-full px-4 py-2 transition-colors"
                        >
                            <Heart size={13} aria-hidden="true" />
                            Quiero donar
                        </Link>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-white/30">
                        © {year} Centro Educativo Terapéutico Haruén. Todos los derechos reservados.
                    </p>
                    <p className="text-xs text-white/20">
                        Hecho con <Heart size={10} className="inline text-accent" aria-hidden="true" /> por la comunidad Haruén
                    </p>
                </div>
            </div>
        </footer>
    );
}
