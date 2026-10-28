import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Download, FileText, Lock, PlayCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { formatBytes } from "@/lib/upload";
import { RichText } from "@/components/shared/rich-text";

/** Enrollment state + lessons and materials (visible only once the team approves). */
export function WorkshopAccess({ workshopId, slug }: { workshopId: string; slug: string }) {
  const { user, isAdmin, loading } = useAuth();
  const qc = useQueryClient();
  const [requesting, setRequesting] = useState(false);

  const enrollment = useQuery({
    queryKey: ["enrollment", workshopId, user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("workshop_enrollments")
        .select("id, status")
        .eq("workshop_id", workshopId)
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
  });

  const canSee = isAdmin || enrollment.data?.status === "approved";

  const content = useQuery({
    queryKey: ["workshop-content", workshopId, user?.id],
    enabled: !!user && canSee,
    queryFn: async () => {
      const [lessons, materials] = await Promise.all([
        supabase.from("workshop_lessons").select("id, title, body, video_url, position").eq("workshop_id", workshopId).order("position"),
        supabase.from("workshop_materials").select("id, title, file_path, file_name, size_bytes, lesson_id, position").eq("workshop_id", workshopId).order("position"),
      ]);
      if (lessons.error || materials.error) throw new Error("No pudimos cargar las clases.");
      return { lessons: lessons.data ?? [], materials: materials.data ?? [] };
    },
  });

  async function requestEnrollment() {
    if (!user) return;
    setRequesting(true);
    const { error } = await supabase.from("workshop_enrollments").insert({ workshop_id: workshopId, user_id: user.id });
    setRequesting(false);
    if (error) {
      toast.error("No pudimos enviar tu solicitud. Probá de nuevo.");
      return;
    }
    toast.success("Recibimos tu solicitud. Te avisamos cuando el equipo la apruebe.");
    qc.invalidateQueries({ queryKey: ["enrollment", workshopId] });
  }

  async function download(path: string, fileName: string) {
    const { data, error } = await supabase.storage.from("workshop-materials").createSignedUrl(path, 10, { download: fileName });
    if (error || !data) {
      toast.error("No pudimos preparar la descarga. Probá de nuevo.");
      return;
    }
    window.location.href = data.signedUrl;
  }

  if (loading) return <div className="haruen-card h-32 animate-pulse" aria-hidden="true" />;

  if (!user) {
    return (
      <div className="haruen-card flex flex-col gap-3">
        <h2 className="text-xl font-bold flex items-center gap-2"><Lock size={18} aria-hidden="true" /> Clases y material para inscriptos</h2>
        <p className="text-muted-foreground">Creá tu cuenta o ingresá para pedir tu lugar en este taller.</p>
        <Link to="/auth" search={{ redirect: `/talleres/${slug}` }} className="btn-pill btn-primary-gradient self-start">
          Ingresar para inscribirme
        </Link>
      </div>
    );
  }

  if (!canSee) {
    const status = enrollment.data?.status;
    return (
      <div className="haruen-card flex flex-col gap-3">
        <h2 className="text-xl font-bold flex items-center gap-2"><Lock size={18} aria-hidden="true" /> Clases y material para inscriptos</h2>
        {status === "pending" ? (
          <p role="status" className="text-muted-foreground">Tu solicitud está en revisión. Te avisamos apenas el equipo la apruebe.</p>
        ) : status === "revoked" ? (
          <p className="text-muted-foreground">Tu inscripción no está activa. Escribinos por WhatsApp si creés que es un error.</p>
        ) : (
          <>
            <p className="text-muted-foreground">Pedí tu lugar y el equipo de Haruén habilita tu acceso.</p>
            <button type="button" onClick={requestEnrollment} disabled={requesting} className="btn-pill btn-primary-gradient self-start disabled:opacity-60">
              {requesting ? "Enviando…" : "Solicitar inscripción"}
            </button>
          </>
        )}
      </div>
    );
  }

  if (content.isLoading) return <div className="haruen-card h-32 animate-pulse" aria-hidden="true" />;
  if (content.error || !content.data) return <p className="haruen-card">No pudimos cargar las clases. Recargá la página.</p>;

  const { lessons, materials } = content.data;
  const general = materials.filter((m) => !m.lesson_id);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">Clases</h2>
      {lessons.length === 0 && <p className="text-muted-foreground">Las clases se publican pronto.</p>}
      {lessons.map((l, i) => (
        <section key={l.id} className="haruen-card !p-6 flex flex-col gap-3" aria-labelledby={`lesson-${l.id}`}>
          <h3 id={`lesson-${l.id}`} className="text-xl font-bold">Clase {i + 1}: {l.title}</h3>
          {l.video_url && (
            <a href={l.video_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold underline underline-offset-4">
              <PlayCircle size={18} aria-hidden="true" /> Ver la clase
            </a>
          )}
          {l.body && <RichText text={l.body} />}
          <MaterialList items={materials.filter((m) => m.lesson_id === l.id)} onDownload={download} />
        </section>
      ))}
      {general.length > 0 && (
        <section className="haruen-card !p-6" aria-labelledby="general-materials">
          <h3 id="general-materials" className="text-xl font-bold mb-3">Material del taller</h3>
          <MaterialList items={general} onDownload={download} />
        </section>
      )}
    </div>
  );
}

function MaterialList({
  items,
  onDownload,
}: {
  items: { id: string; title: string; file_path: string; file_name: string; size_bytes: number }[];
  onDownload: (path: string, name: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <ul className="flex flex-col gap-2">
      {items.map((m) => (
        <li key={m.id}>
          <button
            type="button"
            onClick={() => onDownload(m.file_path, m.file_name)}
            className="w-full flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-left hover:bg-muted"
          >
            <FileText size={18} aria-hidden="true" />
            <span className="flex-1">
              <span className="block font-semibold">{m.title}</span>
              <span className="block text-xs text-muted-foreground">{m.file_name} · {formatBytes(m.size_bytes)}</span>
            </span>
            <Download size={16} aria-hidden="true" />
            <span className="sr-only">Descargar</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
