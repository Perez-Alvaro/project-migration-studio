import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader, Panel, StatusPill, errorText } from "@/components/admin/admin-ui";
import { formatPrice } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/pedidos")({ component: Orders });

const STATUS = {
  new: { label: "Nuevo", tone: "warn" },
  confirmed: { label: "Confirmado", tone: "ok" },
  delivered: { label: "Entregado", tone: "muted" },
  cancelled: { label: "Cancelado", tone: "bad" },
} as const;
type Status = keyof typeof STATUS;

function Orders() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Status | "all">("new");
  const [busy, setBusy] = useState<string | null>(null);
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "orders", filter],
    queryFn: async () => {
      let q = supabase.from("orders").select("*, items:order_items(id, name, quantity, unit_price)").order("created_at", { ascending: false }).limit(200);
      if (filter !== "all") q = q.eq("status", filter);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });

  async function setStatus(id: string, status: Status) {
    setBusy(id);
    const { error } = await supabase.rpc("set_order_status", { _order_id: id, _status: status });
    setBusy(null);
    if (error) return toast.error(errorText(error));
    toast.success(status === "confirmed" ? "Pedido confirmado. Descontamos el stock." : "Actualizamos el pedido.");
    qc.invalidateQueries({ queryKey: ["admin"] });
    qc.invalidateQueries({ queryKey: ["products"] });
  }

  return (
    <>
      <AdminHeader title="Pedidos" description="Llegan desde el carrito. Confirmalos cuando acuerdes el pago por WhatsApp: ahí se descuenta el stock." />
      <div className="flex flex-wrap gap-2 mb-4" role="tablist" aria-label="Filtrar pedidos">
        {(["new", "confirmed", "delivered", "cancelled", "all"] as const).map((s) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={filter === s}
            onClick={() => setFilter(s)}
            className={cn("rounded-full border border-border px-4 py-1.5 text-sm font-semibold", filter === s ? "bg-foreground text-background" : "bg-card")}
          >
            {s === "all" ? "Todos" : STATUS[s].label}
          </button>
        ))}
      </div>
      {isLoading ? (
        <p className="text-muted-foreground">Cargando pedidos…</p>
      ) : !data?.length ? (
        <Panel><p className="text-muted-foreground">No hay pedidos en este estado.</p></Panel>
      ) : (
        <div className="flex flex-col gap-4">
          {data.map((o) => {
            const st = STATUS[o.status as Status] ?? STATUS.new;
            const phone = o.customer_phone.replace(/\D/g, "");
            return (
              <Panel key={o.id} className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-lg">{o.code}</span>
                    <span className="ml-2 text-sm text-muted-foreground">{new Date(o.created_at).toLocaleString("es-AR")}</span>
                  </div>
                  <StatusPill tone={st.tone}>{st.label}</StatusPill>
                </div>
                <p className="text-sm"><strong>{o.customer_name}</strong>{o.customer_phone && ` · ${o.customer_phone}`}</p>
                <ul className="text-sm divide-y divide-border">
                  {o.items.map((i) => (
                    <li key={i.id} className="flex justify-between py-1.5"><span>{i.quantity} × {i.name}</span><span>{formatPrice(Number(i.unit_price) * i.quantity)}</span></li>
                  ))}
                </ul>
                {o.notes && <p className="text-sm text-muted-foreground">Nota: {o.notes}</p>}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border">
                  <span className="font-bold">Total {formatPrice(Number(o.total))}</span>
                  <div className="flex flex-wrap gap-2">
                    {phone && (
                      <a href={`https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-semibold hover:bg-muted">
                        <MessageCircle size={14} aria-hidden="true" /> Escribir
                      </a>
                    )}
                    {o.status === "new" && <button type="button" disabled={busy === o.id} onClick={() => setStatus(o.id, "confirmed")} className="btn-pill btn-primary-gradient !py-1.5 text-sm">Confirmar pago</button>}
                    {o.status === "confirmed" && <button type="button" disabled={busy === o.id} onClick={() => setStatus(o.id, "delivered")} className="btn-pill btn-primary-gradient !py-1.5 text-sm">Marcar entregado</button>}
                    {o.status !== "cancelled" && o.status !== "delivered" && (
                      <button type="button" disabled={busy === o.id} onClick={() => confirm("¿Cancelar este pedido? Si ya estaba confirmado, el stock vuelve.") && setStatus(o.id, "cancelled")} className="rounded-full border border-border px-3 py-1.5 text-sm font-semibold hover:bg-muted">Cancelar</button>
                    )}
                  </div>
                </div>
              </Panel>
            );
          })}
        </div>
      )}
    </>
  );
}
