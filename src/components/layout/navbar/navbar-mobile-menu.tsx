
import { useState } from "react";
import Link from "@/components/shared/app-link";
import { ThemeSwitcher } from "@/components/layout/navbar/theme-switcher";
import { useVisibleSections } from "@/hooks/use-visible-sections";

type NavEntry = { href: string; label: string; section: string };
type NavGroup = { title: string; items: NavEntry[] };

/** Mobile menu grouped by category; entries disappear when their section is hidden in admin. */
const NAV_GROUPS: NavGroup[] = [
    {
        title: "El centro",
        items: [
            { href: "/#nosotros", label: "Nosotros", section: "about" },
            { href: "/#informacion", label: "Información", section: "info" },
            { href: "/#contacto", label: "Contacto", section: "contact" },
        ],
    },
    {
        title: "Actividades",
        items: [
            { href: "/novedades", label: "Novedades", section: "news" },
            { href: "/talleres", label: "Talleres", section: "workshops" },
        ],
    },
    {
        title: "Colaborá",
        items: [
            { href: "/tienda", label: "Tienda", section: "store" },
            { href: "/#donaciones", label: "Donaciones", section: "donate" },
        ],
    },
];

export function NavbarMobileMenu() {
    const [open, setOpen] = useState(false);
    const visible = useVisibleSections();
    const groups = NAV_GROUPS.map((g) => ({
        ...g,
        items: g.items.filter((item) => visible.has(item.section)),
    })).filter((g) => g.items.length > 0);
    const showDonateCta = visible.has("campaign");

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
                    className="lg:hidden absolute top-full left-0 right-0 max-h-[calc(100dvh-4rem)] overflow-y-auto bg-card border-t border-border shadow-lg"
                >
                    <nav className="haruen-container py-4 flex flex-col gap-4" aria-label="Navegación móvil">
                        <Link
                            href="/"
                            className="py-2 text-base font-semibold text-foreground/90 hover:text-primary-ink transition-colors"
                            onClick={() => setOpen(false)}
                        >
                            Inicio
                        </Link>
                        {groups.map((group) => (
                            <div key={group.title} className="flex flex-col gap-1">
                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    {group.title}
                                </p>
                                {group.items.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="py-2 text-base font-semibold text-foreground/90 hover:text-primary-ink transition-colors"
                                        onClick={() => setOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        ))}
                        <div className="flex items-center justify-between gap-3 border-t border-border pt-3 sm:hidden">
                            <span className="text-sm font-semibold text-foreground/90">Tema</span>
                            <ThemeSwitcher />
                        </div>
                        {showDonateCta && (
                            <Link
                                href="/#donaciones"
                                className="mt-1 inline-flex btn-pill btn-sunset-gradient text-sm justify-center"
                                onClick={() => setOpen(false)}
                            >
                                Donar ahora
                            </Link>
                        )}
                    </nav>
                </div>
            )}
        </>
    );
}
