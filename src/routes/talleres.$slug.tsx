import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, MonitorPlay, UserRound } from "lucide-react";
import { workshopQuery } from "@/lib/queries";
import { formatDate } from "@/lib/types";
import { RouteError } from "@/components/shared/page-header";
import { RichText } from "@/components/shared/rich-text";
import { WorkshopAccess } from "@/components/workshops/workshop-access";

export const Route = createFileRoute("/talleres/$slug")({
  loader: async ({ context, params }) => {
    const w = await context.queryClient.ensureQueryData(workshopQuery(params.slug));
    if (!w) throw notFound();
    return { title: w.title, summary: w.summary };
  },
  head: ({ loaderData, params }) => {
    const title = loaderData ? `${loaderData.title} | Talleres Haruén` : "Taller no disponible | Haruén";
    const description = loaderData?.summary || "Talleres virtuales de Haruén.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(loaderData ? [] : [{ name: "robots", content: "noindex" }]),
      ],
      links: [{ rel: "canonical", href: `/talleres/${params.slug}` }],
    };
  },
  errorComponent: ({ error }) => <RouteError error={error} />,
  notFoundComponent: () => (
    <div className="haruen-container pt-[140px] pb-20 text-center">
      <h1 className="text-2xl font-bold mb-4">Este taller no está disponible</h1>
      <Link to="/talleres" className="btn-pill btn-primary-gradient">Ver los talleres</Link>
    </div>
  ),
  component: WorkshopPage,
});

function WorkshopPage() {
  const { slug } = Route.useParams();
  const { data: w } = useSuspenseQuery(workshopQuery(slug));
  if (!w) return null;
  return (
    <div className="min-h-screen bg-background pt-[104px] pb-16">
      <div className="haruen-container">
        <Link to="/talleres" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft size={14} aria-hidden="true" /> Todos los talleres
        </Link>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-5">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">{w.title}</h1>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <li className="inline-flex items-center gap-1.5 capitalize"><MonitorPlay size={15} aria-hidden="true" /> {w.modality}</li>
              {w.teacher && <li className="inline-flex items-center gap-1.5"><UserRound size={15} aria-hidden="true" /> {w.teacher}</li>}
              {w.startsOn && (
                <li className="inline-flex items-center gap-1.5">
                  <CalendarDays size={15} aria-hidden="true" /> {formatDate(w.startsOn)}{w.endsOn ? ` al ${formatDate(w.endsOn)}` : ""}
                </li>
              )}
            </ul>
            {w.coverUrl && <img src={w.coverUrl} alt="" className="w-full rounded-[var(--radius)] aspect-[16/9] object-cover" />}
            {w.summary && <p className="text-xl text-muted-foreground">{w.summary}</p>}
            {w.description && <RichText text={w.description} />}
          </div>
          <div>
            <WorkshopAccess workshopId={w.id} slug={w.slug} />
          </div>
        </div>
      </div>
    </div>
  );
}
