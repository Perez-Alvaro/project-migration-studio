import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader, Panel, StatusPill } from "@/components/admin/admin-ui";
import { formatPrice } from "@/lib/types";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/admin/productos/")({ component: ProductsAdmin });

const STATUS = { active: ["Publicado", "ok"], draft: ["Borrador", "muted"], archived: ["Archivado", "muted"] } as const;

function ProductsAdmin() {
  const [q, setQ] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, stock, status, low_stock_threshold, category:categories(name), images:product_images(url, position), variants:product_variants(stock)")
        .order("position");
      if (error) throw error;
      return data ?? [];
    },
  });
  const rows = (data ?? []).filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <AdminHeader
        title="Productos y stock"
        description="Creá, editá y controlá el inventario de la tienda."
        actions={
          <>
            <Link to="/admin/productos/categorias" className="btn-pill btn-secondary-neutral !py-2 text-sm">Categorías</Link>
            <Link to="/admin/productos/$id" params={{ id: "nuevo" }} className="btn-pill btn-primary-gradient !py-2 text-sm inline-flex items-center gap-1.5">
              <Plus size={15} aria-hidden="true" /> Agregar producto
            </Link>
          </>
        }
      />
      <Panel className="!p-0 overflow-hidden">
        <div className="p-4 border-b border-border relative">
          <Search size={16} className="absolute left-7 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nombre" aria-label="Buscar productos" className="pl-9 max-w-sm" />
        </div>
        {isLoading ? (
          <p className="p-6 text-muted-foreground">Cargando productos…</p>
        ) : rows.length === 0 ? (
          <p className="p-6 text-muted-foreground">No hay productos con ese nombre. Agregá uno nuevo.</p>
        ) : (
          <>
          <ul className="divide-y divide-border sm:hidden">
            {rows.map((p) => {
              const stock = p.variants.length ? p.variants.reduce((a, v) => a + v.stock, 0) : p.stock;
              const rawImg = [...p.images].sort((a, b) => a.position - b.position)[0]?.url;
              const img = resolveProductImage(rawImg, p.slug);
              const [label, tone] = STATUS[p.status as keyof typeof STATUS] ?? ["—", "muted"];
              return (
                <li key={p.id}>
                  <Link to="/admin/productos/$id" params={{ id: p.id }} className="flex items-center gap-3 p-4 hover:bg-muted/40">
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                      {img && (
                        <img
                          src={img}
                          alt=""
                          onError={(e) => {
                            const fb = getProductAssetFallback(p.slug, rawImg);
                            if (fb && e.currentTarget.src !== fb) e.currentTarget.src = fb;
                          }}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{p.name}</span>
                      <span className="block text-sm">{formatPrice(Number(p.price))}</span>
                      <span className="mt-1 flex flex-wrap gap-1.5">
                        <StatusPill tone={tone}>{label}</StatusPill>
                        {stock <= 0 ? <StatusPill tone="bad">Sin stock</StatusPill> : stock <= p.low_stock_threshold ? <StatusPill tone="warn">{stock} · poco stock</StatusPill> : <StatusPill tone="muted">{stock} u.</StatusPill>}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left text-muted-foreground">
                <tr>
                  <th className="p-3 font-semibold">Producto</th>
                  <th className="p-3 font-semibold">Estado</th>
                  <th className="p-3 font-semibold">Stock</th>
                  <th className="p-3 font-semibold">Precio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((p) => {
                  const stock = p.variants.length ? p.variants.reduce((a, v) => a + v.stock, 0) : p.stock;
                  const rawImg = [...p.images].sort((a, b) => a.position - b.position)[0]?.url;
              const img = resolveProductImage(rawImg, p.slug);
                  const [label, tone] = STATUS[p.status as keyof typeof STATUS] ?? ["—", "muted"];
                  return (
                    <tr key={p.id} className="hover:bg-muted/40">
                      <td className="p-3">
                        <Link to="/admin/productos/$id" params={{ id: p.id }} className="flex items-center gap-3 font-semibold hover:underline">
                          <span className="relative w-10 h-10 rounded-md bg-muted overflow-hidden shrink-0">
                            {img && (
                              <img
                                src={img}
                                alt=""
                                onError={(e) => {
                                  const fb = getProductAssetFallback(p.slug, rawImg);
                                  if (fb && e.currentTarget.src !== fb) e.currentTarget.src = fb;
                                }}
                                className="absolute inset-0 h-full w-full object-cover"
                              />
                            )}
                          </span>
                          <span>
                            {p.name}
                            <span className="block text-xs font-normal text-muted-foreground">{p.category?.name ?? "Sin categoría"}</span>
                          </span>
                        </Link>
                      </td>
                      <td className="p-3"><StatusPill tone={tone}>{label}</StatusPill></td>
                      <td className="p-3">
                        {stock <= 0 ? <StatusPill tone="bad">Sin stock</StatusPill> : stock <= p.low_stock_threshold ? <StatusPill tone="warn">{stock} · poco stock</StatusPill> : stock}
                      </td>
                      <td className="p-3">{formatPrice(Number(p.price))}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          </>
        )}
      </Panel>
    </>
  );
}
