import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader, Panel } from "@/components/admin/admin-ui";

export const Route = createFileRoute("/_authenticated/admin/")({ component: Dashboard });

function Dashboard() {
  const { data } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const [orders, products, enrollments] = await Promise.all([
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("products").select("id, name, stock, low_stock_threshold").eq("status", "active"),
        supabase.from("workshop_enrollments").select("id", { count: "exact", head: true }).eq("status", "pending"),
      ]);
      const low = (products.data ?? []).filter((p) => p.stock <= p.low_stock_threshold);
      return { newOrders: orders.count ?? 0, pending: enrollments.count ?? 0, low, active: products.data?.length ?? 0 };
    },
  });

  const cards = [
    { label: "Pedidos nuevos por confirmar", value: data?.newOrders, to: "/admin/pedidos" as const },
    { label: "Inscripciones por aprobar", value: data?.pending, to: "/admin/talleres" as const },
    { label: "Productos publicados", value: data?.active, to: "/admin/productos" as const },
    { label: "Productos con poco stock", value: data?.low.length, to: "/admin/productos" as const },
  ];

  return (
    <>
      <AdminHeader title="Resumen" description="Lo que necesita tu atención hoy." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="rounded-[var(--radius)] border border-border bg-card p-5 shadow-soft hover:border-primary">
            <span className="block text-3xl font-bold">{c.value ?? "–"}</span>
            <span className="text-sm text-muted-foreground">{c.label}</span>
          </Link>
        ))}
      </div>
      {data && data.low.length > 0 && (
        <Panel className="mt-6">
          <h2 className="font-bold mb-3">Reponer pronto</h2>
          <ul className="divide-y divide-border">
            {data.low.map((p) => (
              <li key={p.id} className="flex justify-between py-2 text-sm">
                <Link to="/admin/productos/$id" params={{ id: p.id }} className="font-semibold hover:underline">{p.name}</Link>
                <span>{p.stock} en stock</span>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </>
  );
}
