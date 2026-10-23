import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/shared/page-header";

export const Route = createFileRoute("/_authenticated/mis-talleres")({
  head: () => ({
    meta: [
      { title: "Mis talleres | Haruén" },
      { name: "description", content: "Tus talleres virtuales de Haruén." },
      { property: "og:title", content: "Mis talleres | Haruén" },
      { property: "og:description", content: "Tus talleres virtuales." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MyWorkshops,
});

const STATUS: Record<string, string> = { pending: "En revisión", approved: "Inscripción activa", revoked: "Inscripción inactiva" };

function MyWorkshops() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["my-enrollments", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workshop_enrollments")
        .select("id, status, workshop:workshops(slug, title, summary)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="min-h-screen bg-background pt-[88px]">
      <PageHeader icon={GraduationCap} eyebrow="Mi cuenta" title="Mis talleres" />
      <div className="haruen-container py-12">
        {isLoading ? (
          <div className="haruen-card h-24 animate-pulse" aria-hidden="true" />
        ) : !data || data.length === 0 ? (
          <div className="haruen-card text-center py-12">
            <p className="font-bold text-lg mb-2">Todavía no te inscribiste en ningún taller</p>
            <Link to="/talleres" className="btn-pill btn-primary-gradient mt-3">Explorar talleres</Link>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {data.map((e) =>
              e.workshop ? (
                <li key={e.id} className="haruen-card flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{STATUS[e.status] ?? e.status}</span>
                  <h2 className="text-xl font-bold">{e.workshop.title}</h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">{e.workshop.summary}</p>
                  <Link to="/talleres/$slug" params={{ slug: e.workshop.slug }} className="btn-pill btn-primary-gradient self-start mt-2">
                    {e.status === "approved" ? "Ir a las clases" : "Ver el taller"}
                  </Link>
                </li>
              ) : null,
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
