import { Link } from "@tanstack/react-router";
import { formatDate, type NewsDTO } from "@/lib/types";

export function NewsCard({ news }: { news: NewsDTO }) {
  return (
    <article className="haruen-card !p-0 overflow-hidden flex flex-col group">
      <div className="relative aspect-[16/10] bg-muted overflow-hidden">
        {news.coverUrl && (
          <img src={news.coverUrl} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        )}
      </div>
      <div className="p-5 flex flex-col gap-2 flex-1">
        {news.publishedAt && (
          <time dateTime={news.publishedAt} className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {formatDate(news.publishedAt)}
          </time>
        )}
        <h3 className="text-xl font-bold leading-snug">
          <Link to="/novedades/$slug" params={{ slug: news.slug }} className="after:absolute after:inset-0 relative hover:underline underline-offset-4">
            {news.title}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-3">{news.excerpt}</p>
      </div>
    </article>
  );
}
