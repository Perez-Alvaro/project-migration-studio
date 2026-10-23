import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { ArrowLeft, FileUp, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader, ImageUpload, Panel, StatusPill, errorText } from "@/components/admin/admin-ui";
import { slugify } from "@/lib/types";
import { formatBytes, uploadMaterial } from "@/lib/upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/admin/talleres/$id")({ component: WorkshopEditor });

function WorkshopEditor() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["admin", "workshop", id],
    queryFn: async () => {
      const [w, lessons, materials, enrollments] = await Promise.all([
        supabase.from("workshops").select("*").eq("id", id).single(),
        supabase.from("workshop_lessons").select("*").eq("workshop_id", id).order("position"),
        supabase.from("workshop_materials").select("*").eq("workshop_id", id).order("position"),
        supabase.from("workshop_enrollments").select("id, status, created_at, user_id").eq("workshop_id", id).order("created_at"),
      ]);
      if (w.error) throw w.error;
      const ids = (enrollments.data ?? []).map((e) => e.user_id);
      const profiles = ids.length ? (await supabase.from("profiles").select("id, email, full_name").in("id", ids)).data ?? [] : [];
      return { workshop: w.data, lessons: lessons.data ?? [], materials: materials.data ?? [], enrollments: enrollments.data ?? [], profiles };
    },
  });

  const [info, setInfo] = useState<Record<string, string | null>>({});
  useEffect(() => {
    if (!data) return;
    const w = data.workshop;
    setInfo({ title: w.title, slug: w.slug, summary: w.summary, description: w.description, teacher: w.teacher, modality: w.modality, starts_on: w.starts_on, ends_on: w.ends_on, status: w.status, cover_url: w.cover_url });
  }, [data]);

  const invalidate = () => {
    refetch();
    qc.invalidateQueries({ queryKey: ["admin", "workshops"] });
    qc.invalidateQueries({ queryKey: ["workshops"] });
    qc.invalidateQueries({ queryKey: ["home"] });
  };

  async function saveInfo(e: FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("workshops").update({
      title: info.title ?? "", slug: slugify(info.slug ?? ""), summary: info.summary ?? "", description: info.description ?? "",
      teacher: info.teacher ?? "", modality: info.modality ?? "virtual", starts_on: info.starts_on || null, ends_on: info.ends_on || null,
      status: info.status ?? "draft", cover_url: info.cover_url ?? null,
    }).eq("id", id);
    if (error) { toast.error(errorText(error)); return; }
    toast.success("Guardamos el taller.");
    invalidate();
  }

  async function removeWorkshop() {
    if (!confirm("¿Eliminar este taller con sus clases, material e inscripciones? No se puede deshacer.")) return;
    if (data?.materials.length) await supabase.storage.from("workshop-materials").remove(data.materials.map((m) => m.file_path));
    const { error } = await supabase.from("workshops").delete().eq("id", id);
    if (error) { toast.error(errorText(error)); return; }
    invalidate();
    navigate({ to: "/admin/talleres" });
  }

  if (isLoading) return <p className="text-muted-foreground">Cargando taller…</p>;
  if (!data) return <p role="alert">No encontramos este taller.</p>;
  const field = (k: string) => ({ value: info[k] ?? "", onChange: (e: { target: { value: string } }) => setInfo((s) => ({ ...s, [k]: e.target.value })) });

  return (
    <>
      <Link to="/admin/talleres" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft size={14} aria-hidden="true" /> Talleres
      </Link>
      <form onSubmit={saveInfo}>
        <AdminHeader
          title={info.title || "Taller"}
          actions={
            <>
              {info.status === "published" && <Link to="/talleres/$slug" params={{ slug: data.workshop.slug }} target="_blank" className="btn-pill btn-secondary-neutral !py-2 text-sm">Ver publicado</Link>}
              <button type="submit" className="btn-pill btn-primary-gradient !py-2 text-sm">Guardar cambios</button>
            </>
          }
        />
        <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
          <Panel className="space-y-4">
            <div className="space-y-1.5"><Label htmlFor="w-title">Título</Label><Input id="w-title" required {...field("title")} /></div>
            <div className="space-y-1.5"><Label htmlFor="w-slug">Dirección web</Label><Input id="w-slug" required {...field("slug")} /></div>
            <div className="space-y-1.5"><Label htmlFor="w-summary">Resumen</Label><Textarea id="w-summary" rows={2} {...field("summary")} /></div>
            <div className="space-y-1.5"><Label htmlFor="w-desc">Descripción</Label><Textarea id="w-desc" rows={8} {...field("description")} /></div>
          </Panel>
          <Panel className="space-y-4 self-start">
            <div className="space-y-1.5">
              <Label htmlFor="w-status">Estado</Label>
              <select id="w-status" {...field("status")} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
                <option value="archived">Archivado</option>
              </select>
            </div>
            <div className="space-y-1.5"><Label htmlFor="w-teacher">Docente</Label><Input id="w-teacher" {...field("teacher")} /></div>
            <div className="space-y-1.5"><Label htmlFor="w-mod">Modalidad</Label><Input id="w-mod" placeholder="virtual" {...field("modality")} /></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5"><Label htmlFor="w-start">Inicio</Label><Input id="w-start" type="date" {...field("starts_on")} /></div>
              <div className="space-y-1.5"><Label htmlFor="w-end">Fin</Label><Input id="w-end" type="date" {...field("ends_on")} /></div>
            </div>
            <ImageUpload folder="talleres" label="Imagen de portada" value={info.cover_url ?? null} onChange={(v) => setInfo((s) => ({ ...s, cover_url: v }))} />
            <button type="button" onClick={removeWorkshop} className="inline-flex items-center gap-1.5 text-sm text-destructive"><Trash2 size={14} aria-hidden="true" /> Eliminar taller</button>
          </Panel>
        </div>
      </form>

      <Enrollments enrollments={data.enrollments} profiles={data.profiles} onChange={invalidate} />
      <Lessons workshopId={id} lessons={data.lessons} onChange={invalidate} />
      <Materials workshopId={id} lessons={data.lessons} materials={data.materials} onChange={invalidate} />
    </>
  );
}

function Enrollments({ enrollments, profiles, onChange }: {
  enrollments: { id: string; status: string; user_id: string }[];
  profiles: { id: string; email: string | null; full_name: string | null }[];
  onChange: () => void;
}) {
  async function set(id: string, status: string) {
    const { error } = await supabase.from("workshop_enrollments").update({ status }).eq("id", id);
    if (error) { toast.error(errorText(error)); return; }
    onChange();
  }
  return (
    <Panel className="mt-6">
      <h2 className="font-bold text-lg mb-3">Inscripciones</h2>
      {enrollments.length === 0 ? (
        <p className="text-sm text-muted-foreground">Todavía nadie pidió inscribirse. Compartí el taller cuando esté publicado.</p>
      ) : (
        <ul className="divide-y divide-border">
          {enrollments.map((e) => {
            const p = profiles.find((x) => x.id === e.user_id);
            return (
              <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                <span className="text-sm"><strong>{p?.full_name || "Sin nombre"}</strong> <span className="text-muted-foreground">{p?.email}</span></span>
                <span className="flex items-center gap-2">
                  <StatusPill tone={e.status === "approved" ? "ok" : e.status === "pending" ? "warn" : "muted"}>
                    {e.status === "approved" ? "Aprobada" : e.status === "pending" ? "Pendiente" : "Revocada"}
                  </StatusPill>
                  {e.status !== "approved" && <button type="button" onClick={() => set(e.id, "approved")} className="btn-pill btn-primary-gradient !py-1 !px-3 text-xs">Aprobar</button>}
                  {e.status !== "revoked" && <button type="button" onClick={() => set(e.id, "revoked")} className="rounded-full border border-border px-3 py-1 text-xs font-semibold hover:bg-muted">Revocar</button>}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}

function Lessons({ workshopId, lessons, onChange }: {
  workshopId: string;
  lessons: { id: string; title: string; body: string; video_url: string | null; position: number }[];
  onChange: () => void;
}) {
  const [edit, setEdit] = useState<{ id?: string; title: string; body: string; video_url: string } | null>(null);
  async function save(e: FormEvent) {
    e.preventDefault();
    if (!edit) return;
    const row = { title: edit.title, body: edit.body, video_url: edit.video_url || null };
    const { error } = edit.id
      ? await supabase.from("workshop_lessons").update(row).eq("id", edit.id)
      : await supabase.from("workshop_lessons").insert({ ...row, workshop_id: workshopId, position: Number(lessons.at(-1)?.position ?? 0) + 1 });
    if (error) { toast.error(errorText(error)); return; }
    setEdit(null);
    onChange();
  }
  async function remove(id: string) {
    if (!confirm("¿Eliminar esta clase?")) return;
    const { error } = await supabase.from("workshop_lessons").delete().eq("id", id);
    if (error) { toast.error(errorText(error)); return; }
    onChange();
  }
  return (
    <Panel className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-lg">Clases</h2>
        {!edit && <button type="button" onClick={() => setEdit({ title: "", body: "", video_url: "" })} className="inline-flex items-center gap-1 text-sm font-semibold underline underline-offset-4"><Plus size={14} aria-hidden="true" /> Agregar clase</button>}
      </div>
      {edit && (
        <form onSubmit={save} className="space-y-3 mb-4 rounded-xl border border-border p-4">
          <div className="space-y-1.5"><Label htmlFor="l-title">Título de la clase</Label><Input id="l-title" required value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} /></div>
          <div className="space-y-1.5"><Label htmlFor="l-video">Enlace al video (YouTube, Meet, Drive)</Label><Input id="l-video" type="url" value={edit.video_url} onChange={(e) => setEdit({ ...edit, video_url: e.target.value })} /></div>
          <div className="space-y-1.5"><Label htmlFor="l-body">Contenido</Label><Textarea id="l-body" rows={5} value={edit.body} onChange={(e) => setEdit({ ...edit, body: e.target.value })} /></div>
          <div className="flex gap-2">
            <button type="submit" className="btn-pill btn-primary-gradient !py-1.5 text-sm">Guardar clase</button>
            <button type="button" onClick={() => setEdit(null)} className="rounded-full border border-border px-4 py-1.5 text-sm font-semibold">Cancelar</button>
          </div>
        </form>
      )}
      {lessons.length === 0 && !edit ? (
        <p className="text-sm text-muted-foreground">Agregá la primera clase del taller.</p>
      ) : (
        <ol className="divide-y divide-border">
          {lessons.map((l, i) => (
            <li key={l.id} className="flex items-center justify-between gap-2 py-2.5">
              <button type="button" className="text-left text-sm font-semibold hover:underline" onClick={() => setEdit({ id: l.id, title: l.title, body: l.body, video_url: l.video_url ?? "" })}>
                Clase {i + 1}: {l.title}
              </button>
              <button type="button" onClick={() => remove(l.id)} className="p-1.5 rounded hover:bg-muted" aria-label={`Eliminar clase ${l.title}`}><Trash2 size={15} aria-hidden="true" /></button>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  );
}

function Materials({ workshopId, lessons, materials, onChange }: {
  workshopId: string;
  lessons: { id: string; title: string }[];
  materials: { id: string; title: string; file_name: string; file_path: string; size_bytes: number; lesson_id: string | null; position: number }[];
  onChange: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [lessonId, setLessonId] = useState("");
  const [busy, setBusy] = useState(false);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    try {
      let pos = Number(materials.at(-1)?.position ?? 0);
      for (const file of Array.from(files)) {
        const { path } = await uploadMaterial(file, workshopId);
        const { error } = await supabase.from("workshop_materials").insert({
          workshop_id: workshopId, lesson_id: lessonId || null, title: file.name.replace(/\.[^.]+$/, ""),
          file_path: path, file_name: file.name, mime_type: file.type, size_bytes: file.size, position: ++pos,
        });
        if (error) throw error;
      }
      toast.success("Subimos el material.");
      onChange();
    } catch (e) {
      toast.error(errorText(e));
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  }

  async function remove(m: { id: string; file_path: string }) {
    if (!confirm("¿Eliminar este archivo?")) return;
    await supabase.storage.from("workshop-materials").remove([m.file_path]);
    const { error } = await supabase.from("workshop_materials").delete().eq("id", m.id);
    if (error) { toast.error(errorText(error)); return; }
    onChange();
  }

  async function rename(id: string, title: string) {
    const { error } = await supabase.from("workshop_materials").update({ title }).eq("id", id);
    if (error) toast.error(errorText(error));
  }

  return (
    <Panel className="mt-6">
      <h2 className="font-bold text-lg mb-1">Material descargable</h2>
      <p className="text-sm text-muted-foreground mb-4">PDF o Word, hasta 20 MB. Solo lo descargan personas con inscripción aprobada.</p>
      <div className="flex flex-wrap items-end gap-3 mb-4">
        <div className="space-y-1.5">
          <Label htmlFor="m-lesson">Asociar a</Label>
          <select id="m-lesson" value={lessonId} onChange={(e) => setLessonId(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option value="">Material general del taller</option>
            {lessons.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
          </select>
        </div>
        <button type="button" disabled={busy} onClick={() => ref.current?.click()} className="btn-pill btn-primary-gradient !py-2 text-sm inline-flex items-center gap-1.5 disabled:opacity-60">
          <FileUp size={15} aria-hidden="true" /> {busy ? "Subiendo…" : "Subir archivos"}
        </button>
        <input ref={ref} type="file" multiple accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="sr-only" aria-label="Subir material" onChange={(e) => onFiles(e.target.files)} />
      </div>
      {materials.length === 0 ? (
        <p className="text-sm text-muted-foreground">Subí guías, fichas o presentaciones para tus alumnos.</p>
      ) : (
        <ul className="divide-y divide-border">
          {materials.map((m) => (
            <li key={m.id} className="flex flex-wrap items-center gap-3 py-2.5">
              <Input defaultValue={m.title} onBlur={(e) => e.target.value !== m.title && rename(m.id, e.target.value)} aria-label={`Título de ${m.file_name}`} className="max-w-xs h-9" />
              <span className="text-xs text-muted-foreground flex-1">
                {m.file_name} · {formatBytes(m.size_bytes)} · {lessons.find((l) => l.id === m.lesson_id)?.title ?? "General"}
              </span>
              <button type="button" onClick={() => remove(m)} className="p-1.5 rounded hover:bg-muted" aria-label={`Eliminar ${m.file_name}`}><Trash2 size={15} aria-hidden="true" /></button>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
