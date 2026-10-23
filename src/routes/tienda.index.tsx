import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { z } from "zod";
import { ShoppingBag, Search, MessageCircle } from "lucide-react";
import { productsQuery } from "@/lib/queries";
import { ProductCard } from "@/components/commerce/product-card";
import { PageHeader, RouteError } from "@/components/shared/page-header";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { whatsappLink } from "@/lib/whatsapp";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  category: z.string().max(80).optional().catch(undefined),
  q: z.string().max(120).optional().catch(undefined),
  sort: z.enum(["destacados", "nuevos", "precio-asc", "precio-desc"]).optional().catch(undefined),
});

const TITLE = "Tienda Solidaria | Centro Educativo Terapéutico Haruén";
const DESCRIPTION =
  "Comprá piezas únicas de vitrofusión y productos artesanales creados por nuestros alumnos. Cada compra ayuda a sostener el centro.";

export const Route = createFileRoute("/tienda/")({
  validateSearch: (s) => searchSchema.parse(s),
  loaderDeps: ({ search }) => ({ category: search.category, q: search.q, sort: search.sort }),
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(productsQuery(deps)),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/tienda" }],
  }),
  errorComponent: ({ error }) => <RouteError error={error} />,
  component: TiendaPage,
});

const SORTS = [
  { value: "destacados", label: "Destacados" },
  { value: "nuevos", label: "Más nuevos" },
  { value: "precio-asc", label: "Menor precio" },
  { value: "precio-desc", label: "Mayor precio" },
] as const;

function TiendaPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/tienda/" });
  const { data } = useSuspenseQuery(productsQuery({ category: search.category, q: search.q, sort: search.sort }));
  const { whatsappNumber } = useSiteSettings();
  const [term, setTerm] = useState(search.q ?? "");

  useEffect(() => {
    const t = setTimeout(() => {
      if ((search.q ?? "") !== term) navigate({ search: (prev) => ({ ...prev, q: term || undefined }), replace: true });
    }, 350);
    return () => clearTimeout(t);
  }, [term, search.q, navigate]);

  return (
    <div className="min-h-screen bg-background pt-[88px]">
      <PageHeader icon={ShoppingBag} eyebrow="Tienda solidaria" title="Arte hecho con amor">
        Cada pieza es única, creada a mano por nuestros alumnos. Tu compra sostiene el centro.
      </PageHeader>

      <div className="haruen-container py-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
          <nav aria-label="Categorías" className="flex flex-wrap gap-2">
            <Link
              to="/tienda"
              search={(prev) => ({ ...prev, category: undefined })}
              className={cn("rounded-full px-4 py-2 text-sm font-semibold border border-border", !search.category ? "bg-foreground text-background" : "bg-card hover:bg-muted")}
            >
              Todo
            </Link>
            {data.categories.map((c) => (
              <Link
                key={c.id}
                to="/tienda"
                search={(prev) => ({ ...prev, category: c.slug })}
                className={cn("rounded-full px-4 py-2 text-sm font-semibold border border-border", search.category === c.slug ? "bg-foreground text-background" : "bg-card hover:bg-muted")}
              >
                {c.name}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                type="search"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Buscar productos"
                aria-label="Buscar productos"
                className="pl-9 sm:w-64"
              />
            </div>
            <label className="sr-only" htmlFor="sort">Ordenar por</label>
            <select
              id="sort"
              value={search.sort ?? "destacados"}
              onChange={(e) => navigate({ search: (prev) => ({ ...prev, sort: e.target.value as (typeof SORTS)[number]["value"] }) })}
              className="h-10 rounded-md border border-input bg-card px-3 text-sm"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4" aria-live="polite">
          {data.products.length} {data.products.length === 1 ? "producto" : "productos"}
        </p>

        {data.products.length === 0 ? (
          <div className="haruen-card text-center py-14">
            <p className="font-bold text-lg mb-2">No encontramos piezas con ese filtro</p>
            <p className="text-muted-foreground mb-5">Probá con otra búsqueda o mirá todo el catálogo.</p>
            <Link to="/tienda" className="btn-pill btn-primary-gradient">Ver todo el catálogo</Link>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">¿Querés encargar algo a medida?</p>
          <a
            href={whatsappLink(whatsappNumber, "¡Hola Haruén! 👋 Me gustaría encargar una pieza a medida.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill btn-sunset-gradient inline-flex items-center gap-2 text-sm"
          >
            <MessageCircle size={15} aria-hidden="true" />
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
