import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { LayoutDashboard, Package, ClipboardList, Newspaper, GraduationCap, LayoutTemplate, Settings, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

function AdminLayout() {
  return (
    <div className="min-h-screen bg-muted/40 pt-[88px]">
      <div className="haruen-container py-8 grid gap-8 lg:grid-cols-[230px_1fr]">
        <nav aria-label="Panel de administración" className="lg:sticky lg:top-[104px] self-start">
          <ul className="flex gap-1 overflow-x-auto lg:flex-col pb-2 lg:pb-0">
            {NAV.map((item) => (
              <li key={item.to} className="shrink-0">
                <Link
                  to={item.to}
                  activeOptions={{ exact: "exact" in item }}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-card hover:text-foreground"
                  activeProps={{ className: "bg-card !text-foreground shadow-soft" }}
                >
                  <item.icon size={16} aria-hidden="true" /> {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
