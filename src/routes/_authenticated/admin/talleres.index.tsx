import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader, Panel, StatusPill, errorText } from "@/components/admin/admin-ui";

export const Route = createFileRoute("/_authenticated/admin/talleres/")({ component: WorkshopsAdmin });

const STATUS = { published: ["Publicado", "ok"], draft: ["Borrador", "muted"], archived: ["Archivado", "muted"] } as const;

function WorkshopsAdmin() {
  const navigate = useNavigate();
  const { data } = useQuery({
    queryKey: ["admin", "workshops"],
    queryFn: async () => {
      const { data } = await supabase.from("workshops").select("id, title, status, position, enrollments:workshop_enrollments(status)").order("position");
      return data ?? [];
    },
  });

  async function create() {
    const { data: row, error } = await supabase
      .from("workshops")
      .insert({ title: "Nuevo taller", slug: `taller-${Date.now().toString(36)}`, position: Date.now() / 1000 })
      .select("id")
      .single();
    if (error) return toast.error(errorText(error));
    navigate({ to: "/admin/talleres/$id", params: { id: row.id } });
  }

  return (
    <>
      <AdminHeader
        title="Talleres virtuales"
        description="Publicá talleres, cargá clases y material, y aprobá inscripciones."
        actions={<button type="button" onClick={create} className="btn-pill btn-primary-gradient !py-2 text-sm inline-flex items-center gap-1.5"><Plus size={15} aria-hidden="true" /> Crear taller</button>}
      />
      <Panel className="!p-0">
        {!data?.length ? (
          <p className="p-6 text-muted-foreground">Creá el primer taller virtual para empezar a recibir inscripciones.</p>
        ) : (
          <ul className="divide-y divide-border">
            {data.map((w) => {
              const pending = w.enrollments.filter((e) => e.status === "pending").length;
              const approved = w.enrollments.filter((e) => e.status === "approved").length;
              const [label, tone] = STATUS[w.status as keyof typeof STATUS] ?? ["—", "muted"];
              return (
                <li key={w.id}>
                  <Link to="/admin/talleres/$id" params={{ id: w.id }} className="flex flex-wrap items-center justify-between gap-3 p-4 hover:bg-muted/40">
                    <span>
                      <span className="font-semibold block">{w.title}</span>
                      <span className="text-xs text-muted-foreground">{approved} inscriptos{pending > 0 && ` · ${pending} por aprobar`}</span>
                    </span>
                    <StatusPill tone={tone}>{label}</StatusPill>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </>
  );
}
