import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { ThemeSwitcher } from "@/components/layout/navbar/theme-switcher";
import { NavbarMobileMenu } from "@/components/layout/navbar/navbar-mobile-menu";
import { CartNavIcon } from "@/components/layout/navbar/cart-nav-icon";
import HaruenLogo from "@/assets/haruenlogo.jpg";

const NAV_ITEMS = [
    { href: "/#nosotros", label: "Nosotros" },
    { href: "/#tienda", label: "Tienda" },
    { href: "/#donaciones", label: "Donaciones" },
    { href: "/#contacto", label: "Contacto" },
];

export function Navbar() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl shadow-soft border-b border-border/50">
            <div className="haruen-container relative">
                <div className="flex items-center justify-between h-[72px]">
                    {/* Logo */}
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
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
                            <div className="flex flex-col leading-tight">
                                <span className="text-sm font-semibold text-muted-foreground">
                                    Centro Educativo
                                </span>
                                <span className="text-base font-extrabold text-primary">
                                    Terapéutico Haruén
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop nav */}
                    <nav className="hidden lg:flex items-center gap-7 text-base font-semibold">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-foreground/70 hover:text-primary transition-colors duration-150"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right side actions */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/#donaciones"
                            className="hidden lg:inline-flex items-center gap-2 btn-pill btn-sunset-gradient text-base px-5 py-2"
                        >
                            <Heart size={14} aria-hidden="true" />
                            Donar
                        </Link>

                        <ThemeSwitcher />
                        <CartNavIcon />
                        <NavbarMobileMenu />
                    </div>
                </div>
            </div>
        </header>
    );
}
