import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Newspaper } from "lucide-react";
import { newsListQuery } from "@/lib/queries";
import { PageHeader, RouteError } from "@/components/shared/page-header";
import { NewsCard } from "@/components/news/news-card";

const TITLE = "Novedades | Centro Educativo Terapéutico Haruén";
const DESCRIPTION = "Noticias, logros y eventos de la Comunidad Haruén en Córdoba.";

export const Route = createFileRoute("/novedades/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(newsListQuery),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/novedades" }],
  }),
  errorComponent: ({ error }) => <RouteError error={error} />,
  component: NewsIndex,
});

function NewsIndex() {
  const { data } = useSuspenseQuery(newsListQuery);
  return (
    <div className="min-h-screen bg-background pt-[88px]">
      <PageHeader icon={Newspaper} eyebrow="Novedades" title="Lo que pasa en Haruén">
        Logros, eventos y momentos de nuestra comunidad.
      </PageHeader>
      <div className="haruen-container py-12">
        {data.length === 0 ? (
          <p className="haruen-card text-center text-muted-foreground">Pronto vas a encontrar acá las primeras novedades.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((n) => (
              <NewsCard key={n.id} news={n} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
