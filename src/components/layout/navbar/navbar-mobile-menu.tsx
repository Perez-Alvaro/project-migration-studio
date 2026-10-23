"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_ITEMS = [
    { href: "/", label: "Inicio" },
    { href: "/#nosotros", label: "Nosotros" },
    { href: "/#informacion", label: "Información" },
    { href: "/#tienda", label: "Tienda" },
    { href: "/#donaciones", label: "Donaciones" },
    { href: "/#contacto", label: "Contacto" },
];

export function NavbarMobileMenu() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                className="inline-flex lg:hidden items-center justify-center w-10 h-10 rounded-full bg-muted text-foreground"
                onClick={() => setOpen((prev) => !prev)}
                aria-label={open ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
                aria-expanded={open}
                aria-controls="mobile-nav-panel"
            >
                <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    {open ? (
                        <path d="M18 6L6 18M6 6l12 12" />
                    ) : (
                        <>
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </>
                    )}
                </svg>
            </button>

            {open && (
                <div
                    id="mobile-nav-panel"
                    className="lg:hidden absolute top-full left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border shadow-lg"
                >
                    <nav className="haruen-container py-4 flex flex-col gap-3" aria-label="Navegación móvil">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="py-1 text-sm font-semibold text-foreground/90 hover:text-primary transition-colors"
                                onClick={() => setOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <Link
                            href="/#donaciones"
                            className="mt-2 inline-flex btn-pill btn-sunset-gradient text-sm justify-center"
                            onClick={() => setOpen(false)}
                        >
                            Donar Ahora
                        </Link>
                    </nav>
                </div>
            )}
        </>
    );
}
