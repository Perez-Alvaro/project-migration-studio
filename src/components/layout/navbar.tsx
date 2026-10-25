import Image from "@/components/shared/app-image";
import Link from "@/components/shared/app-link";
import { Heart } from "lucide-react";
import { ThemeSwitcher } from "@/components/layout/navbar/theme-switcher";
import { NavbarMobileMenu } from "@/components/layout/navbar/navbar-mobile-menu";
import { CartNavIcon } from "@/components/layout/navbar/cart-nav-icon";
import { AccountButton } from "@/components/layout/navbar/account-button";
import { useVisibleSections } from "@/hooks/use-visible-sections";
import HaruenLogoAsset from "@/assets/haruenlogo.webp.asset.json";
const HaruenLogo = HaruenLogoAsset.url;

/** Navbar entries tied to a home section; hidden when the section is hidden in admin. */
const NAV_ITEMS = [
    { href: "/#nosotros", label: "Nosotros", section: "about" },
    { href: "/tienda", label: "Tienda", section: "store" },
    { href: "/novedades", label: "Novedades", section: "news" },
    { href: "/talleres", label: "Talleres", section: "workshops" },
    { href: "/#donaciones", label: "Donaciones", section: "donate" },
    { href: "/#contacto", label: "Contacto", section: "contact" },
] as const;

export function Navbar() {
    const visible = useVisibleSections();
    const items = NAV_ITEMS.filter((item) => visible.has(item.section));
    const showDonateCta = visible.has("campaign");

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl shadow-soft border-b border-border/50">
            <div className="haruen-container relative">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 h-16 sm:h-[72px] lg:flex lg:justify-between">
                    {/* Logo */}
                    <div className="flex min-w-0 items-center gap-4">
                        <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
                            <div className="w-11 h-11 sm:w-14 sm:h-14 shrink-0 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                                <Image
                                    src={HaruenLogo}
                                    alt="Centro Educativo Terapéutico Haruén"
                                    width={56}
                                    height={56}
                                    sizes="56px"
                                    priority
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex min-w-0 flex-col leading-tight">
                                <span className="hidden sm:block truncate text-sm font-semibold text-muted-foreground">
                                    Centro Educativo
                                </span>
                                <span className="truncate text-sm sm:text-base font-bold text-primary-ink">
                                    <span className="sm:hidden">Haruén</span>
                                    <span className="hidden sm:inline">Terapéutico Haruén</span>
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop nav */}
                    <nav className="hidden lg:flex items-center gap-6 text-base font-semibold">
                        {items.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-foreground/70 hover:text-primary-ink transition-colors duration-150"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right side actions */}
                    <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
                        {showDonateCta && (
                            <Link
                                href="/#donaciones"
                                className="hidden lg:inline-flex items-center gap-2 btn-pill btn-sunset-gradient text-base px-5 py-2"
                            >
                                <Heart size={14} aria-hidden="true" />
                                Donar
                            </Link>
                        )}

                        <div className="hidden sm:block">
                            <ThemeSwitcher />
                        </div>
                        <AccountButton />
                        <CartNavIcon />
                        <NavbarMobileMenu />
                    </div>
                </div>
            </div>
        </header>
    );
}
