import { Link } from "@tanstack/react-router";
import { CalendarDays, UserRound } from "lucide-react";
import { formatDate, type WorkshopDTO } from "@/lib/types";

export function WorkshopCard({ workshop }: { workshop: WorkshopDTO }) {
  return (
    <article className="haruen-card !p-0 overflow-hidden flex flex-col relative group">
      <div className="relative aspect-[16/10] bg-muted overflow-hidden">
        {workshop.coverUrl && (
          <img src={workshop.coverUrl} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        )}
        <span className="absolute top-3 left-3 rounded-full bg-primary text-primary-foreground text-xs font-bold px-3 py-1 capitalize">
          {workshop.modality}
        </span>
      </div>
      <div className="p-5 flex flex-col gap-2 flex-1">
        <h3 className="text-xl font-bold leading-snug">
          <Link to="/talleres/$slug" params={{ slug: workshop.slug }} className="after:absolute after:inset-0 hover:underline underline-offset-4">
            {workshop.title}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-3">{workshop.summary}</p>
        <div className="mt-auto pt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {workshop.teacher && (
            <span className="inline-flex items-center gap-1"><UserRound size={13} aria-hidden="true" /> {workshop.teacher}</span>
          )}
          {workshop.startsOn && (
            <span className="inline-flex items-center gap-1"><CalendarDays size={13} aria-hidden="true" /> Desde el {formatDate(workshop.startsOn)}</span>
          )}
        </div>
      </div>
    </article>
  );
}
