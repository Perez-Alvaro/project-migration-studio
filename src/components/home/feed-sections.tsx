import { Link } from "@tanstack/react-router";
import { GraduationCap, Newspaper } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { NewsCard } from "@/components/news/news-card";
import { WorkshopCard } from "@/components/workshops/workshop-card";
import type { NewsDTO, SectionContent, WorkshopDTO } from "@/lib/types";

export function NewsSection({ news, content }: { news: NewsDTO[]; content?: SectionContent }) {
  if (news.length === 0) return null;
  return (
    <section id="novedades" className="haruen-section bg-muted/40 scroll-mt-24">
      <div className="haruen-container">
        <FadeIn className="mb-10 flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="haruen-badge"><Newspaper size={14} aria-hidden="true" /><span>Novedades</span></div>
          <h2 className="text-clamp-h2 font-bold">{content?.title || "Lo último de Haruén"}</h2>
          {content?.subtitle && <p className="mt-3 text-lg text-muted-foreground">{content.subtitle}</p>}
        </FadeIn>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((n) => <NewsCard key={n.id} news={n} />)}
        </div>
        <div className="mt-10 text-center">
          <Link to="/novedades" className="btn-pill btn-secondary-neutral">Ver todas las novedades</Link>
        </div>
      </div>
    </section>
  );
}

export function WorkshopsSection({ workshops, content }: { workshops: WorkshopDTO[]; content?: SectionContent }) {
  if (workshops.length === 0) return null;
  return (
    <section id="talleres" className="haruen-section bg-background scroll-mt-24">
      <div className="haruen-container">
        <FadeIn className="mb-10 flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="haruen-badge"><GraduationCap size={14} aria-hidden="true" /><span>Talleres virtuales</span></div>
          <h2 className="text-clamp-h2 font-bold">{content?.title || "Aprendé con nosotros desde casa"}</h2>
          {content?.subtitle && <p className="mt-3 text-lg text-muted-foreground">{content.subtitle}</p>}
        </FadeIn>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {workshops.map((w) => <WorkshopCard key={w.id} workshop={w} />)}
        </div>
        <div className="mt-10 text-center">
          <Link to="/talleres" className="btn-pill btn-secondary-neutral">Ver todos los talleres</Link>
        </div>
      </div>
    </section>
  );
}
