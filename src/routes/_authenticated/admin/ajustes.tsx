import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader, Panel, errorText } from "@/components/admin/admin-ui";
import { settingsQuery } from "@/lib/queries";
import type { SiteSettings } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/admin/ajustes")({ component: SettingsAdmin });

function SettingsAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery(settingsQuery);
  const [s, setS] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (data && !s) setS(structuredClone(data)); }, [data, s]);
  if (!s) return <p className="text-muted-foreground">Cargando ajustes…</p>;

  const camp = (k: keyof SiteSettings["campaign"], v: string | number) => setS({ ...s, campaign: { ...s.campaign, [k]: v } });
  const bank = (k: keyof SiteSettings["bank"], v: string) => setS({ ...s, bank: { ...s.bank, [k]: v } });

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!s) return;
    setSaving(true);
    const rows = [
      { key: "whatsapp_number", value: s.whatsappNumber.replace(/\D/g, "") },
      { key: "campaign_status", value: s.campaignStatus },
      { key: "campaign", value: s.campaign },
      { key: "bank", value: s.bank },
    ];
    const { error } = await supabase.from("site_settings").upsert(rows as never, { onConflict: "key" });
    setSaving(false);
    if (error) return toast.error(errorText(error));
    toast.success("Guardamos los ajustes.");
    qc.invalidateQueries({ queryKey: settingsQuery.queryKey });
  }

  return (
    <form onSubmit={save}>
      <AdminHeader title="Campaña y datos" description="Actualizá el avance de la campaña, los datos bancarios y el WhatsApp de pedidos." actions={<button type="submit" disabled={saving} className="btn-pill btn-primary-gradient !py-2 text-sm">{saving ? "Guardando…" : "Guardar cambios"}</button>} />
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel className="space-y-4">
          <h2 className="font-bold">Campaña de donación</h2>
          <div className="space-y-1.5">
            <Label htmlFor="c-status">Etapa</Label>
            <select id="c-status" value={s.campaignStatus} onChange={(e) => setS({ ...s, campaignStatus: e.target.value as SiteSettings["campaignStatus"] })} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
              <option value="iniciada">Recién empieza</option>
              <option value="en_progreso">En progreso</option>
              <option value="finalizada">Meta cumplida</option>
            </select>
          </div>
          <div className="space-y-1.5"><Label htmlFor="c-title">Título</Label><Input id="c-title" value={s.campaign.titulo} onChange={(e) => camp("titulo", e.target.value)} /></div>
          <div className="space-y-1.5"><Label htmlFor="c-sub">Bajada</Label><Textarea id="c-sub" rows={3} value={s.campaign.subtitulo} onChange={(e) => camp("subtitulo", e.target.value)} /></div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5"><Label htmlFor="c-meta">Meta ($)</Label><Input id="c-meta" type="number" min={0} value={s.campaign.meta} onChange={(e) => camp("meta", Number(e.target.value))} /></div>
            <div className="space-y-1.5"><Label htmlFor="c-raised">Recaudado ($)</Label><Input id="c-raised" type="number" min={0} value={s.campaign.recaudado} onChange={(e) => camp("recaudado", Number(e.target.value))} /></div>
            <div className="space-y-1.5"><Label htmlFor="c-donors">Donantes</Label><Input id="c-donors" type="number" min={0} value={s.campaign.donantes} onChange={(e) => camp("donantes", Number(e.target.value))} /></div>
          </div>
        </Panel>
        <div className="flex flex-col gap-6">
          <Panel className="space-y-4">
            <h2 className="font-bold">Datos para transferencias</h2>
            {(["alias", "cbu", "banco", "cuit", "titular"] as const).map((k) => (
              <div key={k} className="space-y-1.5"><Label htmlFor={`b-${k}`} className="capitalize">{k === "cbu" ? "CBU" : k === "cuit" ? "CUIT" : k}</Label><Input id={`b-${k}`} value={s.bank[k]} onChange={(e) => bank(k, e.target.value)} /></div>
            ))}
          </Panel>
          <Panel className="space-y-1.5">
            <Label htmlFor="wa">WhatsApp para pedidos y consultas</Label>
            <Input id="wa" inputMode="tel" value={s.whatsappNumber} onChange={(e) => setS({ ...s, whatsappNumber: e.target.value })} />
            <p className="text-xs text-muted-foreground">Con código de país, sin espacios. Ej.: 5493517680218</p>
          </Panel>
        </div>
      </div>
    </form>
  );
}
