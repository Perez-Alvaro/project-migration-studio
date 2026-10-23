import { useState } from "react";
import { createFileRoute, Link, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Package, ClipboardList, Newspaper, GraduationCap, LayoutTemplate, Settings, Users, Menu } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async ({ context }) => {
    const user = (context as { user?: { id: string } }).user;
    if (!user) throw redirect({ to: "/auth" });
    const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!data) throw redirect({ to: "/" });
  },
  head: () => ({
    meta: [
      { title: "Panel de administración | Haruén" },
      { name: "description", content: "Gestión de tienda, novedades, talleres y portada de Haruén." },
      { property: "og:title", content: "Panel de administración | Haruén" },
      { property: "og:description", content: "Gestión interna de Haruén." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Resumen", icon: LayoutDashboard, exact: true },
  { to: "/admin/productos", label: "Productos y stock", icon: Package },
  { to: "/admin/pedidos", label: "Pedidos", icon: ClipboardList },
  { to: "/admin/novedades", label: "Novedades", icon: Newspaper },
  { to: "/admin/talleres", label: "Talleres", icon: GraduationCap },
  { to: "/admin/secciones", label: "Secciones de la portada", icon: LayoutTemplate },
  { to: "/admin/ajustes", label: "Campaña y datos", icon: Settings },
  { to: "/admin/equipo", label: "Equipo", icon: Users },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <ul className="flex flex-col gap-1">
      {NAV.map((item) => (
        <li key={item.to}>
          <Link
            to={item.to}
            onClick={onNavigate}
            activeOptions={{ exact: "exact" in item }}
            className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-card hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
            activeProps={{ className: "bg-card !text-foreground shadow-soft" }}
          >
            <item.icon size={18} aria-hidden="true" className="shrink-0" /> {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function AdminLayout() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const current =
    [...NAV].sort((a, b) => b.to.length - a.to.length).find((n) => ("exact" in n ? pathname === n.to : pathname.startsWith(n.to)))?.label ?? "Panel";

  return (
    <div className="min-h-screen bg-muted/40 pt-[72px] lg:pt-[88px]">
      {/* Barra móvil */}
      <div className="sticky top-[64px] z-30 border-b border-border bg-background/95 backdrop-blur lg:hidden">
        <div className="haruen-container flex items-center gap-3 py-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Abrir menú del panel"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-card"
              >
                <Menu size={20} aria-hidden="true" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] max-w-xs bg-background p-4">
              <SheetHeader className="mb-4 p-0 text-left">
                <SheetTitle>Panel de administración</SheetTitle>
              </SheetHeader>
              <nav aria-label="Panel de administración">
                <NavList onNavigate={() => setOpen(false)} />
              </nav>
            </SheetContent>
          </Sheet>
          <p className="min-w-0 truncate font-bold">{current}</p>
        </div>
      </div>

      <div className="haruen-container grid gap-8 py-5 lg:grid-cols-[230px_minmax(0,1fr)] lg:py-8">
        <nav aria-label="Panel de administración" className="hidden self-start lg:sticky lg:top-[104px] lg:block">
          <NavList />
        </nav>
        <main className="min-w-0 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
