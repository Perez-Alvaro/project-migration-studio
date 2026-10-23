import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader, ImageUpload, Panel, StatusPill, errorText } from "@/components/admin/admin-ui";
import { formatDate, slugify } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/admin/novedades")({ component: NewsAdmin });

type Draft = { id?: string; title: string; slug: string; excerpt: string; body: string; cover_url: string | null; status: string; published_at: string | null };
const EMPTY: Draft = { title: "", slug: "", excerpt: "", body: "", cover_url: null, status: "draft", published_at: null };

function NewsAdmin() {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const { data, refetch } = useQuery({
    queryKey: ["admin", "news"],
    queryFn: async () => (await supabase.from("news_posts").select("*").order("created_at", { ascending: false })).data ?? [],
  });

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!draft) return;
    setSaving(true);
    const row = {
      title: draft.title.trim(), slug: draft.slug || slugify(draft.title), excerpt: draft.excerpt, body: draft.body,
      cover_url: draft.cover_url, status: draft.status,
      published_at: draft.status === "published" ? draft.published_at ?? new Date().toISOString() : draft.published_at,
    };
    const { error } = draft.id ? await supabase.from("news_posts").update(row).eq("id", draft.id) : await supabase.from("news_posts").insert(row);
    setSaving(false);
    if (error) { toast.error(errorText(error)); return; }
    toast.success(draft.status === "published" ? "Novedad publicada." : "Guardamos el borrador.");
    setDraft(null);
    refetch();
    qc.invalidateQueries({ queryKey: ["news"] });
    qc.invalidateQueries({ queryKey: ["home"] });
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar esta novedad? No se puede deshacer.")) return;
    const { error } = await supabase.from("news_posts").delete().eq("id", id);
    if (error) { toast.error(errorText(error)); return; }
    setDraft(null);
    refetch();
  }

  if (draft) {
    return (
      <form onSubmit={save}>
        <AdminHeader
          title={draft.id ? "Editar novedad" : "Nueva novedad"}
          actions={
            <>
              <button type="button" onClick={() => setDraft(null)} className="btn-pill btn-secondary-neutral !py-2 text-sm">Volver</button>
              <button type="submit" disabled={saving} className="btn-pill btn-primary-gradient !py-2 text-sm">{saving ? "Guardando…" : "Guardar cambios"}</button>
            </>
          }
        />
        <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
          <Panel className="space-y-4">
            <div className="space-y-1.5"><Label htmlFor="n-title">Título</Label><Input id="n-title" required value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value, slug: draft.id ? draft.slug : slugify(e.target.value) })} /></div>
            <div className="space-y-1.5"><Label htmlFor="n-slug">Dirección web</Label><Input id="n-slug" required value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: slugify(e.target.value) })} /></div>
            <div className="space-y-1.5"><Label htmlFor="n-excerpt">Resumen</Label><Textarea id="n-excerpt" rows={2} value={draft.excerpt} onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })} /></div>
            <div className="space-y-1.5">
              <Label htmlFor="n-body">Texto</Label>
              <Textarea id="n-body" rows={14} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
              <p className="text-xs text-muted-foreground">Dejá una línea en blanco entre párrafos. Empezá con «## » para un subtítulo y con «- » para una lista.</p>
            </div>
          </Panel>
          <Panel className="space-y-4 self-start">
            <div className="space-y-1.5">
              <Label htmlFor="n-status">Estado</Label>
              <select id="n-status" value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="draft">Borrador</option>
                <option value="published">Publicada</option>
              </select>
            </div>
            <ImageUpload folder="novedades" label="Imagen de portada" value={draft.cover_url} onChange={(v) => setDraft({ ...draft, cover_url: v })} />
            {draft.id && <button type="button" onClick={() => remove(draft.id!)} className="inline-flex items-center gap-1.5 text-sm text-destructive"><Trash2 size={14} aria-hidden="true" /> Eliminar novedad</button>}
          </Panel>
        </div>
      </form>
    );
  }

  return (
    <>
      <AdminHeader
        title="Novedades"
        description="Noticias y eventos que aparecen en la portada y en /novedades."
        actions={<button type="button" onClick={() => setDraft(EMPTY)} className="btn-pill btn-primary-gradient !py-2 text-sm inline-flex items-center gap-1.5"><Plus size={15} aria-hidden="true" /> Escribir novedad</button>}
      />
      <Panel className="!p-0">
        {!data?.length ? (
          <p className="p-6 text-muted-foreground">Escribí la primera novedad para contarle a la comunidad qué está pasando.</p>
        ) : (
          <ul className="divide-y divide-border">
            {data.map((n) => (
              <li key={n.id}>
                <button type="button" onClick={() => setDraft(n)} className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-muted/40">
                  <span>
                    <span className="font-semibold block">{n.title}</span>
                    <span className="text-xs text-muted-foreground">{n.published_at ? formatDate(n.published_at) : "Sin publicar"}</span>
                  </span>
                  <StatusPill tone={n.status === "published" ? "ok" : "muted"}>{n.status === "published" ? "Publicada" : "Borrador"}</StatusPill>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
