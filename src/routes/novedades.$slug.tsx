import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { newsQuery } from "@/lib/queries";
import { formatDate } from "@/lib/types";
import { RouteError } from "@/components/shared/page-header";
import { RichText } from "@/components/shared/rich-text";

export const Route = createFileRoute("/novedades/$slug")({
  loader: async ({ context, params }) => {
    const n = await context.queryClient.ensureQueryData(newsQuery(params.slug));
    if (!n) throw notFound();
    return { title: n.title, excerpt: n.excerpt };
  },
  head: ({ loaderData, params }) => {
    const title = loaderData ? `${loaderData.title} | Novedades Haruén` : "Novedad no disponible | Haruén";
    const description = loaderData?.excerpt || "Novedades de la Comunidad Haruén.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(loaderData ? [] : [{ name: "robots", content: "noindex" }]),
      ],
      links: [{ rel: "canonical", href: `/novedades/${params.slug}` }],
    };
  },
  errorComponent: ({ error }) => <RouteError error={error} />,
  notFoundComponent: () => (
    <div className="haruen-container pt-[140px] pb-20 text-center">
      <h1 className="text-2xl font-bold mb-4">Esta novedad ya no está publicada</h1>
      <Link to="/novedades" className="btn-pill btn-primary-gradient">Ver todas las novedades</Link>
    </div>
  ),
  component: NewsPage,
});

function NewsPage() {
  const { slug } = Route.useParams();
  const { data: n } = useSuspenseQuery(newsQuery(slug));
  if (!n) return null;
  return (
    <article className="min-h-screen bg-background pt-[104px] pb-16">
      <div className="haruen-container max-w-3xl">
        <Link to="/novedades" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft size={14} aria-hidden="true" /> Todas las novedades
        </Link>
        {n.publishedAt && (
          <time dateTime={n.publishedAt} className="block text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            {formatDate(n.publishedAt)}
          </time>
        )}
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">{n.title}</h1>
        {n.excerpt && <p className="text-xl text-muted-foreground mb-8">{n.excerpt}</p>}
        {n.coverUrl && (
          <img src={n.coverUrl} alt="" className="w-full rounded-[var(--radius)] mb-8 aspect-[16/9] object-cover" />
        )}
        <RichText text={n.body} />
      </div>
    </article>
  );
}
