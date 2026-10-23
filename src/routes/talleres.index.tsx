import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { GraduationCap } from "lucide-react";
import { workshopsQuery } from "@/lib/queries";
import { PageHeader, RouteError } from "@/components/shared/page-header";
import { WorkshopCard } from "@/components/workshops/workshop-card";

const TITLE = "Talleres virtuales | Centro Educativo Terapéutico Haruén";
const DESCRIPTION = "Talleres integrales de Haruén para aprender desde casa, con clases y material descargable.";

export const Route = createFileRoute("/talleres/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(workshopsQuery),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/talleres" }],
  }),
  errorComponent: ({ error }) => <RouteError error={error} />,
  component: WorkshopsIndex,
});

function WorkshopsIndex() {
  const { data } = useSuspenseQuery(workshopsQuery);
  return (
    <div className="min-h-screen bg-background pt-[88px]">
      <PageHeader icon={GraduationCap} eyebrow="Talleres virtuales" title="Aprendé con Haruén desde casa">
        Inscribite, sumate a las clases y descargá el material de cada taller.
      </PageHeader>
      <div className="haruen-container py-12">
        {data.length === 0 ? (
          <p className="haruen-card text-center text-muted-foreground">Estamos preparando los primeros talleres virtuales. Volvé pronto.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((w) => (
              <WorkshopCard key={w.id} workshop={w} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
