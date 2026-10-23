import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader, Panel, errorText } from "@/components/admin/admin-ui";
import { positionBetween, SECTION_TYPES, type SectionContent } from "@/lib/types";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/admin/secciones")({ component: SectionsAdmin });

const TYPE_LABEL: Record<string, string> = {
  hero: "Portada principal", campaign: "Campaña de donación", about: "Quiénes somos", impact: "Impacto",
  info: "Información", store: "Tienda", news: "Novedades", workshops: "Talleres virtuales", donate: "Cómo donar", contact: "Contacto",
};
const EDITABLE_TITLE = new Set(["store", "news", "workshops"]);

function SectionsAdmin() {
  const qc = useQueryClient();
  const [adding, setAdding] = useState("");
  const { data, refetch } = useQuery({
    queryKey: ["admin", "sections"],
    queryFn: async () => (await supabase.from("page_sections").select("*").order("position")).data ?? [],
  });
  const rows = data ?? [];

  const done = () => { refetch(); qc.invalidateQueries({ queryKey: ["home"] }); };

  async function update(id: string, patch: { position?: number; is_visible?: boolean; content?: never }) {
    const { error } = await supabase.from("page_sections").update(patch).eq("id", id);
    if (error) { toast.error(errorText(error)); return; }
    done();
  }

  function move(i: number, dir: -1 | 1) {
    const target = i + dir;
    if (target < 0 || target >= rows.length) return;
    // Interpolate between the two neighbours on the destination side.
    const before = dir === -1 ? rows[target - 1]?.position ?? null : rows[target]!.position;
    const after = dir === -1 ? rows[target]!.position : rows[target + 1]?.position ?? null;
    update(rows[i]!.id, { position: positionBetween(before == null ? null : Number(before), after == null ? null : Number(after)) });
  }

  async function add() {
    if (!adding) return;
    const last = rows.at(-1)?.position;
    const { error } = await supabase.from("page_sections").insert({ type: adding, label: TYPE_LABEL[adding] ?? adding, position: positionBetween(last == null ? null : Number(last), null), is_visible: true, content: {} });
    if (error) { toast.error(errorText(error)); return; }
    setAdding("");
    done();
  }

  async function remove(id: string) {
    if (!confirm("¿Quitar esta sección de la portada? Podés volver a agregarla cuando quieras.")) return;
    const { error } = await supabase.from("page_sections").delete().eq("id", id);
    if (error) { toast.error(errorText(error)); return; }
    done();
  }

  const missing = SECTION_TYPES.filter((t) => !rows.some((r) => r.type === t));

  return (
    <>
      <AdminHeader title="Secciones de la portada" description="Ordená, ocultá, quitá o agregá bloques. Los cambios se ven al instante en la página de inicio." />
      <Panel className="!p-0">
        <ol className="divide-y divide-border">
          {rows.map((s, i) => {
            const content = (s.content ?? {}) as SectionContent;
            return (
              <li key={s.id} className="flex flex-wrap items-center gap-3 p-4">
                <div className="flex flex-col">
                  <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="p-1 rounded hover:bg-muted disabled:opacity-30" aria-label={`Subir ${s.label}`}><ArrowUp size={15} aria-hidden="true" /></button>
                  <button type="button" disabled={i === rows.length - 1} onClick={() => move(i, 1)} className="p-1 rounded hover:bg-muted disabled:opacity-30" aria-label={`Bajar ${s.label}`}><ArrowDown size={15} aria-hidden="true" /></button>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <span className={s.is_visible ? "font-semibold" : "font-semibold text-muted-foreground line-through"}>{TYPE_LABEL[s.type] ?? s.label}</span>
                  {EDITABLE_TITLE.has(s.type) && (
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      <Input defaultValue={content.title ?? ""} placeholder="Título (opcional)" aria-label={`Título de ${s.label}`} className="h-9" onBlur={(e) => e.target.value !== (content.title ?? "") && update(s.id, { content: { ...content, title: e.target.value } as never })} />
                      <Input defaultValue={content.subtitle ?? ""} placeholder="Bajada (opcional)" aria-label={`Bajada de ${s.label}`} className="h-9" onBlur={(e) => e.target.value !== (content.subtitle ?? "") && update(s.id, { content: { ...content, subtitle: e.target.value } as never })} />
                    </div>
                  )}
                </div>
                <button type="button" onClick={() => update(s.id, { is_visible: !s.is_visible })} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-semibold hover:bg-muted" aria-pressed={s.is_visible}>
                  {s.is_visible ? <><Eye size={14} aria-hidden="true" /> Visible</> : <><EyeOff size={14} aria-hidden="true" /> Oculta</>}
                </button>
                <button type="button" onClick={() => remove(s.id)} className="p-2 rounded hover:bg-muted" aria-label={`Quitar ${s.label}`}><Trash2 size={15} aria-hidden="true" /></button>
              </li>
            );
          })}
        </ol>
      </Panel>
      {missing.length > 0 && (
        <Panel className="mt-6 flex flex-wrap items-end gap-3">
          <div className="space-y-1.5">
            <label htmlFor="add-section" className="text-sm font-medium">Agregar sección</label>
            <select id="add-section" value={adding} onChange={(e) => setAdding(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm block">
              <option value="">Elegí un bloque</option>
              {missing.map((t) => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
            </select>
          </div>
          <button type="button" disabled={!adding} onClick={add} className="btn-pill btn-primary-gradient !py-2 text-sm inline-flex items-center gap-1.5 disabled:opacity-50"><Plus size={15} aria-hidden="true" /> Agregar al final</button>
        </Panel>
      )}
    </>
  );
}
